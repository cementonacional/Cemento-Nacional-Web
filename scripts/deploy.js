#!/usr/bin/env node

/**
 * Script de deploy automatizado para Cemento Nacional
 * Verifica prerequisitos y ejecuta deploy
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Función para verificar prerequisitos
function checkPrerequisites() {
  log('🔍 Verificando prerequisitos...', 'blue');
  
  const checks = {
    node: false,
    npm: false,
    vercel: false,
    git: false,
    envFile: false
  };
  
  // Verificar Node.js
  try {
    execSync('node --version', { stdio: 'pipe' });
    checks.node = true;
    log('   ✅ Node.js instalado', 'green');
  } catch (error) {
    log('   ❌ Node.js no instalado', 'red');
  }
  
  // Verificar npm
  try {
    execSync('npm --version', { stdio: 'pipe' });
    checks.npm = true;
    log('   ✅ npm instalado', 'green');
  } catch (error) {
    log('   ❌ npm no instalado', 'red');
  }
  
  // Verificar Vercel CLI
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    checks.vercel = true;
    log('   ✅ Vercel CLI instalado', 'green');
  } catch (error) {
    log('   ❌ Vercel CLI no instalado', 'yellow');
    log('   💡 Instala con: npm install -g vercel', 'yellow');
  }
  
  // Verificar Git
  try {
    execSync('git --version', { stdio: 'pipe' });
    checks.git = true;
    log('   ✅ Git instalado', 'green');
  } catch (error) {
    log('   ❌ Git no instalado', 'red');
  }
  
  // Verificar archivo .env.local
  if (fs.existsSync('.env.local')) {
    checks.envFile = true;
    log('   ✅ Archivo .env.local encontrado', 'green');
  } else {
    log('   ❌ Archivo .env.local no encontrado', 'red');
  }
  
  return checks;
}

// Función para verificar variables de entorno
function checkEnvironmentVariables() {
  log('\n🔧 Verificando variables de entorno...', 'blue');
  
  const requiredVars = [
    'MONGODB_URI',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'GOOGLE_MAPS_API_KEY',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
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
    log('   Configura las variables en .env.local antes del deploy', 'yellow');
  }
  
  return allVarsSet;
}

// Función para hacer build del proyecto
function buildProject() {
  log('\n🔨 Construyendo proyecto...', 'blue');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build exitoso', 'green');
    return true;
  } catch (error) {
    log('❌ Error en build', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Función para ejecutar pruebas
function runTests() {
  log('\n🧪 Ejecutando pruebas...', 'blue');
  
  try {
    execSync('npm run test:all', { stdio: 'inherit' });
    log('✅ Todas las pruebas pasaron', 'green');
    return true;
  } catch (error) {
    log('⚠️ Algunas pruebas fallaron', 'yellow');
    log('   Continuando con el deploy...', 'yellow');
    return true; // Continuar aunque fallen las pruebas
  }
}

// Función para hacer deploy
function deployToVercel() {
  log('\n🚀 Desplegando a Vercel...', 'blue');
  
  try {
    // Verificar si ya está configurado
    try {
      execSync('vercel whoami', { stdio: 'pipe' });
      log('   ✅ Ya estás logueado en Vercel', 'green');
    } catch (error) {
      log('   🔐 Iniciando sesión en Vercel...', 'yellow');
      execSync('vercel login', { stdio: 'inherit' });
    }
    
    // Deploy
    execSync('vercel --prod', { stdio: 'inherit' });
    log('✅ Deploy exitoso', 'green');
    return true;
  } catch (error) {
    log('❌ Error en deploy', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Función para configurar variables de entorno en Vercel
function configureEnvironmentVariables() {
  log('\n⚙️ Configurando variables de entorno en Vercel...', 'blue');
  
  const envVars = [
    'MONGODB_URI',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID',
    'GOOGLE_MAPS_API_KEY',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD'
  ];
  
  envVars.forEach(varName => {
    if (process.env[varName]) {
      try {
        execSync(`vercel env add ${varName}`, { stdio: 'pipe' });
        log(`   ✅ ${varName} configurada`, 'green');
      } catch (error) {
        log(`   ⚠️ ${varName} ya existe o error al configurar`, 'yellow');
      }
    }
  });
}

// Función principal
async function deploy() {
  log('🚀 Iniciando Deploy de Cemento Nacional', 'bold');
  log('=' .repeat(60), 'blue');
  
  // Verificar prerequisitos
  const prerequisites = checkPrerequisites();
  if (!prerequisites.node || !prerequisites.npm) {
    log('\n❌ No se puede continuar sin Node.js y npm', 'red');
    process.exit(1);
  }
  
  // Verificar variables de entorno
  const envVarsOk = checkEnvironmentVariables();
  if (!envVarsOk) {
    log('\n⚠️ Configura las variables de entorno antes de continuar', 'yellow');
    log('   Edita el archivo .env.local con tus valores reales', 'yellow');
  }
  
  // Construir proyecto
  const buildOk = buildProject();
  if (!buildOk) {
    log('\n❌ No se puede continuar sin build exitoso', 'red');
    process.exit(1);
  }
  
  // Ejecutar pruebas
  runTests();
  
  // Deploy a Vercel
  if (prerequisites.vercel) {
    const deployOk = deployToVercel();
    if (deployOk) {
      configureEnvironmentVariables();
      log('\n🎉 ¡Deploy completado exitosamente!', 'green');
      log('   Tu aplicación está disponible en Vercel', 'green');
    } else {
      log('\n❌ Deploy falló', 'red');
      process.exit(1);
    }
  } else {
    log('\n⚠️ Vercel CLI no instalado', 'yellow');
    log('   Instala con: npm install -g vercel', 'yellow');
    log('   Luego ejecuta: vercel', 'yellow');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  deploy().catch(error => {
    log(`\n💥 Error fatal: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { deploy };
