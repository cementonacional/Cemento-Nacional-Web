#!/usr/bin/env node

/**
 * Script de pruebas End-to-End para Cemento Nacional
 * Verifica las funcionalidades principales de la aplicación
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

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

// Función para log con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para verificar si el servidor está corriendo
async function checkServer() {
  log('🔍 Verificando que el servidor esté corriendo...', 'blue');
  
  try {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      log('✅ Servidor está corriendo', 'green');
      return true;
    } else {
      log('❌ Servidor no responde correctamente', 'red');
      return false;
    }
  } catch (error) {
    log('❌ No se puede conectar al servidor', 'red');
    log(`   Asegúrate de ejecutar: npm run dev`, 'yellow');
    return false;
  }
}

// Prueba 1: Formulario de contacto
async function testContactForm() {
  log('\n📧 Probando formulario de contacto...', 'blue');
  
  const contactData = {
    nombre: 'Test Usuario',
    correo: 'test@example.com',
    telefono: '+52 81 1234-5678',
    compania: 'Test Company',
    mensaje: 'Este es un mensaje de prueba para verificar el formulario de contacto.'
  };
  
  const result = await makeRequest(`${BASE_URL}/api/contact`, {
    method: 'POST',
    body: JSON.stringify(contactData)
  });
  
  if (result.success) {
    log('✅ Formulario de contacto enviado correctamente', 'green');
    return true;
  } else {
    log('❌ Error al enviar formulario de contacto', 'red');
    log(`   Error: ${result.error || result.data?.message}`, 'red');
    return false;
  }
}

// Prueba 2: Login de admin
async function testAdminLogin() {
  log('\n🔐 Probando login de admin...', 'blue');
  
  const loginData = {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD
  };
  
  const result = await makeRequest(`${BASE_URL}/api/admin/auth`, {
    method: 'POST',
    body: JSON.stringify(loginData)
  });
  
  if (result.success) {
    log('✅ Login de admin exitoso', 'green');
    return result.data.token;
  } else {
    log('❌ Error en login de admin', 'red');
    log(`   Error: ${result.error || result.data?.message}`, 'red');
    return null;
  }
}

// Prueba 3: Verificar mensajes en admin
async function testAdminMessages(token) {
  log('\n📨 Verificando mensajes en admin...', 'blue');
  
  const result = await makeRequest(`${BASE_URL}/api/admin/messages`, {
    headers: {
      'Cookie': `admin-session=${token}`
    }
  });
  
  if (result.success && result.data.data.messages.length > 0) {
    log('✅ Mensajes encontrados en admin', 'green');
    log(`   Total de mensajes: ${result.data.data.messages.length}`, 'green');
    return true;
  } else {
    log('❌ No se encontraron mensajes en admin', 'red');
    return false;
  }
}

// Prueba 4: Cotización de pedido
async function testPedidoQuote() {
  log('\n💰 Probando cotización de pedido...', 'blue');
  
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
    log('✅ Cotización generada correctamente', 'green');
    log(`   Subtotal: $${result.data.data.subtotal}`, 'green');
    log(`   Flete: $${result.data.data.flete}`, 'green');
    log(`   Total: $${result.data.data.totalFinal}`, 'green');
    return true;
  } else {
    log('❌ Error al generar cotización', 'red');
    log(`   Error: ${result.error || result.data?.message}`, 'red');
    return false;
  }
}

// Prueba 5: Crear pedido completo
async function testPedidoCreation() {
  log('\n📦 Probando creación de pedido...', 'blue');
  
  const pedidoData = {
    nombre: 'Test Cliente',
    correo: 'cliente@example.com',
    telefono: '+52 81 9876-5432',
    compania: 'Test Company',
    bolsas: 5,
    address: 'Test Address 123, Monterrey, NL',
    location: {
      lat: 25.6866,
      lng: -100.3161
    },
    notas: 'Pedido de prueba para verificar funcionalidad'
  };
  
  const result = await makeRequest(`${BASE_URL}/api/pedidos`, {
    method: 'POST',
    body: JSON.stringify(pedidoData)
  });
  
  if (result.success) {
    log('✅ Pedido creado correctamente', 'green');
    log(`   ID del pedido: ${result.data.data.id}`, 'green');
    return result.data.data.id;
  } else {
    log('❌ Error al crear pedido', 'red');
    log(`   Error: ${result.error || result.data?.message}`, 'red');
    return null;
  }
}

// Prueba 6: Verificar pedidos en admin
async function testAdminPedidos(token) {
  log('\n📋 Verificando pedidos en admin...', 'blue');
  
  const result = await makeRequest(`${BASE_URL}/api/admin/pedidos`, {
    headers: {
      'Cookie': `admin-session=${token}`
    }
  });
  
  if (result.success && result.data.data.pedidos.length > 0) {
    log('✅ Pedidos encontrados en admin', 'green');
    log(`   Total de pedidos: ${result.data.data.pedidos.length}`, 'green');
    return true;
  } else {
    log('❌ No se encontraron pedidos en admin', 'red');
    return false;
  }
}

// Prueba 7: Generar PDF
async function testPDFGeneration(pedidoId) {
  if (!pedidoId) {
    log('⏭️ Saltando prueba de PDF (no hay pedido ID)', 'yellow');
    return true;
  }
  
  log('\n📄 Probando generación de PDF...', 'blue');
  
  try {
    const response = await fetch(`${BASE_URL}/api/pedidos/${pedidoId}/pdf`);
    
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength > 0) {
        log('✅ PDF generado correctamente', 'green');
        log(`   Tamaño del PDF: ${buffer.byteLength} bytes`, 'green');
        return true;
      } else {
        log('❌ PDF generado pero está vacío', 'red');
        return false;
      }
    } else {
      log('❌ Error al generar PDF', 'red');
      log(`   Status: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Error al generar PDF', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Prueba 8: Verificar configuración de precios
async function testPricingSettings(token) {
  log('\n⚙️ Verificando configuración de precios...', 'blue');
  
  const result = await makeRequest(`${BASE_URL}/api/settings/pricing`, {
    headers: {
      'Cookie': `admin-session=${token}`
    }
  });
  
  if (result.success) {
    log('✅ Configuración de precios obtenida', 'green');
    log(`   Tarifa por km: $${result.data.data.pricing.tarifaPorKm}`, 'green');
    log(`   Flete mínimo: $${result.data.data.pricing.fleteMinimo}`, 'green');
    return true;
  } else {
    log('❌ Error al obtener configuración de precios', 'red');
    return false;
  }
}

// Función principal
async function runTests() {
  log('🧪 Iniciando pruebas End-to-End para Cemento Nacional', 'bold');
  log('=' .repeat(60), 'blue');
  
  const results = {
    server: false,
    contact: false,
    adminLogin: false,
    adminMessages: false,
    quote: false,
    pedido: false,
    adminPedidos: false,
    pdf: false,
    pricing: false
  };
  
  // Verificar servidor
  results.server = await checkServer();
  if (!results.server) {
    log('\n❌ No se puede continuar sin servidor', 'red');
    process.exit(1);
  }
  
  // Ejecutar pruebas
  results.contact = await testContactForm();
  results.adminLogin = await testAdminLogin();
  
  if (results.adminLogin) {
    const token = results.adminLogin;
    results.adminMessages = await testAdminMessages(token);
    results.adminPedidos = await testAdminPedidos(token);
    results.pricing = await testPricingSettings(token);
  }
  
  results.quote = await testPedidoQuote();
  const pedidoId = await testPedidoCreation();
  results.pedido = !!pedidoId;
  
  if (pedidoId) {
    results.pdf = await testPDFGeneration(pedidoId);
  }
  
  // Resumen de resultados
  log('\n📊 Resumen de Pruebas:', 'bold');
  log('=' .repeat(60), 'blue');
  
  const tests = [
    { name: 'Servidor corriendo', result: results.server },
    { name: 'Formulario de contacto', result: results.contact },
    { name: 'Login de admin', result: results.adminLogin },
    { name: 'Mensajes en admin', result: results.adminMessages },
    { name: 'Cotización de pedido', result: results.quote },
    { name: 'Creación de pedido', result: results.pedido },
    { name: 'Pedidos en admin', result: results.adminPedidos },
    { name: 'Generación de PDF', result: results.pdf },
    { name: 'Configuración de precios', result: results.pricing }
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
    log('\n🎉 ¡Todas las pruebas pasaron!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️ Algunas pruebas fallaron', 'yellow');
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runTests().catch(error => {
    log(`\n💥 Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runTests };
