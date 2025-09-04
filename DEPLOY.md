# 🚀 Guía de Deploy - Cemento Nacional

## 📋 Checklist de Deploy

### ✅ Prerequisitos
- [ ] Cuenta de Vercel
- [ ] Cuenta de MongoDB Atlas
- [ ] Cuenta de Stripe
- [ ] Cuenta de Google Cloud Platform
- [ ] Repositorio en GitHub

### 🗄️ 1. Configurar MongoDB Atlas

#### Crear cluster en MongoDB Atlas
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster M0 (gratuito)
4. Configura acceso de red: `0.0.0.0/0`
5. Crea usuario de base de datos
6. Obtén connection string

#### Variables de entorno necesarias:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cemento-nacional
```

### 💳 2. Configurar Stripe

#### Crear cuenta en Stripe
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Crea una cuenta
3. Obtén API keys de prueba

#### Variables de entorno necesarias:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

### 🗺️ 3. Configurar Google Maps

#### Crear proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto
3. Habilita APIs:
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
4. Crea API Key
5. Configura restricciones de dominio

#### Variables de entorno necesarias:
```env
GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

### 🚀 4. Deploy en Vercel

#### Opción A: Deploy desde GitHub (Recomendado)
1. Sube tu código a GitHub
2. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
3. Importa proyecto desde GitHub
4. Configura variables de entorno
5. Deploy automático

#### Opción B: Deploy desde CLI
```bash
# Login en Vercel
vercel login

# Deploy
vercel

# Configurar variables de entorno
vercel env add MONGODB_URI
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_ID
vercel env add GOOGLE_MAPS_API_KEY
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD

# Deploy a producción
vercel --prod
```

### ⚙️ 5. Configurar Variables de Entorno en Vercel

#### Variables requeridas:
- `MONGODB_URI`: Connection string de MongoDB Atlas
- `STRIPE_SECRET_KEY`: Secret key de Stripe
- `STRIPE_WEBHOOK_SECRET`: Webhook secret de Stripe
- `STRIPE_PRICE_ID`: Price ID del producto
- `GOOGLE_MAPS_API_KEY`: API key de Google Maps
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: API key pública de Google Maps
- `ADMIN_USERNAME`: Usuario del admin
- `ADMIN_PASSWORD`: Contraseña del admin
- `GOOGLE_SITE_VERIFICATION`: Código de verificación de Google (opcional)

### 🔗 6. Configurar Webhooks de Stripe

#### Crear webhook endpoint
1. Ve a Stripe Dashboard > Webhooks
2. Agrega endpoint: `https://tu-dominio.vercel.app/api/stripe/webhook`
3. Selecciona eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copia el signing secret

### 🧪 7. Probar en Producción

#### Verificar funcionalidades:
- [ ] Página principal carga correctamente
- [ ] Formulario de contacto funciona
- [ ] Mapa de pedidos carga
- [ ] Checkout de Stripe funciona
- [ ] Admin panel accesible
- [ ] PDFs se generan correctamente

#### Comandos de prueba:
```bash
# Ejecutar pruebas en producción
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app npm run test:all

# Ejecutar Lighthouse
npm run test:lighthouse
```

### 📊 8. Monitoreo y Analytics

#### Configurar analytics:
- Google Analytics
- Vercel Analytics
- Stripe Dashboard
- MongoDB Atlas Monitoring

#### Métricas a monitorear:
- Performance (Lighthouse)
- Errores de API
- Transacciones de Stripe
- Uso de base de datos

### 🔧 9. Troubleshooting

#### Problemas comunes:

**Error: "MongoServerError: bad auth"**
- Verifica credenciales de MongoDB
- Verifica que el usuario tenga permisos

**Error: "Stripe API error"**
- Verifica API keys
- Verifica que el webhook esté configurado

**Error: "Google Maps API error"**
- Verifica API key
- Verifica restricciones de dominio

**Error: "Build failed"**
- Verifica variables de entorno
- Verifica que todas las dependencias estén instaladas

### 📈 10. Optimizaciones Post-Deploy

#### Performance:
- Configurar CDN
- Optimizar imágenes
- Implementar caching
- Minificar CSS/JS

#### SEO:
- Configurar sitemap
- Verificar meta tags
- Configurar Google Search Console

#### Seguridad:
- Configurar HTTPS
- Implementar rate limiting
- Configurar CORS
- Validar inputs

## 🎯 Resultado Final

Una vez completado el deploy, tendrás:
- ✅ Aplicación funcionando en producción
- ✅ Base de datos configurada
- ✅ Pagos funcionando
- ✅ Mapas funcionando
- ✅ Admin panel accesible
- ✅ PDFs generándose
- ✅ Pruebas pasando

## 📞 Soporte

Si tienes problemas con el deploy:
1. Revisa los logs de Vercel
2. Verifica las variables de entorno
3. Prueba las APIs individualmente
4. Consulta la documentación de cada servicio
