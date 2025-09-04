# Cemento Nacional - La Fuerza del Presente

Sitio web oficial de Cemento Nacional, una empresa mexicana dedicada a la producción y distribución de cemento de alta calidad.

## 🚀 Características

- **Diseño "Costal"**: Layout inspirado en los costales de cemento con franja roja y sello circular
- **E-commerce**: Integración con Stripe para compras directas
- **Sistema de Pedidos**: Formulario con cálculo de flete y generación de PDF
- **Google Maps**: Integración para cálculo de distancias y ubicaciones
- **Panel de Admin**: Gestión de mensajes, órdenes y configuraciones
- **MongoDB**: Base de datos para almacenar datos de clientes y pedidos

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB con Mongoose
- **Pagos**: Stripe Checkout
- **Mapas**: Google Maps API
- **PDF**: pdf-lib para generación de documentos
- **Validación**: Zod para validación de datos

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de MongoDB Atlas
- Cuenta de Stripe (para pagos)
- API Key de Google Maps

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd cemento-nacional
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
   MONGODB_DB=cemento-nacional

   # Admin Authentication
   ADMIN_USER=admin
   ADMIN_PASS=changeme

   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID_CPC30_25KG=price_...
   COMMERCE_BASE_URL=http://localhost:3000

   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🔑 Configuración de Servicios

### MongoDB Atlas
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster
3. Obtener la cadena de conexión
4. Configurar en `MONGODB_URI`

### Stripe
1. Crear cuenta en [Stripe](https://stripe.com)
2. Obtener las claves de API (test y live)
3. Crear un producto y precio para CPC30 25kg
4. Configurar webhook para `/api/stripe/webhook`

### Google Maps
1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com)
2. Habilitar Maps JavaScript API y Distance Matrix API
3. Crear API Key
4. Configurar restricciones de seguridad

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   ├── sobre/             # Página Sobre
│   ├── calidad/           # Página Calidad
│   ├── galeria/           # Página Galería
│   ├── contacto/          # Página Contacto
│   ├── comprar/           # Página Comprar
│   ├── pedidos/           # Página Pedidos
│   └── admin/             # Panel de Administración
├── components/            # Componentes React
│   ├── BagFrame.tsx       # Layout principal
│   ├── NavBar.tsx         # Navegación
│   ├── BagSeal.tsx        # Sello del footer
│   └── Hero.tsx           # Componente hero
└── lib/                   # Utilidades y configuración
    └── mongodb.ts         # Conexión a MongoDB
```

## 🎨 Paleta de Colores

- **Beige**: `#ddc6af` - Fondo principal
- **Negro**: `#1c1c1c` - Texto y footer
- **Dorado**: `#b9802c` - Acentos y botones
- **Rojo**: `#ad3930` - Header y elementos destacados

## 📄 Páginas

### Página Principal (/)
- Hero con logo "CEMENTO NACIONAL"
- Slogan "LA FUERZA DEL PRESENTE"
- CTAs a Contacto y Calidad

### Sobre (/sobre)
- Información de la empresa
- Historia y valores

### Calidad (/calidad)
- Fórmula del cemento
- Especificaciones técnicas
- Certificaciones

### Galería (/galeria)
- Grid de imágenes
- Lightbox para visualización

### Contacto (/contacto)
- Formulario de contacto
- Almacenamiento en MongoDB

### Comprar (/comprar)
- Producto CPC30 25kg
- Integración con Stripe Checkout

### Pedidos (/pedidos)
- Formulario de pedido
- Cálculo de flete con Google Maps
- Generación de PDF

### Admin (/admin)
- Autenticación básica
- Gestión de mensajes, órdenes y pedidos
- Configuración de tarifas de flete

## 🚀 Deploy

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel
3. Deploy automático

### Variables de entorno en producción
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB=cemento-nacional
ADMIN_USER=admin
ADMIN_PASS=<secure-password>
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_CPC30_25KG=price_...
COMMERCE_BASE_URL=https://tu-dominio.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting con ESLint

## 📝 Notas de Desarrollo

- Usar placeholders para imágenes y reemplazar con contenido real
- Mantener buen tipado con TypeScript
- Seguir principios de accesibilidad
- Optimizar para performance (Lighthouse ≥ 90)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Contacto

Cemento Nacional - La Fuerza del Presente
- Email: contacto@cementonacional.com
- Teléfono: +52 (81) 1234-5678
