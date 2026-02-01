import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types
interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

interface WebhookEntry {
  changes: Array<{
    value: {
      messages?: WhatsAppMessage[];
      contacts?: Array<{ profile: { name: string }; wa_id: string }>;
    };
  }>;
}

// Get product stock from database
async function getProductStock(supabase: any) {
  const { data, error } = await supabase
    .from("product_stock")
    .select("product_id, size, quantity");
  
  if (error) {
    console.error("Error fetching stock:", error);
    return null;
  }
  return data;
}

// Product catalog for AI context
const productCatalog = `
CATÁLOGO DE PRODUCTOS - Los Burritos de Dulcinea:

1. Bondiocheddar (M: $9,500 / L: $13,000)
   - Bondiola desmechada cocinada a fuego lento, cebolla caramelizada, zanahorias en cubo y cheddar fundido.

2. Pollo Mex (M: $9,000 / L: $12,000)
   - Suprema desmechada con cebolla y morrón salteados, palta, limón y cheddar fundido.

3. Bolognesa Veggie (M: $6,500 / L: $8,500)
   - Salsa Bolognesa con soja texturizada, cebolla, morrón, ajo y queso fresco. Vegetariano.

4. Bolognesa (M: $9,500 / L: $14,000)
   - Carne picada con salsa bolognesa casera, queso fundido y especias.

5. Carne desmechada (M: $9,500 / L: $13,500)
   - Carne roja desmechada, cebolla y morrón salteados con queso fundido.

TAMAÑOS:
- M (Mediano): 360g
- L (Grande): 500g

ZONAS DE ENTREGA (códigos postales):
- Martínez/San Isidro: 1640-1644
- Boulogne/San Isidro: 1610-1613
- Olivos/Vicente López: 1636-1639
- Florida/Vicente López: 1602-1608
- Villa Martelli: 1607-1608
- San Fernando: 1646-1648

ENTREGAS: Jueves y Viernes
`;

// Use Lovable AI to interpret the message and generate a response
async function generateAIResponse(
  message: string,
  customerName: string,
  stockInfo: string
): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not configured");
    return "¡Hola! Gracias por contactarnos. En este momento estamos teniendo problemas técnicos. Por favor, intentá de nuevo más tarde.";
  }

  const systemPrompt = `Sos el asistente virtual de "Los Burritos de Dulcinea", un emprendimiento de burritos artesanales en Buenos Aires.

Tu personalidad:
- Amable, cálido y argentino (usás "vos" en lugar de "tú")
- Conciso pero informativo
- Entusiasta sobre los productos

${productCatalog}

STOCK ACTUAL:
${stockInfo}

INSTRUCCIONES:
1. Si preguntan por productos/precios/ingredientes: Respondé con la info del catálogo.
2. Si preguntan por zonas de entrega: Mencioná las zonas y códigos postales.
3. Si preguntan por stock: Usá la información de STOCK ACTUAL.
4. Si hacen un pedido (mencionan querer comprar/pedir burritos):
   - Confirmá el pedido
   - Pedí horarios disponibles para Jueves o Viernes
   - Mencioná que pueden hacer transferencia a "burritosdulcinea"
   - Ejemplo: "¡Hola ${customerName}! Tu pedido fue tomado. Ahora necesitamos que nos des opciones de horarios para pasar por tu casa el Jueves o Viernes. Si querés, podés ir haciendo una transferencia a burritosdulcinea por el monto de $[TOTAL]"
5. Si el saludo es genérico: Saludá y ofrecé ayuda.

IMPORTANTE: 
- Siempre mencioná el nombre del cliente (${customerName}) cuando sea apropiado.
- Si algo está sin stock, sugerí alternativas.
- Mantené las respuestas cortas (máximo 3-4 oraciones).`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", response.status);
      return `¡Hola ${customerName}! Gracias por escribirnos. En breve te respondemos. 🌯`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || `¡Hola ${customerName}! Gracias por tu mensaje. Te respondemos pronto.`;
  } catch (error) {
    console.error("Error calling AI:", error);
    return `¡Hola ${customerName}! Gracias por contactarnos. Te respondemos a la brevedad. 🌯`;
  }
}

// Send message via WhatsApp API
async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("WhatsApp API error:", error);
      return false;
    }

    console.log("Message sent successfully to:", to);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Webhook verification (GET request from Meta)
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified successfully");
      return new Response(challenge, { status: 200 });
    } else {
      console.error("Webhook verification failed");
      return new Response("Forbidden", { status: 403 });
    }
  }

  // Handle incoming messages (POST request)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("Received webhook:", JSON.stringify(body));

      // Validate it's a WhatsApp message
      if (body.object !== "whatsapp_business_account") {
        return new Response("Not a WhatsApp event", { status: 200 });
      }

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Process each entry
      for (const entry of body.entry as WebhookEntry[]) {
        for (const change of entry.changes) {
          const value = change.value;

          if (value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const contact = value.contacts?.[0];
            const customerName = contact?.profile?.name || "Cliente";
            const from = message.from;

            // Only process text messages
            if (message.type === "text" && message.text?.body) {
              const incomingMessage = message.text.body;
              console.log(`Message from ${customerName} (${from}): ${incomingMessage}`);

              // Get current stock
              const stockData = await getProductStock(supabase);
              const stockInfo = stockData
                ? stockData.map((s: any) => `${s.product_id} ${s.size}: ${s.quantity} unidades`).join("\n")
                : "Stock no disponible";

              // Generate AI response
              const aiResponse = await generateAIResponse(
                incomingMessage,
                customerName,
                stockInfo
              );

              // Send response
              await sendWhatsAppMessage(from, aiResponse);
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
