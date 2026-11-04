# El Armario

Catálogo en React + Vite. Usa el catálogo real de Google Sheets y las fotos de Drive. No se incorporaron productos ficticios.

## Desarrollo

Requiere Node.js 22.12+ o 24 LTS.

~~~sh
npm ci
npm run dev
~~~

Abre la URL que imprime Vite (normalmente http://127.0.0.1:5173).

~~~sh
npm test
npm run build
npm run preview
~~~

## Configuración

Copia .env.example a .env.local si necesitas cambiar valores. Reinicia Vite después.

- VITE_API_URL vacío: lee el CSV público actual configurado en src/config.js. Funciona sin desplegar el nuevo backend.
- VITE_API_URL=http://localhost:8787/api/products: usa el backend local del repositorio El-Armario-Backend.
- VITE_WHATSAPP_NUMBER: número internacional sin +.
- VITE_QR_EXPIRATION: fecha de vencimiento del QR en formato YYYY-MM-DD. Se evalúa con zona horaria de Bolivia; si venció, se coordina por WhatsApp.

Las variables VITE_ son públicas: nunca guardes contraseñas o credenciales aquí. El logo, QR y número se conservaron de la web anterior; revisarlos antes de una futura publicación. No se verificó el beneficiario del QR ni se hizo ningún pago.

## Catálogo

Columnas: codigo, nombre, tipo, talla, precio, foto1, foto2, foto3, vendido, genero, descripcion, foto_ia. Código único y precio no negativo. Las tallas entre paréntesis se agrupan en el filtro. Se reconoce vendido=si/sí/true/1. foto_ia se presenta como imagen referencial, seguida por fotos reales en el detalle.

Incluye búsqueda por nombre/código, filtros combinables, orden por precio/nombre, carga incremental, detalle enlazable mediante #prenda=CODIGO, galería, ampliación de imagen, QR y enlace de WhatsApp. El envío de WhatsApp lo realiza el visitante.

## Cloudflare Pages / GitHub

Proyecto listo para versionar: .gitignore y package-lock.json incluidos. No se crearon commits ni se hizo push.

- Comando de compilación: npm run build
- Directorio de salida: dist
- Configurar Node.js 22 o 24.
- Para usar la API publicada, establecer VITE_API_URL en Pages antes de compilar.

No se modificó la web publicada.

## Decisión de datos

Para la etapa actual, mantener Sheets para administrar el catálogo y Drive para fotos evita una migración innecesaria. El backend de lectura con caché ofrece una transición gradual; el frontend también permite mantener la conexión directa actual. Sheets y Drive siguen siendo dependencias externas y sus cambios pueden tardar en reflejarse.

Si se añaden pedidos, reservas o varios administradores, migrar a una BD relacional (productos, fotos, variantes, pedidos, reservas) y almacenamiento de objetos para imágenes. La disponibilidad actual es informativa: el QR no reserva stock, no confirma pagos ni registra pedidos. Las imágenes de Drive dependen de permisos públicos. Confirmar disponibilidad por WhatsApp antes de pagar.
