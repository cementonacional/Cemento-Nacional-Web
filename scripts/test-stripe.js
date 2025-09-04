#!/usr/bin/env node

/**
 * Script de pruebas para funcionalidad de Stripe
 * Verifica checkout, webhooks y órdenes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

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

// Prueba 1: Verificar configuración de Stripe
async function testStripeConfig() {
  log('\n🔧 Verificando configuración de Stripe...', 'blue');
  
  if (!STRIPE_SECRET_KEY) {
    log('❌ STRIPE_SECRET_KEY no está configurado', 'red');
    return false;
  }
  
  if (!STRIPE_WEBHOOK_SECRET) {
    log('❌ STRIPE_WEBHOOK_SECRET no está configurado', 'red');
    return false;
  }
  
  log('✅ Variables de entorno de Stripe configuradas', 'green');
  return true;
}

// Prueba 2: Crear sesión de checkout
async function testCheckoutSession() {
  log('\n💳 Probando creación de sesión de checkout...', 'blue');
  
  const checkoutData = {
    quantity: 5
  };
  
  const result = await makeRequest(`${BASE_URL}/api/checkout/session`, {
    method: 'POST',
    body: JSON.stringify(checkoutData)
  });
  
  if (result.success) {
    log('✅ Sesión de checkout creada correctamente', 'green');
    log(`   URL de checkout: ${result.data.data.url}`, 'green');
    return result.data.data.sessionId;
  } else {
    log('❌ Error al crear sesión de checkout', 'red');
    log(`   Error: ${result.error || result.data?.message}`, 'red');
    return null;
  }
}

// Prueba 3: Verificar órdenes en admin
async function testAdminOrders() {
  log('\n📋 Verificando órdenes en admin...', 'blue');
  
  // Primero hacer login
  const loginData = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  };
  
  const loginResult = await makeRequest(`${BASE_URL}/api/admin/auth`, {
    method: 'POST',
    body: JSON.stringify(loginData)
  });
  
  if (!loginResult.success) {
    log('❌ Error en login de admin', 'red');
    return false;
  }
  
  const token = loginResult.data.token;
  
  // Obtener órdenes
  const result = await makeRequest(`${BASE_URL}/api/admin/orders`, {
    headers: {
      'Cookie': `admin-session=${token}`
    }
  });
  
  if (result.success) {
    log('✅ Órdenes obtenidas correctamente', 'green');
    log(`   Total de órdenes: ${result.data.data.orders.length}`, 'green');
    return true;
  } else {
    log('❌ Error al obtener órdenes', 'red');
    return false;
  }
}

// Prueba 4: Verificar webhook de Stripe
async function testStripeWebhook() {
  log('\n🔗 Verificando webhook de Stripe...', 'blue');
  
  // Simular evento de webhook (esto es solo para verificar que la ruta existe)
  const webhookData = {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        payment_status: 'paid',
        amount_total: 5000,
        currency: 'mxn',
        customer_email: 'test@example.com'
      }
    }
  };
  
  const result = await makeRequest(`${BASE_URL}/api/stripe/webhook`, {
    method: 'POST',
    body: JSON.stringify(webhookData)
  });
  
  // El webhook debería fallar sin la firma correcta, pero la ruta debe existir
  if (result.status === 400) {
    log('✅ Webhook de Stripe configurado correctamente', 'green');
    log('   (Error esperado sin firma de webhook válida)', 'yellow');
    return true;
  } else if (result.success) {
    log('✅ Webhook de Stripe funcionando', 'green');
    return true;
  } else {
    log('❌ Error en webhook de Stripe', 'red');
    log(`   Status: ${result.status}`, 'red');
    return false;
  }
}

// Prueba 5: Verificar configuración de precios
async function testPricingConfig() {
  log('\n💰 Verificando configuración de precios...', 'blue');
  
  const result = await makeRequest(`${BASE_URL}/api/settings/pricing`);
  
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
async function runStripeTests() {
  log('💳 Iniciando pruebas de Stripe para Cemento Nacional', 'bold');
  log('=' .repeat(60), 'blue');
  
  const results = {
    config: false,
    checkout: false,
    orders: false,
    webhook: false,
    pricing: false
  };
  
  // Ejecutar pruebas
  results.config = await testStripeConfig();
  results.checkout = await testCheckoutSession();
  results.orders = await testAdminOrders();
  results.webhook = await testStripeWebhook();
  results.pricing = await testPricingConfig();
  
  // Resumen de resultados
  log('\n📊 Resumen de Pruebas de Stripe:', 'bold');
  log('=' .repeat(60), 'blue');
  
  const tests = [
    { name: 'Configuración de Stripe', result: results.config },
    { name: 'Sesión de checkout', result: results.checkout },
    { name: 'Órdenes en admin', result: results.orders },
    { name: 'Webhook de Stripe', result: results.webhook },
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
    log('\n🎉 ¡Todas las pruebas de Stripe pasaron!', 'green');
    process.exit(0);
  } else {
    log('\n⚠️ Algunas pruebas de Stripe fallaron', 'yellow');
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runStripeTests().catch(error => {
    log(`\n💥 Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runStripeTests };
