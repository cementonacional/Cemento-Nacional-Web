# 🧪 Guía de Pruebas End-to-End

Esta guía explica cómo ejecutar y entender las pruebas End-to-End para Cemento Nacional.

## 📋 Pruebas Disponibles

### 1. Pruebas Principales (`test:e2e`)
Verifica las funcionalidades básicas de la aplicación:

- ✅ **Servidor**: Verifica que el servidor esté corriendo
- ✅ **Formulario de contacto**: Envía mensaje y verifica recepción
- ✅ **Login de admin**: Autenticación del panel administrativo
- ✅ **Mensajes en admin**: Verifica que los mensajes aparezcan
- ✅ **Cotización de pedido**: Genera cotización con ubicación
- ✅ **Creación de pedido**: Crea pedido completo
- ✅ **Pedidos en admin**: Verifica que aparezcan en el admin
- ✅ **Generación de PDF**: Crea PDF del pedido
- ✅ **Configuración de precios**: Verifica configuración

### 2. Pruebas de Stripe (`test:stripe`)
Verifica la integración con Stripe:

- ✅ **Configuración**: Variables de entorno de Stripe
- ✅ **Sesión de checkout**: Crea sesión de pago
- ✅ **Órdenes en admin**: Verifica órdenes de Stripe
- ✅ **Webhook**: Verifica endpoint de webhook
- ✅ **Configuración de precios**: Verifica precios

### 3. Pruebas de Google Maps (`test:maps`)
Verifica la integración con Google Maps:

- ✅ **Configuración**: API Key de Google Maps
- ✅ **Geocoding**: Convierte direcciones a coordenadas
- ✅ **Distance Matrix**: Calcula distancias
- ✅ **Cotización con ubicación**: Genera cotización con distancia
- ✅ **Página de pedidos**: Verifica carga de mapas
- ✅ **Configuración de origen**: Verifica origen para flete

## 🚀 Cómo Ejecutar las Pruebas

### Prerequisitos

1. **Servidor corriendo**: `npm run dev`
2. **Variables de entorno**: Configurar `.env.local`
3. **Base de datos**: MongoDB conectado
4. **APIs externas**: Stripe y Google Maps configuradas

### Comandos de Prueba

```bash
# Ejecutar todas las pruebas
npm run test:all

# Ejecutar pruebas específicas
npm run test:e2e      # Pruebas principales
npm run test:stripe   # Pruebas de Stripe
npm run test:maps     # Pruebas de Google Maps
```

### Variables de Entorno Requeridas

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/cemento-nacional

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Google Maps
GOOGLE_MAPS_API_KEY=AIza...

# Aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# SEO (opcional)
GOOGLE_SITE_VERIFICATION=...
```

## 📊 Interpretación de Resultados

### ✅ Pruebas Exitosas
- **Verde**: La funcionalidad está trabajando correctamente
- **Porcentaje**: Indica qué tan bien está funcionando la aplicación

### ❌ Pruebas Fallidas
- **Rojo**: Hay un problema que necesita ser corregido
- **Mensaje de error**: Explica qué salió mal

### ⚠️ Advertencias
- **Amarillo**: Funcionalidad parcial o con limitaciones
- **Revisar**: Necesita atención pero no es crítico

## 🔧 Solución de Problemas

### Error: "No se puede conectar al servidor"
```bash
# Verificar que el servidor esté corriendo
npm run dev

# Verificar que esté en el puerto correcto
curl http://localhost:3000
```

### Error: "Variables de entorno no configuradas"
```bash
# Verificar archivo .env.local
cat .env.local

# Verificar que las variables estén cargadas
echo $MONGODB_URI
```

### Error: "Error en login de admin"
```bash
# Verificar credenciales en .env.local
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Verificar que la API de auth esté funcionando
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Error: "Error en Google Maps API"
```bash
# Verificar API Key
echo $GOOGLE_MAPS_API_KEY

# Verificar que la API esté habilitada
# - Maps JavaScript API
# - Geocoding API
# - Distance Matrix API
```

### Error: "Error en Stripe"
```bash
# Verificar API Keys
echo $STRIPE_SECRET_KEY
echo $STRIPE_WEBHOOK_SECRET

# Verificar que las APIs estén habilitadas
# - Stripe API
# - Webhooks
```

## 📈 Métricas de Calidad

### Objetivos de Rendimiento
- **Performance**: ≥ 80%
- **Accesibilidad**: ≥ 90%
- **SEO**: ≥ 90%
- **Best Practices**: ≥ 80%

### Pruebas de Integración
- **Formularios**: Validación en tiempo real
- **APIs**: Respuestas correctas y manejo de errores
- **Base de datos**: CRUD operations
- **APIs externas**: Stripe y Google Maps

## 🎯 Casos de Uso Probados

### 1. Flujo de Contacto
1. Usuario llena formulario de contacto
2. Mensaje se guarda en base de datos
3. Admin puede ver mensaje en panel
4. Validación funciona correctamente

### 2. Flujo de Pedido
1. Usuario selecciona ubicación en mapa
2. Sistema calcula flete automáticamente
3. Usuario completa formulario de pedido
4. Pedido se guarda en base de datos
5. PDF se genera correctamente
6. Admin puede ver pedido en panel

### 3. Flujo de Pago
1. Usuario selecciona cantidad de bolsas
2. Sistema crea sesión de Stripe
3. Usuario completa pago
4. Webhook procesa pago
5. Orden se guarda en base de datos
6. Admin puede ver orden en panel

## 🔄 Pruebas Continuas

### En Desarrollo
```bash
# Ejecutar pruebas después de cada cambio
npm run test:all
```

### En CI/CD
```bash
# Configurar en GitHub Actions o similar
npm run test:all
npm run lighthouse
```

### En Producción
```bash
# Verificar que todo funcione en producción
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com npm run test:all
```

## 📝 Reportes de Pruebas

### Logs Detallados
Cada prueba genera logs detallados que incluyen:
- ✅ Estado de cada funcionalidad
- ❌ Errores específicos encontrados
- ⚠️ Advertencias y recomendaciones
- 📊 Estadísticas de rendimiento

### Archivos de Salida
- **Console**: Logs en tiempo real
- **Exit codes**: 0 = éxito, 1 = fallo
- **JSON**: Para integración con CI/CD

## 🎉 Pruebas Exitosas

Cuando todas las pruebas pasan, verás:
```
🎉 ¡TODAS LAS PRUEBAS PASARON!
   La aplicación está lista para producción
```

Esto significa que:
- ✅ Todas las funcionalidades están trabajando
- ✅ Las APIs están respondiendo correctamente
- ✅ La base de datos está funcionando
- ✅ Las integraciones externas están activas
- ✅ La aplicación está lista para usuarios reales

---

**Nota**: Ejecuta las pruebas regularmente para asegurar que la aplicación mantenga su calidad y funcionalidad.
