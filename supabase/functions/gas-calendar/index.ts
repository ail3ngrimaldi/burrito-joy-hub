import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GAS_URL = Deno.env.get("GAS_URL")!;
const GAS_SECRET_TOKEN = Deno.env.get("GAS_SECRET_TOKEN")!;

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { task } = body;

    if (!task || typeof task !== "string") {
      return new Response(JSON.stringify({ error: "Campo 'task' requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, token: GAS_SECRET_TOKEN }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
