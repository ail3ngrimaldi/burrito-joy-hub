const DataDeletion = () => {
  const waNumber = "5491124003293";
  const waMessage = encodeURIComponent(
    "Hola! Quiero solicitar la eliminación de mis datos personales. Mi nombre / teléfono es: ",
  );

  return (
    <main className="min-h-screen bg-background py-16 px-6 md:px-8">
      <article className="max-w-3xl mx-auto prose prose-sm md:prose-base">
        <h1 className="text-3xl font-bold mb-2">Eliminación de datos del usuario</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Última actualización: {new Date().toLocaleDateString("es-AR")}
        </p>

        <section className="space-y-4 text-foreground/90">
          <p>
            En <strong>Los Burritos de Dulcinea</strong> respetamos tu derecho a solicitar la
            eliminación de tus datos personales. Esta página explica cómo hacerlo paso a paso.
          </p>

          <h2 className="text-xl font-semibold mt-8">¿Qué datos podemos eliminar?</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Tu nombre, teléfono y dirección guardados en pedidos anteriores.</li>
            <li>Historial de mensajes asociados a tu número en nuestro WhatsApp Business.</li>
            <li>Tu carrito abandonado (si existe).</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8">Cómo solicitar la eliminación</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Escribinos por WhatsApp al{" "}
              <a
                href={`https://wa.me/${waNumber}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                +54 9 11 2400 3293
              </a>{" "}
              indicando: <em>"Quiero eliminar mis datos personales"</em>.
            </li>
            <li>
              Incluí el <strong>nombre</strong> y el <strong>número de teléfono</strong> con
              los que hiciste pedidos, para que podamos identificar tus registros.
            </li>
            <li>
              Confirmaremos tu identidad con un mensaje breve y procederemos con la
              eliminación.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-8">Plazo de respuesta</h2>
          <p>
            Procesamos las solicitudes dentro de los <strong>7 días hábiles</strong>. Una vez
            completada la eliminación, te avisamos por el mismo canal.
          </p>

          <h2 className="text-xl font-semibold mt-8">Datos que no podemos eliminar</h2>
          <p>
            Por obligaciones contables o fiscales, podemos retener registros mínimos de
            transacciones (sin datos de contacto) durante el plazo legalmente requerido.
          </p>

          <h2 className="text-xl font-semibold mt-8">Limpieza automática</h2>
          <p>
            Los carritos abandonados se eliminan automáticamente <strong>30 días</strong>{" "}
            después de la última actividad, sin necesidad de solicitarlo.
          </p>

          <div className="mt-10 p-4 rounded-lg bg-muted">
            <p className="text-sm">
              <strong>Atajo:</strong>{" "}
              <a
                href={`https://wa.me/${waNumber}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Solicitar eliminación por WhatsApp
              </a>
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default DataDeletion;
