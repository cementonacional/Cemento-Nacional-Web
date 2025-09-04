#!/usr/bin/env node

/**
 * Script maestro para ejecutar todas las pruebas End-to-End
 * Ejecuta pruebas de funcionalidad, Stripe y Google Maps
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Importar scripts de prueba
const { runTests } = require('./test-e2e.js');
const { runStripeTests } = require('./test-stripe.js');
const { runMapsTests } = require('./test-maps.js');
const { runLighthouseTests } = require('./test-lighthouse.js');

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para log con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para ejecutar prueba con manejo de errores
async function runTest(testName, testFunction) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`🧪 Ejecutando: ${testName}`, 'bold');
  log(`${'='.repeat(60)}`, 'cyan');
  
  try {
    await testFunction();
    log(`\n✅ ${testName} completado exitosamente`, 'green');
    return true;
  } catch (error) {
    log(`\n❌ ${testName} falló`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Función para verificar dependencias
function checkDependencies() {
  log('🔍 Verificando dependencias...', 'blue');
  
  const requiredFiles = [
    'package.json',
    'src/app/layout.tsx',
    'src/components/NavBar.tsx',
    'src/app/api/contact/route.ts',
    'src/app/api/admin/auth/route.ts'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`   ✅ ${file}`, 'green');
    } else {
      log(`   ❌ ${file}`, 'red');
      allFilesExist = false;
    }
  });
  
  if (!allFilesExist) {
    log('\n❌ Faltan archivos requeridos', 'red');
    return false;
  }
  
  log('✅ Todas las dependencias están presentes', 'green');
  return true;
}

// Función para verificar variables de entorno
function checkEnvironmentVariables() {
  log('\n🔧 Verificando variables de entorno...', 'blue');
  
  const requiredVars = [
    'MONGODB_URI',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'GOOGLE_MAPS_API_KEY',
    'NEXT_PUBLIC_BASE_URL',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD'
  ];
  
  let allVarsSet = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      log(`   ✅ ${varName}`, 'green');
    } else {
      log(`   ❌ ${varName}`, 'red');
      allVarsSet = false;
    }
  });
  
  if (!allVarsSet) {
    log('\n⚠️ Algunas variables de entorno no están configuradas', 'yellow');
    log('   Las pruebas pueden fallar sin estas variables', 'yellow');
  } else {
    log('✅ Todas las variables de entorno están configuradas', 'green');
  }
  
  return true;
}

// Función para verificar que el servidor esté corriendo
async function checkServer() {
  log('\n🌐 Verificando servidor...', 'blue');
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(baseUrl);
    if (response.ok) {
      log('✅ Servidor está corriendo', 'green');
      return true;
    } else {
      log('❌ Servidor no responde correctamente', 'red');
      return false;
    }
  } catch (error) {
    log('❌ No se puede conectar al servidor', 'red');
    log('   Asegúrate de ejecutar: npm run dev', 'yellow');
    return false;
  }
}

// Función principal
async function runAllTests() {
  log('🚀 Iniciando Suite Completa de Pruebas End-to-End', 'bold');
  log('   Cemento Nacional - La Fuerza del Presente', 'bold');
  log('=' .repeat(80), 'blue');
  
  const startTime = Date.now();
  const results = {
    dependencies: false,
    environment: false,
    server: false,
    e2e: false,
    stripe: false,
    maps: false,
    lighthouse: false
  };
  
  // Verificaciones previas
  results.dependencies = checkDependencies();
  if (!results.dependencies) {
    log('\n❌ No se pueden ejecutar las pruebas sin las dependencias', 'red');
    process.exit(1);
  }
  
  results.environment = checkEnvironmentVariables();
  results.server = await checkServer();
  
  if (!results.server) {
    log('\n❌ No se pueden ejecutar las pruebas sin servidor', 'red');
    process.exit(1);
  }
  
  // Ejecutar pruebas
  results.e2e = await runTest('Pruebas End-to-End Principales', runTests);
  results.stripe = await runTest('Pruebas de Stripe', runStripeTests);
  results.maps = await runTest('Pruebas de Google Maps', runMapsTests);
  results.lighthouse = await runTest('Pruebas de Lighthouse', runLighthouseTests);
  
  // Resumen final
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000);
  
  log('\n' + '='.repeat(80), 'blue');
  log('📊 RESUMEN FINAL DE PRUEBAS', 'bold');
  log('=' .repeat(80), 'blue');
  
  const testSuites = [
    { name: 'Dependencias', result: results.dependencies },
    { name: 'Variables de entorno', result: results.environment },
    { name: 'Servidor', result: results.server },
    { name: 'Pruebas E2E Principales', result: results.e2e },
    { name: 'Pruebas de Stripe', result: results.stripe },
    { name: 'Pruebas de Google Maps', result: results.maps },
    { name: 'Pruebas de Lighthouse', result: results.lighthouse }
  ];
  
  let passed = 0;
  let total = testSuites.length;
  
  testSuites.forEach(suite => {
    const status = suite.result ? '✅' : '❌';
    const color = suite.result ? 'green' : 'red';
    log(`${status} ${suite.name}`, color);
    if (suite.result) passed++;
  });
  
  log('\n📈 Estadísticas:', 'bold');
  log(`   Suites pasaron: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  log(`   Porcentaje: ${Math.round((passed / total) * 100)}%`, passed === total ? 'green' : 'yellow');
  log(`   Tiempo total: ${duration} segundos`, 'blue');
  
  if (passed === total) {
    log('\n🎉 ¡TODAS LAS PRUEBAS PASARON!', 'green');
    log('   La aplicación está lista para producción', 'green');
    process.exit(0);
  } else {
    log('\n⚠️ ALGUNAS PRUEBAS FALLARON', 'yellow');
    log('   Revisa los errores arriba y corrige los problemas', 'yellow');
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllTests().catch(error => {
    log(`\n💥 Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runAllTests };
