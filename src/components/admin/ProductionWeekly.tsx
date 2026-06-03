import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const TEAM = ["Lisandro", "Ailen"];
const EDGE_FN = "gas-calendar";

const TIPOS = [
  { letra: "P", label: "Producción", color: "#e67e22" },
  { letra: "C", label: "Compras", color: "#7f8c8d" },
  { letra: "O", label: "Organización", color: "#2980b9" },
  { letra: "R", label: "Redes", color: "#27ae60" },
];

const MESES: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
};

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const STATUS: Record<string, { label: string; bg: string; text: string; next: string }> = {
  pending: { label: "Pendiente", bg: "#f0f0f0", text: "#666", next: "in_progress" },
  in_progress: { label: "En progreso", bg: "#fff3cd", text: "#856404", next: "done" },
  done: { label: "✓ Listo", bg: "#d4edda", text: "#155724", next: "pending" },
};

interface Task {
  id: string;
  type: string | null;
  title: string;
  date: string;
  time_start: string | null;
  time_end: string | null;
  status: string;
  assigned_to: string | null;
}

function parseTask(input: string) {
  const regex = /^(?:([PCORpcor])\s+)?([^,]+),\s*(\d{1,2})(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)(?:,\s*(\d{1,2})(?::(\d{2}))?(?:\s+a\s+(\d{1,2})(?::(\d{2}))?)?)?/i;
  const m = input.trim().match(regex);
  if (!m) return null;
  const [, type, title, day, monStr, hS, mS, hE, mE] = m;
  const year = new Date().getFullYear();
  const month = MESES[monStr.toLowerCase()];
  const date = new Date(year, month, parseInt(day)).toISOString().split("T")[0];
  const timeStart = hS ? `${hS.padStart(2, "0")}:${(mS || "00").padStart(2, "0")}` : null;
  const timeEnd = hE ? `${hE.padStart(2, "0")}:${(mE || "00").padStart(2, "0")}` : null;
  return { type: type?.toUpperCase() || null, title: title.trim(), date, time_start: timeStart, time_end: timeEnd };
}

function getWeekDates(base: Date) {
  const d = new Date(base);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(d);
    dd.setDate(d.getDate() + diff + i);
    return dd;
  });
}

function fmtISO(d: Date) { return d.toISOString().split("T")[0]; }
function fmtLabel(d: Date) {
  const mm = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d.getDate()} ${mm[d.getMonth()]}`;
}
function fmtRange(dates: Date[]) {
  return `${fmtLabel(dates[0])} – ${fmtLabel(dates[6])} ${dates[0].getFullYear()}`;
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0",
  borderRadius: 8, fontSize: 14, color: "#333", background: "white",
  boxSizing: "border-box", outline: "none", transition: "border-color 0.15s",
};

const navBtnStyle: React.CSSProperties = {
  padding: "6px 12px", background: "white", border: "1.5px solid #eee",
  borderRadius: 8, fontSize: 13, color: "#555", cursor: "pointer", fontWeight: 500,
};

export default function ProductionWeekly() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [frase, setFrase] = useState("");
  const [assigned, setAssigned] = useState("");
  const [weekBase, setWeekBase] = useState(new Date());
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const weekDates = getWeekDates(weekBase);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekBase]);

  async function fetchTasks() {
    const from = fmtISO(weekDates[0]);
    const to = fmtISO(weekDates[6]);
    const { data, error } = await supabase
      .from("production_tasks")
      .select("*")
      .gte("date", from)
      .lte("date", to)
      .order("date", { ascending: true })
      .order("time_start", { ascending: true, nullsFirst: true });
    if (!error) setTasks((data as Task[]) || []);
  }

  async function handleAdd() {
    const parsed = parseTask(frase);
    if (!parsed) {
      setStatus({ ok: false, msg: "Formato inválido. Revisá la guía." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const { error: dbErr } = await supabase
        .from("production_tasks")
        .insert([{ ...parsed, status: "pending", assigned_to: assigned || null }]);
      if (dbErr) throw new Error(dbErr.message);

      const { error: fnErr } = await supabase.functions.invoke(EDGE_FN, {
        body: { task: frase.trim(), token: "burritos2026!DULC1" },
      });
      if (fnErr) console.warn("Calendar sync falló:", fnErr.message);

      setStatus({ ok: true, msg: `✅ "${parsed.title}" agregada${fnErr ? " (sin sync al calendario)" : " y sincronizada al calendario"}` });
      setFrase("");
      setAssigned("");
      fetchTasks();
    } catch (e: any) {
      setStatus({ ok: false, msg: "❌ " + e.message });
    } finally {
      setLoading(false);
    }
  }

  async function cycleStatus(task: Task) {
    const next = STATUS[task.status]?.next || "pending";
    await supabase.from("production_tasks").update({ status: next }).eq("id", task.id);
    setTasks(t => t.map(x => x.id === task.id ? { ...x, status: next } : x));
  }

  async function changeAssigned(id: string, val: string) {
    await supabase.from("production_tasks").update({ assigned_to: val || null }).eq("id", id);
    setTasks(t => t.map(x => x.id === id ? { ...x, assigned_to: val || null } : x));
  }

  async function deleteTask(id: string) {
    await supabase.from("production_tasks").delete().eq("id", id);
    setTasks(t => t.filter(x => x.id !== id));
  }

  const tipoActivo = TIPOS.find(t => new RegExp(`^${t.letra}\\s`, "i").test(frase));

  function insertarTipo(letra: string) {
    const sinPrefijo = frase.replace(/^[PCORpcor]\s+/, "");
    setFrase(`${letra} ${sinPrefijo}`);
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 900, margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#1a1a1a" }}>📋 Producción semanal</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>Burritos de Dulcinea</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 8 }}>
        <button onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); }} style={navBtnStyle}>← Anterior</button>
        <span style={{ fontSize: 14, color: "#555", fontWeight: 600 }}>{fmtRange(weekDates)}</span>
        <button onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); }} style={navBtnStyle}>Siguiente →</button>
      </div>

      <div style={{ background: "#fafafa", padding: 16, borderRadius: 10, marginBottom: 20, border: "1px solid #eee" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15, color: "#333" }}>Nueva tarea</h3>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {TIPOS.map(t => {
            const activo = tipoActivo?.letra === t.letra;
            return (
              <button key={t.letra} onClick={() => insertarTipo(t.letra)} style={{
                padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${activo ? t.color : "#ddd"}`,
                background: activo ? t.color : "white", color: activo ? "white" : "#555",
                fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
              }}>{t.letra} — {t.label}</button>
            );
          })}
        </div>

        <input
          type="text"
          value={frase}
          onChange={e => setFrase(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder="Ej: P Masas Mandy, 15may, 8:30 a 13:30"
          style={{ ...inputStyle, borderColor: tipoActivo ? tipoActivo.color : "#e0e0e0", marginBottom: 8 }}
        />

        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <select value={assigned} onChange={e => setAssigned(e.target.value)} style={{ ...inputStyle, flex: 1, cursor: "pointer" }}>
            <option value="">👤 Sin asignar</option>
            {TEAM.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={handleAdd} disabled={loading || !frase.trim()} style={{
            padding: "9px 18px", background: loading || !frase.trim() ? "#ddd" : "#e67e22",
            color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: loading || !frase.trim() ? "not-allowed" : "pointer",
          }}>{loading ? "..." : "Agregar"}</button>
        </div>

        <div style={{ fontSize: 11, color: "#999", lineHeight: 1.6 }}>
          Con horario: <code>P Masas, 15may, 8:30 a 13:30</code> · Sin horario: <code>C Comprar pollo, 16may</code> · Sin tipo: <code>Tenis, 26may, 14 a 15:30</code>
        </div>

        {status && (
          <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 8,
            background: status.ok ? "#eafaf1" : "#fdecea",
            color: status.ok ? "#1e8449" : "#c0392b",
            fontSize: 13, fontWeight: 500,
            border: `1px solid ${status.ok ? "#a9dfbf" : "#f5c6c6"}`,
          }}>{status.msg}</div>
        )}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 10, overflow: "hidden", background: "white" }}>
        {weekDates.map((date, i) => {
          const iso = fmtISO(date);
          const dayTasks = tasks.filter(t => t.date === iso);
          const isToday = iso === fmtISO(new Date());
          const total = dayTasks.length;
          const done = dayTasks.filter(t => t.status === "done").length;

          return (
            <div key={iso} style={{ borderBottom: i < 6 ? "1px solid #f0f0f0" : "none" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px",
                background: isToday ? "#fff8e1" : total > 0 ? "#fafafa" : "#f5f5f5",
              }}>
                <strong style={{ fontSize: 13, color: isToday ? "#e67e22" : "#444" }}>
                  {DIAS[i]} {fmtLabel(date)}{isToday ? " · Hoy" : ""}
                </strong>
                {total > 0 && <span style={{ fontSize: 11, color: "#888" }}>{done}/{total} listas</span>}
              </div>

              {dayTasks.length === 0 ? (
                <div style={{ padding: "8px 14px", fontSize: 12, color: "#bbb", fontStyle: "italic" }}>Sin tareas</div>
              ) : (
                <div>
                  {dayTasks.map((task, idx) => {
                    const tipo = TIPOS.find(t => t.letra === task.type);
                    const st = STATUS[task.status] || STATUS.pending;
                    return (
                      <div key={task.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 14px",
                        borderTop: idx > 0 ? "1px solid #f5f5f5" : "none",
                        background: "white",
                        opacity: task.status === "done" ? 0.6 : 1,
                      }}>
                        <div style={{
                          width: 4, height: 28, borderRadius: 2,
                          background: tipo?.color || "#ddd",
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, color: "#333", fontWeight: 500,
                            textDecoration: task.status === "done" ? "line-through" : "none",
                          }}>{task.title}</div>
                          <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                            {task.time_start
                              ? `${task.time_start}${task.time_end ? ` a ${task.time_end}` : ""}`
                              : "Sin horario"}
                            {tipo ? ` · ${tipo.label}` : ""}
                          </div>
                        </div>
                        <select value={task.assigned_to || ""} onChange={e => changeAssigned(task.id, e.target.value)}
                          style={{ fontSize: 12, border: "1px solid #eee", borderRadius: 6, padding: "3px 6px", color: "#555", background: "white", cursor: "pointer" }}>
                          <option value="">— Nadie</option>
                          {TEAM.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <button onClick={() => cycleStatus(task)} style={{
                          padding: "3px 10px", borderRadius: 20, border: "none",
                          background: st.bg, color: st.text,
                          fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                        }}>{st.label}</button>
                        <button onClick={() => deleteTask(task.id)} style={{
                          background: "none", border: "none", color: "#ddd", cursor: "pointer",
                          fontSize: 16, padding: "0 2px", lineHeight: 1,
                        }} title="Eliminar">×</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
