# 🧪 Scripts de Pruebas End-to-End

Este directorio contiene scripts automatizados para probar todas las funcionalidades de Cemento Nacional.

## 📁 Archivos Disponibles

### `test-e2e.js`
Pruebas principales de funcionalidad:
- ✅ Formulario de contacto
- ✅ Login de admin
- ✅ Cotización de pedidos
- ✅ Creación de pedidos
- ✅ Generación de PDF
- ✅ Configuración de precios

### `test-stripe.js`
Pruebas de integración con Stripe:
- ✅ Configuración de Stripe
- ✅ Sesiones de checkout
- ✅ Webhooks
- ✅ Órdenes en admin

### `test-maps.js`
Pruebas de integración con Google Maps:
- ✅ Configuración de API
- ✅ Geocoding
- ✅ Distance Matrix
- ✅ Cotización con ubicación

### `test-lighthouse.js`
Pruebas de rendimiento y calidad:
- ✅ Performance (≥80%)
- ✅ Accesibilidad (≥90%)
- ✅ SEO (≥90%)
- ✅ Best Practices (≥80%)

### `run-all-tests.js`
Script maestro que ejecuta todas las pruebas:
- ✅ Verificaciones previas
- ✅ Ejecución de todas las suites
- ✅ Resumen consolidado
- ✅ Reportes detallados

## 🚀 Uso

### Ejecutar todas las pruebas
```bash
npm run test:all
```

### Ejecutar pruebas específicas
```bash
npm run test:e2e        # Pruebas principales
npm run test:stripe     # Pruebas de Stripe
npm run test:maps       # Pruebas de Google Maps
npm run test:lighthouse # Pruebas de Lighthouse
```

### Ejecutar directamente
```bash
node scripts/test-e2e.js
node scripts/test-stripe.js
node scripts/test-maps.js
node scripts/test-lighthouse.js
node scripts/run-all-tests.js
```

## 📋 Prerequisitos

1. **Servidor corriendo**: `npm run dev`
2. **Variables de entorno**: Configurar `.env.local`
3. **Base de datos**: MongoDB conectado
4. **APIs externas**: Stripe y Google Maps

## 🔧 Configuración

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
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...

# Aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## 📊 Interpretación de Resultados

### ✅ Pruebas Exitosas
- **Verde**: Funcionalidad trabajando correctamente
- **Porcentaje**: Indica nivel de funcionalidad

### ❌ Pruebas Fallidas
- **Rojo**: Problema que necesita corrección
- **Mensaje**: Explica qué salió mal

### ⚠️ Advertencias
- **Amarillo**: Funcionalidad parcial o limitada
- **Revisar**: Necesita atención pero no es crítico

## 🎯 Objetivos de Calidad

### Lighthouse
- **Performance**: ≥ 80%
- **Accesibilidad**: ≥ 90%
- **SEO**: ≥ 90%
- **Best Practices**: ≥ 80%

### Funcionalidad
- **Formularios**: Validación en tiempo real
- **APIs**: Respuestas correctas
- **Base de datos**: CRUD operations
- **Integraciones**: Stripe y Google Maps

## 🔄 Pruebas Continuas

### En Desarrollo
```bash
# Ejecutar después de cada cambio
npm run test:all
```

### En CI/CD
```bash
# Configurar en GitHub Actions
npm run test:all
npm run lighthouse
```

### En Producción
```bash
# Verificar en producción
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com npm run test:all
```

## 📝 Logs y Reportes

### Console Output
- ✅ Estado de cada funcionalidad
- ❌ Errores específicos
- ⚠️ Advertencias y recomendaciones
- 📊 Estadísticas de rendimiento

### Exit Codes
- **0**: Todas las pruebas pasaron
- **1**: Algunas pruebas fallaron

### Archivos JSON
- **Lighthouse**: Resultados detallados
- **CI/CD**: Para integración automatizada

## 🛠️ Solución de Problemas

### Error: "No se puede conectar al servidor"
```bash
# Verificar que el servidor esté corriendo
npm run dev

# Verificar puerto
curl http://localhost:3000
```

### Error: "Variables de entorno no configuradas"
```bash
# Verificar archivo .env.local
cat .env.local

# Verificar variables
echo $MONGODB_URI
```

### Error: "Error en APIs externas"
```bash
# Verificar API Keys
echo $STRIPE_SECRET_KEY
echo $GOOGLE_MAPS_API_KEY

# Verificar que las APIs estén habilitadas
```

## 📈 Métricas de Éxito

### Pruebas Exitosas
```
🎉 ¡TODAS LAS PRUEBAS PASARON!
   La aplicación está lista para producción
```

### Indicadores de Calidad
- ✅ **100% de pruebas pasando**
- ✅ **Lighthouse ≥ 90% en todas las categorías**
- ✅ **Todas las APIs respondiendo**
- ✅ **Base de datos funcionando**
- ✅ **Integraciones activas**

## 🔍 Casos de Uso Probados

### 1. Flujo de Contacto
1. Usuario llena formulario
2. Mensaje se guarda en DB
3. Admin puede ver mensaje
4. Validación funciona

### 2. Flujo de Pedido
1. Usuario selecciona ubicación
2. Sistema calcula flete
3. Usuario completa pedido
4. PDF se genera
5. Admin puede ver pedido

### 3. Flujo de Pago
1. Usuario selecciona cantidad
2. Sistema crea sesión Stripe
3. Usuario completa pago
4. Webhook procesa pago
5. Orden se guarda en DB

## 📚 Documentación Adicional

- **TESTING.md**: Guía completa de pruebas
- **README.md**: Documentación principal
- **TODO.md**: Lista de tareas completadas

---

**Nota**: Ejecuta las pruebas regularmente para mantener la calidad de la aplicación.
