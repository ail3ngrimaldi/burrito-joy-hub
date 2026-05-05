const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-background py-16 px-6 md:px-8">
      <article className="max-w-3xl mx-auto prose prose-sm md:prose-base">
        <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString("es-AR")}
        </p>

        <section className="space-y-4 text-foreground/90">
          <p>
            En <strong>Los Burritos de Dulcinea</strong> respetamos tu privacidad. Esta política
            describe qué datos recopilamos, cómo los usamos y qué derechos tenés sobre ellos.
          </p>

          <h2 className="text-xl font-semibold mt-8">1. Datos que recopilamos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nombre y número de teléfono que nos compartís al hacer un pedido.</li>
            <li>Dirección de entrega y código postal para coordinar el envío.</li>
            <li>Detalles del pedido (productos, cantidades, fecha de entrega).</li>
            <li>
              Mensajes que nos envíes a través de WhatsApp y el nombre público asociado a tu
              cuenta de WhatsApp.
            </li>
            <li>
              Datos técnicos básicos del navegador (preferencia de idioma, contenido del
              carrito) almacenados localmente para mejorar tu experiencia.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">2. Cómo usamos tus datos</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Procesar y entregar tu pedido.</li>
            <li>Comunicarnos con vos sobre el estado del pedido por WhatsApp.</li>
            <li>Calcular el costo de envío en función de tu zona.</li>
            <li>Mejorar nuestro catálogo y la atención al cliente.</li>
          </ul>
          <p>No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>

          <h2 className="text-xl font-semibold mt-8">3. WhatsApp Business</h2>
          <p>
            Usamos la API oficial de WhatsApp Business (Meta) para responder consultas y tomar
            pedidos. Al escribirnos por WhatsApp, Meta procesa el mensaje según su propia
            política de privacidad.
          </p>

          <h2 className="text-xl font-semibold mt-8">4. Almacenamiento y seguridad</h2>
          <p>
            Los pedidos se guardan en una base de datos protegida con políticas de acceso
            estrictas. Solo el equipo de Los Burritos de Dulcinea puede consultarlos. Aplicamos
            buenas prácticas de seguridad para evitar accesos no autorizados.
          </p>

          <h2 className="text-xl font-semibold mt-8">5. Conservación</h2>
          <p>
            Los pedidos se conservan mientras sean necesarios para fines operativos y
            contables. Los carritos abandonados se eliminan automáticamente a los 30 días.
          </p>

          <h2 className="text-xl font-semibold mt-8">6. Tus derechos</h2>
          <p>
            Podés solicitar acceso, rectificación o eliminación de tus datos personales en
            cualquier momento. Consultá las{" "}
            <a href="/data-deletion" className="underline">
              instrucciones de eliminación de datos
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold mt-8">7. Contacto</h2>
          <p>
            Para cualquier consulta sobre privacidad, escribinos por WhatsApp al{" "}
            <a
              href="https://wa.me/5491124003293"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              +54 9 11 2400 3293
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
};

export default PrivacyPolicy;
