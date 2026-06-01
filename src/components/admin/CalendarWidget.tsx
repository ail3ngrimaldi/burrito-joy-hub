import { useState, useRef } from "react";

const GAS_URL = "https://script.google.com/macros/library/d/19WLtR7UXOKfUMD1KV7X2VAw5YGpNC-bkCxdrx3a9fEr6GGVKXwXSG1vT/9";
const SECRET_TOKEN = "burritos2026!DULC1";

const TIPOS = [
  { letra: "P", label: "Producción", color: "#e67e22" },
  { letra: "C", label: "Compras", color: "#7f8c8d" },
  { letra: "O", label: "Organización", color: "#2980b9" },
  { letra: "R", label: "Redes", color: "#27ae60" },
];

export default function CalendarWidget() {
  const [frase, setFrase] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function insertarTipo(letra: string) {
    const input = inputRef.current;
    if (!input) return;
    const sinPrefijo = frase.replace(/^[PCORpcor]\s+/, "");
    const nueva = `${letra} ${sinPrefijo}`;
    setFrase(nueva);
    input.focus();
  }

  async function handleSubmit() {
    const task = frase.trim();
    if (!task) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        body: JSON.stringify({ task, token: SECRET_TOKEN }),
      });
      const data = await res.json();
      if (data.error) {
        setStatus({ ok: false, msg: data.error });
      } else {
        setStatus({ ok: true, msg: data.message });
        setFrase("");
      }
    } catch (e) {
      setStatus({ ok: false, msg: "Error de conexión con Google Apps Script." });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  const tipoActivo = TIPOS.find(t =>
    new RegExp(`^${t.letra}\\s`, "i").test(frase)
  );

  return (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif",
      maxWidth: 500,
      margin: "0 auto",
      padding: "24px 20px",
    }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>
          🌯 Nuevo evento
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>
          Agenda de Burritos de Dulcinea
        </p>
      </div>

      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "#aaa" }}>
          Tipo (opcional — también podés escribir la letra directo):
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TIPOS.map(t => {
            const activo = tipoActivo?.letra.toUpperCase() === t.letra.toUpperCase();
            return (
              <button
                key={t.letra}
                onClick={() => insertarTipo(t.letra)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  border: `1.5px solid ${activo ? t.color : "#ddd"}`,
                  background: activo ? t.color : "white",
                  color: activo ? "white" : "#555",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t.letra} — {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          ref={inputRef}
          type="text"
          value={frase}
          onChange={e => setFrase(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: P Masas Mandy, 15may, 9 a 11"
          style={{
            width: "100%",
            padding: "11px 14px",
            border: `1.5px solid ${tipoActivo ? tipoActivo.color : "#e0e0e0"}`,
            borderRadius: 8,
            fontSize: 15,
            color: "#333",
            background: "white",
            boxSizing: "border-box",
            outline: "none",
            transition: "border-color 0.15s",
          }}
        />
      </div>

      <div style={{
        background: "#fdf6e3",
        borderLeft: "4px solid #e67e22",
        borderRadius: "0 8px 8px 0",
        padding: "10px 14px",
        marginBottom: 16,
        fontSize: 12,
        color: "#666",
        lineHeight: 1.7,
      }}>
        <strong style={{ color: "#444" }}>💡 Formato:</strong>
        {" "}<code>[Tipo] Tarea, DDmes, HH:MM a HH:MM</code><br />
        <span style={{ color: "#aaa" }}>Con horario: </span><code>P Masas, 15may, 8:30 a 13:30</code><br />
        <span style={{ color: "#aaa" }}>Solo inicio: </span><code>O Reunión, 20may, 9</code> → 5 min desde las 9<br />
        <span style={{ color: "#aaa" }}>Sin horario: </span><code>C Comprar pollo, 16may</code> → 5 min a las 8:00<br />
        <span style={{ color: "#aaa" }}>Sin tipo: </span><code>Tenis, 26may, 14 a 15:30</code> → sin clasificar
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !frase.trim()}
        style={{
          width: "100%",
          padding: "12px",
          background: loading || !frase.trim() ? "#ddd" : "#e67e22",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 600,
          cursor: loading || !frase.trim() ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Creando evento..." : "Crear evento en Google Calendar"}
      </button>

      {status && (
        <div style={{
          marginTop: 14,
          padding: "10px 14px",
          borderRadius: 8,
          background: status.ok ? "#eafaf1" : "#fdecea",
          color: status.ok ? "#1e8449" : "#c0392b",
          fontSize: 14,
          fontWeight: 500,
          border: `1px solid ${status.ok ? "#a9dfbf" : "#f5c6c6"}`,
        }}>
          {status.msg}
        </div>
      )}
    </div>
  );
}
