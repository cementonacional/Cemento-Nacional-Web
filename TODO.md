# TODO - Cemento Nacional Website

## 🎨 1. Branding / UI Theme ✅
- [x] Crear proyecto Next.js 14 (App Router) + TypeScript + Tailwind
- [x] Configurar `tailwind.config.ts` con colores de marca:
  - [x] beige `#ddc6af`
  - [x] negro `#1c1c1c` 
  - [x] dorado `#b9802c`
  - [x] rojo `#ad3930`
- [x] Definir util `maxWidth.bag=88%`
- [x] Configurar fuentes: Montserrat (H1/H2) + Inter (body) con next/font/google
- [x] Implementar layout "costal" global:
  - [x] Header: franja roja centrada (ancho 88%), bordes suaves
  - [x] Body: fondo beige
  - [x] Footer: base negra centrada (88%) con sello rojo circular

## 🏗️ 2. Estructura del Proyecto ✅
- [x] Crear estructura de carpetas (app/, components/, lib/, etc.)
- [x] Instalar dependencias:
  - [x] `npm i mongoose zod stripe @react-google-maps/api pdf-lib dayjs`
- [x] Configurar `.env.local` con variables de entorno
- [x] Crear `README.md` con setup y deploy

## 🧩 3. Componentes Base ✅
- [x] Crear `BagFrame.tsx` (franja roja 88% arriba + base negra con sello)
- [x] Crear `NavBar.tsx` (desktop+móvil con links: Inicio, Sobre, Calidad, Galería, Contacto, Comprar, Pedidos)
- [x] Crear `BagSeal.tsx` (sello footer)
- [x] Crear `Hero.tsx` (opcional para Home)

## 📄 4. Páginas (App Router con Metadata API) ✅
- [x] `/` (Home): hero con logo textual CEMENTO NACIONAL, slogan LA FUERZA DEL PRESENTE, CTAs
- [x] `/sobre`: texto breve + 1–2 imágenes
- [x] `/calidad`: bloques con fórmula del costal, tarjetas con borde dorado
- [x] `/galeria`: grid 2–4 columnas con lightbox simple
- [x] `/contacto`: form (nombre, correo, teléfono, compañía, mensaje)
- [x] `/comprar`: producto único CPC30 25kg + botón Comprar ahora → Stripe Checkout
- [x] `/pedidos`: formulario para pedir costales + mapa + cálculo de flete + PDF
- [x] `/admin`: Server Component con Basic Auth, tabs para Mensajes, Órdenes, Pedidos y Ajustes

## 🗄️ 5. Base de Datos (MongoDB + Mongoose) ✅
- [x] Crear `lib/mongodb.ts` con conexión singleton
- [x] Crear modelos:
  - [x] `Message`: { nombre, correo, telefono?, compania?, mensaje, createdAt }
  - [x] `Order`: { stripeSessionId(unique), status, amountTotal, currency, customerEmail?, createdAt }
  - [x] `Pedido`: { nombre, correo, telefono?, compania?, bolsas, precioUnitario, subtotal, flete, totalFinal, address?, location {lat,lng}?, distanceKm?, notas?, createdAt }
  - [x] `Settings` (singleton): { key: 'pricing', tarifaPorKm (MXN/km), fleteMinimo (MXN), origen {lat,lng} }
- [x] Crear helpers `getPricing()` y `updatePricing(input)`

## 🔌 6. APIs (Route Handlers) ✅
- [x] `POST /api/contact`: valida con zod, crea Message
- [x] `POST /api/checkout/session`: crea sesión Stripe
- [x] `POST /api/stripe/webhook`: valida firma, crea/actualiza Order
- [x] `POST /api/pedidos/quote`: calcula distancia y flete usando Google Maps Distance Matrix
- [x] `POST /api/pedidos`: valida y guarda pedido completo
- [x] `GET /api/pedidos/:id/pdf`: genera PDF del pedido con pdf-lib
- [x] `PATCH /api/settings/pricing`: actualiza ajustes de flete

## 🗺️ 7. Google Maps Integration ✅
- [x] Configurar `@react-google-maps/api`
- [x] Implementar mapa en `/pedidos` con marker al click
- [x] Integrar Distance Matrix API para cálculo de flete
- [x] Permitir editar origen en Admin

## 💳 8. Stripe Integration ✅
- [x] Configurar SDK stripe
- [x] Implementar Checkout en `/comprar`
- [x] Configurar webhook para registrar órdenes
- [x] Probar flujo completo de pago

## 📊 9. Página /pedidos (Completa) ✅
- [x] Form con campos: nombre, correo, teléfono, compañía, dirección, bolsas, precioUnitario, notas
- [x] Integrar mapa de Google para marcar ubicación
- [x] Botón "Calcular total": llama a `/api/pedidos/quote`
- [x] Mostrar subtotal, distancia, flete y totalFinal
- [x] Botón "Enviar pedido": POST `/api/pedidos`
- [x] Opción "Descargar PDF" tras guardar
- [x] Mostrar Lat/Lng si hay marker

## 🔐 10. Admin Panel ✅
- [x] Implementar Basic Auth (.env)
- [x] Crear tabs/secciones:
  - [x] Mensajes (tabla)
  - [x] Órdenes (Stripe)
  - [x] Pedidos (mostrar bolsas, subtotal, flete, totalFinal, distanceKm, lat,lng)
  - [x] Ajustes de flete (form para editar tarifaPorKm, fleteMinimo, origen.lat/lng)

## 📄 11. PDF Generation ✅
- [x] Implementar generación de PDF con pdf-lib
- [x] Incluir todos los datos del pedido
- [x] **BONUS**: Agregar QR con link del pedido en admin o pin de Google Maps
- [x] Probar descarga y visualización

## ✅ 12. Validación / Accesibilidad / SEO
- [x] Implementar zod en todas las APIs
- [x] Validación básica en cliente
- [x] Focus visible, labels, contraste AA
- [x] Metadata API por página
- [x] Sitemap y robots.txt
- [x] Componentes accesibles
- [x] Configuración Lighthouse CI

## ✅ 13. Pruebas Manuales End-to-End
- [x] Contacto → aparece en /admin
- [x] Checkout → webhook crea Order
- [x] Pedido con mapa → quote correcto, PDF descargable, visible en /admin
- [x] Editar tarifaPorKm/fleteMinimo/origen en Admin → quote refleja cambios
- [x] Lighthouse ≥ 90
- [x] Scripts de prueba automatizados
- [x] Documentación de pruebas

## 🔄 14. Deploy
- [x] Configurar Vercel CLI
- [x] Crear archivo vercel.json
- [x] Crear guía de MongoDB Atlas
- [x] Crear guía de deploy completa
- [ ] Configurar MongoDB Atlas
- [ ] Configurar variables de entorno en producción
- [ ] Probar funcionalidad completa en producción

---

## 📝 Notas
- Usar placeholders para imágenes/logo y comentar dónde reemplazarlos
- Mantener buen tipado, accesibilidad y performance
- Documentar setup y deploy en README
