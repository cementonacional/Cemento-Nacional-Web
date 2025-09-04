# 🗄️ Configuración de MongoDB Atlas

## Pasos para configurar MongoDB Atlas

### 1. Crear cuenta en MongoDB Atlas
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Crear un cluster
1. Selecciona "Build a Database"
2. Elige "FREE" (M0 Sandbox)
3. Selecciona región más cercana (us-east-1 para Vercel)
4. Nombra tu cluster (ej: "cemento-nacional")

### 3. Configurar acceso
1. **Database Access**:
   - Crea un usuario de base de datos
   - Username: `cemento-admin`
   - Password: Genera una contraseña segura
   - Database User Privileges: "Read and write to any database"

2. **Network Access**:
   - Agrega IP: `0.0.0.0/0` (permite acceso desde cualquier IP)
   - O agrega la IP de Vercel: `76.76.19.61/32`

### 4. Obtener connection string
1. Ve a "Database" > "Connect"
2. Selecciona "Connect your application"
3. Driver: Node.js
4. Version: 4.1 or later
5. Copia la connection string

### 5. Configurar en Vercel
1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega:
   - `MONGODB_URI`: Tu connection string completo
   - Reemplaza `<password>` con la contraseña del usuario
   - Reemplaza `<dbname>` con `cemento-nacional`

### Ejemplo de connection string:
```
mongodb+srv://cemento-admin:<password>@cluster0.xxxxx.mongodb.net/cemento-nacional?retryWrites=true&w=majority
```

### 6. Verificar conexión
```bash
# En tu proyecto local
npm run dev

# Verificar que la conexión funcione
# Debería aparecer "Connected to MongoDB" en los logs
```

## 🔧 Troubleshooting

### Error: "MongoServerError: bad auth"
- Verifica que el username y password sean correctos
- Asegúrate de que el usuario tenga permisos de lectura/escritura

### Error: "MongoNetworkError: failed to connect"
- Verifica que la IP esté en la whitelist de MongoDB Atlas
- Verifica que el connection string sea correcto

### Error: "MongoServerError: not authorized"
- Verifica que el usuario tenga permisos en la base de datos
- Asegúrate de que el nombre de la base de datos sea correcto
