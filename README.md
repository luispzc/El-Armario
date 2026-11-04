# El Armario

Catálogo React + Vite y panel privado /admin. Mantiene el diseño adaptable, las fotos con modelo y originales, filtros, búsqueda, galería con zoom y arrastre, QR y WhatsApp.

## Desarrollo

Requiere Node.js 22.12+ o 24 LTS. Inicia primero el backend del repositorio El-Armario-Backend en el puerto 8787.

~~~sh
npm ci
npm run dev
~~~

Vite sirve el frontend en http://127.0.0.1:5173 y conecta /api con el backend local. Abre /admin para administrar. La creación de cuentas y la configuración de D1/R2 se explican en [ADMIN_SETUP.md](./ADMIN_SETUP.md).

~~~sh
npm test
npm run build
~~~

## Producción en Cloudflare Workers

- Compilación: npm run build
- Despliegue: npx wrangler deploy
- Variable de compilación VITE_API_URL: /api/products
- El wrangler.toml nuevo declara src/worker.js, los archivos de dist y el origen del backend API_ORIGIN.

Publica primero el backend, con la base y el bucket ya configurados. El frontend ahora incluye un proxy pequeño para /api: el panel y su cookie HttpOnly permanecen en el mismo dominio. /admin se sirve con la entrada de la SPA. Los datos privados no se guardan en el navegador.

## Configuración

.env.example contiene VITE_API_URL, VITE_WHATSAPP_NUMBER y VITE_QR_EXPIRATION. Las variables VITE_ son públicas: nunca incluyas contraseñas o tokens en ellas. El valor recomendado de VITE_API_URL es /api/products, también en Cloudflare. El logo, QR y número conservan la configuración original. El QR no confirma pagos ni reserva stock.

## Fotos

El navegador selecciona el tamaño adecuado mediante srcset y sizes. Drive ofrece variantes de 240 a 960 px y hasta 1600 px al ampliar. Las nuevas fotos del panel se convierten a WebP en cuatro tamaños antes de subir a R2. Las primeras tarjetas tienen prioridad; las siguientes usan carga diferida. La galería prepara únicamente la siguiente foto cuando queda un momento libre y respeta el ahorro de datos.

Al ampliar, puedes arrastrar con mouse o dedo sin barras de scroll internas. Clic o Enter/Espacio alternan el zoom, las flechas desplazan y Home centra la foto.

## Administración

El panel permite añadir y editar los campos de la hoja, subir fotos, marcar vendido, ocultar o volver a mostrar prendas e importar el catálogo existente a D1. No hay registro público: la cuenta inicial se crea desde la terminal y no tiene contraseña predeterminada. Los cambios de inventario no requieren commits.

Antes de importar, el backend combina Sheets y D1; las ediciones guardadas en D1 tienen prioridad por código. Después de importar, D1 es la fuente del catálogo. Las fotos antiguas permanecen en Drive y las nuevas en R2.

No se hicieron commits ni despliegues desde esta entrega. Los archivos node_modules, dist, .wrangler y .env locales están excluidos de Git.

## Tarjeta y compra

El detalle aparece con una entrada suave y se cierra con una salida breve. Al pulsar Me la llevo, el pago reemplaza el detalle en la misma tarjeta: resumen compacto de nombre, precio, talla y estado, QR e instrucciones. En móvil, la tarjeta gira para mostrar esa cara de pago; Volver al detalle invierte el giro y devuelve el foco al botón de compra. Las caras inactivas son inert y se excluyen de la navegación accesible. Se respeta la preferencia de reducir movimiento.

El proxy usa global_fetch_strictly_public para llegar al backend por su dominio workers.dev. Esta opción debe permanecer en wrangler.toml al desplegar.
