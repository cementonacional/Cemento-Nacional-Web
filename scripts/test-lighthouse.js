#!/usr/bin/env node

/**
 * Script de pruebas para Lighthouse
 * Verifica métricas de rendimiento, accesibilidad y SEO
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const LIGHTHOUSE_THRESHOLDS = {
  performance: 80,
  accessibility: 90,
  bestPractices: 80,
  seo: 90
};

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

// Función para ejecutar Lighthouse
async function runLighthouse(url, outputPath) {
  try {
    const command = `npx lighthouse "${url}" --output=json --output-path="${outputPath}" --chrome-flags="--headless" --quiet`;
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    log(`Error ejecutando Lighthouse: ${error.message}`, 'red');
    return false;
  }
}

// Función para analizar resultados de Lighthouse
function analyzeLighthouseResults(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const categories = data.categories;
    
    const results = {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100)
    };
    
    return results;
  } catch (error) {
    log(`Error analizando resultados: ${error.message}`, 'red');
    return null;
  }
}

// Función para verificar umbrales
function checkThresholds(results) {
  const checks = {
    performance: results.performance >= LIGHTHOUSE_THRESHOLDS.performance,
    accessibility: results.accessibility >= LIGHTHOUSE_THRESHOLDS.accessibility,
    bestPractices: results.bestPractices >= LIGHTHOUSE_THRESHOLDS.bestPractices,
    seo: results.seo >= LIGHTHOUSE_THRESHOLDS.seo
  };
  
  return checks;
}

// Función para probar una URL específica
async function testURL(url, name) {
  log(`\n🔍 Probando ${name}...`, 'blue');
  log(`   URL: ${url}`, 'cyan');
  
  const outputPath = `lighthouse-${name.replace(/\s+/g, '-').toLowerCase()}.json`;
  
  const success = await runLighthouse(url, outputPath);
  if (!success) {
    log(`❌ Error ejecutando Lighthouse para ${name}`, 'red');
    return null;
  }
  
  const results = analyzeLighthouseResults(outputPath);
  if (!results) {
    log(`❌ Error analizando resultados para ${name}`, 'red');
    return null;
  }
  
  const checks = checkThresholds(results);
  
  // Mostrar resultados
  log(`   Performance: ${results.performance}% ${checks.performance ? '✅' : '❌'}`, checks.performance ? 'green' : 'red');
  log(`   Accesibilidad: ${results.accessibility}% ${checks.accessibility ? '✅' : '❌'}`, checks.accessibility ? 'green' : 'red');
  log(`   Mejores Prácticas: ${results.bestPractices}% ${checks.bestPractices ? '✅' : '❌'}`, checks.bestPractices ? 'green' : 'red');
  log(`   SEO: ${results.seo}% ${checks.seo ? '✅' : '❌'}`, checks.seo ? 'green' : 'red');
  
  // Limpiar archivo temporal
  try {
    fs.unlinkSync(outputPath);
  } catch (error) {
    // Ignorar error si no se puede eliminar
  }
  
  return { results, checks };
}

// Función principal
async function runLighthouseTests() {
  log('🚀 Iniciando pruebas de Lighthouse para Cemento Nacional', 'bold');
  log('=' .repeat(80), 'blue');
  
  const urls = [
    { url: BASE_URL, name: 'Página Principal' },
    { url: `${BASE_URL}/sobre`, name: 'Sobre Nosotros' },
    { url: `${BASE_URL}/calidad`, name: 'Calidad' },
    { url: `${BASE_URL}/galeria`, name: 'Galería' },
    { url: `${BASE_URL}/contacto`, name: 'Contacto' },
    { url: `${BASE_URL}/comprar`, name: 'Comprar' },
    { url: `${BASE_URL}/pedidos`, name: 'Pedidos' }
  ];
  
  const results = [];
  let totalPassed = 0;
  let totalTests = 0;
  
  for (const { url, name } of urls) {
    const result = await testURL(url, name);
    if (result) {
      results.push({ name, ...result });
      const passed = Object.values(result.checks).filter(Boolean).length;
      totalPassed += passed;
      totalTests += 4; // 4 categorías por URL
    }
  }
  
  // Resumen final
  log('\n' + '='.repeat(80), 'blue');
  log('📊 RESUMEN DE LIGHTHOUSE', 'bold');
  log('=' .repeat(80), 'blue');
  
  if (results.length === 0) {
    log('❌ No se pudieron ejecutar las pruebas de Lighthouse', 'red');
    process.exit(1);
  }
  
  // Calcular promedios
  const averages = {
    performance: Math.round(results.reduce((sum, r) => sum + r.results.performance, 0) / results.length),
    accessibility: Math.round(results.reduce((sum, r) => sum + r.results.accessibility, 0) / results.length),
    bestPractices: Math.round(results.reduce((sum, r) => sum + r.results.bestPractices, 0) / results.length),
    seo: Math.round(results.reduce((sum, r) => sum + r.results.seo, 0) / results.length)
  };
  
  log('\n📈 Promedios Generales:', 'bold');
  log(`   Performance: ${averages.performance}%`, averages.performance >= LIGHTHOUSE_THRESHOLDS.performance ? 'green' : 'red');
  log(`   Accesibilidad: ${averages.accessibility}%`, averages.accessibility >= LIGHTHOUSE_THRESHOLDS.accessibility ? 'green' : 'red');
  log(`   Mejores Prácticas: ${averages.bestPractices}%`, averages.bestPractices >= LIGHTHOUSE_THRESHOLDS.bestPractices ? 'green' : 'red');
  log(`   SEO: ${averages.seo}%`, averages.seo >= LIGHTHOUSE_THRESHOLDS.seo ? 'green' : 'red');
  
  log('\n📋 Resultados por Página:', 'bold');
  results.forEach(({ name, results, checks }) => {
    const passed = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const status = passed === total ? '✅' : '⚠️';
    const color = passed === total ? 'green' : 'yellow';
    
    log(`   ${status} ${name}: ${passed}/${total} categorías pasaron`, color);
  });
  
  log('\n🎯 Umbrales Objetivo:', 'bold');
  log(`   Performance: ≥ ${LIGHTHOUSE_THRESHOLDS.performance}%`, 'blue');
  log(`   Accesibilidad: ≥ ${LIGHTHOUSE_THRESHOLDS.accessibility}%`, 'blue');
  log(`   Mejores Prácticas: ≥ ${LIGHTHOUSE_THRESHOLDS.bestPractices}%`, 'blue');
  log(`   SEO: ≥ ${LIGHTHOUSE_THRESHOLDS.seo}%`, 'blue');
  
  const overallPassed = totalPassed === totalTests;
  const percentage = Math.round((totalPassed / totalTests) * 100);
  
  log('\n📊 Resultado Final:', 'bold');
  log(`   Pruebas pasaron: ${totalPassed}/${totalTests}`, overallPassed ? 'green' : 'yellow');
  log(`   Porcentaje: ${percentage}%`, overallPassed ? 'green' : 'yellow');
  
  if (overallPassed) {
    log('\n🎉 ¡TODAS LAS PRUEBAS DE LIGHTHOUSE PASARON!', 'green');
    log('   La aplicación cumple con los estándares de calidad', 'green');
    process.exit(0);
  } else {
    log('\n⚠️ ALGUNAS PRUEBAS DE LIGHTHOUSE FALLARON', 'yellow');
    log('   Revisa los resultados y optimiza la aplicación', 'yellow');
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runLighthouseTests().catch(error => {
    log(`\n💥 Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runLighthouseTests };
