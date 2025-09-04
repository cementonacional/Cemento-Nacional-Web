#!/usr/bin/env node

/**
 * Script de pruebas para funcionalidad de Google Maps
 * Verifica geocoding, distance matrix y mapas
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para log con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para hacer requests HTTP
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Prueba 1: Verificar configuración de Google Maps
async function testMapsConfig() {
  log('\n🗺️ Verificando configuración de Google Maps...', 'blue');
  
  if (!GOOGLE_MAPS_API_KEY) {
    log('❌ GOOGLE_MAPS_API_KEY no está configurado', 'red');
    return false;
  }
  
  log('✅ API Key de Google Maps configurada', 'green');
  return true;
}

// Prueba 2: Verificar geocoding
async function testGeocoding() {
  log('\n📍 Probando geocoding...', 'blue');
  
  const address = 'Monterrey, Nuevo León, México';
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      log('✅ Geocoding funcionando correctamente', 'green');
      log(`   Dirección: ${address}`, 'green');
      log(`   Coordenadas: ${location.lat}, ${location.lng}`, 'green');
      return true;
    } else {
      log('❌ Error en geocoding', 'red');
      log(`   Status: ${data.status}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Error al conectar con Google Maps API', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Prueba 3: Verificar Distance Matrix API
async function testDistanceMatrix() {
  log('\n📏 Probando Distance Matrix API...', 'blue');
  
  const origin = '25.6866,-100.3161'; // Monterrey
  const destination = '19.4326,-99.1332'; // Ciudad de México
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      const distance = data.rows[0].elements[0].distance.value / 1000; // Convertir a km
      const duration = data.rows[0].elements[0].duration.text;
      
      log('✅ Distance Matrix API funcionando correctamente', 'green');
      log(`   Distancia: ${distance.toFixed(1)} km`, 'green');
      log(`   Duración: ${duration}`, 'green');
      return true;
    } else {
      log('❌ Error en Distance Matrix API', 'red');
      log(`   Status: ${data.status}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Error al conectar con Distance Matrix API', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Prueba 4: Verificar cotización con ubicación
async function testQuoteWithLocation() {
  log('\n💰 Probando cotización con ubicación...', 'blue');
  
  const quoteData = {
    bolsas: 10,
    location: {
      lat: 25.6866,
      lng: -100.3161
    }
  };
  
  const result = await makeRequest(`${BASE_URL}/api/pedidos/quote`, {
    method: 'POST',
    body: JSON.stringify(quoteData)
  });
  
  if (result.success) {
    log('✅ Cotización con ubicación generada correctamente', 'green');
    log(`   Subtotal: $${result.data.data.subtotal}`, 'green');
    log(`   Flete: $${result.data.data.flete}`, 'green');
    log(`   Total: $${result.data.data.totalFinal}`, 'green');
    log(`   Distancia: ${result.data.data.distanceKm} km`, 'green');
    return true;
  } else {
    log('❌ Error al generar cotización con ubicación', 'red');
    log(`   Error: ${result.error || result.data?.message}`, 'red');
    return false;
  }
}

// Prueba 5: Verificar página de pedidos
async function testPedidosPage() {
  log('\n📦 Verificando página de pedidos...', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/pedidos`);
    
    if (response.ok) {
      const html = await response.text();
      
      // Verificar que la página contiene elementos clave
      const hasMap = html.includes('GoogleMapComponent') || html.includes('google-map');
      const hasForm = html.includes('form') || html.includes('input');
      const hasQuote = html.includes('cotización') || html.includes('quote');
      
      if (hasMap && hasForm && hasQuote) {
        log('✅ Página de pedidos cargada correctamente', 'green');
        log('   Contiene: Mapa, Formulario, Cotización', 'green');
        return true;
      } else {
        log('❌ Página de pedidos incompleta', 'red');
        log(`   Mapa: ${hasMap ? '✅' : '❌'}`, hasMap ? 'green' : 'red');
        log(`   Formulario: ${hasForm ? '✅' : '❌'}`, hasForm ? 'green' : 'red');
        log(`   Cotización: ${hasQuote ? '✅' : '❌'}`, hasQuote ? 'green' : 'red');
        return false;
      }
    } else {
      log('❌ Error al cargar página de pedidos', 'red');
      log(`   Status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Error al verificar página de pedidos', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Prueba 6: Verificar configuración de origen
async function testOriginConfig() {
  log('\n🏭 Verificando configuración de origen...', 'blue');
  
  const result = await makeRequest(`${BASE_URL}/api/settings/pricing`);
  
  if (result.success) {
    const origen = result.data.data.pricing.origen;
    if (origen && origen.lat && origen.lng) {
      log('✅ Configuración de origen encontrada', 'green');
      log(`   Origen: ${origen.lat}, ${origen.lng}`, 'green');
      return true;
    } else {
      log('❌ Configuración de origen incompleta', 'red');
      return false;
    }
  } else {
    log('❌ Error al obtener configuración de origen', 'red');
    return false;
  }
}

// Función principal
async function runMapsTests() {
  log('🗺️ Iniciando pruebas de Google Maps para Cemento Nacional', 'bold');
  log('=' .repeat(60), 'blue');
  
  const results = {
    config: false,
    geocoding: false,
    distanceMatrix: false,
    quote: false,
    pedidosPage: false,
    origin: false
  };
  
  // Ejecutar pruebas
  results.config = await testMapsConfig();
  
  if (results.config) {
    results.geocoding = await testGeocoding();
    results.distanceMatrix = await testDistanceMatrix();
    results.quote = await testQuoteWithLocation();
    results.pedidosPage = await testPedidosPage();
    results.origin = await testOriginConfig();
  }
  
  // Resumen de resultados
  log('\n📊 Resumen de Pruebas de Google Maps:', 'bold');
  log('=' .repeat(60), 'blue');
  
  const tests = [
    { name: 'Configuración de Google Maps', result: results.config },
    { name: 'Geocoding API', result: results.geocoding },
    { name: 'Distance Matrix API', result: results.distanceMatrix },
    { name: 'Cotización con ubicación', result: results.quote },
    { name: 'Página de pedidos', result: results.pedidosPage },
    { name: 'Configuración de origen', result: results.origin }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  tests.forEach(test => {
    const status = test.result ? '✅' : '❌';
    const color = test.result ? 'green' : 'red';
    log(`${status} ${test.name}`, color);
    if (test.result) passed++;
  });
  
  log('\n📈 Resultados:', 'bold');
  log(`   Pasaron: ${passed}/${total} pruebas`, passed === total ? 'green' : 'yellow');
  log(`   Porcentaje: ${Math.round((passed / total) * 100)}%`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 ¡Todas las pruebas de Google Maps pasaron!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️ Algunas pruebas de Google Maps fallaron', 'yellow');
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runMapsTests().catch(error => {
    log(`\n💥 Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runMapsTests };
