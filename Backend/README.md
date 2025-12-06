# COBIT Audit System - Backend

Backend API para el Sistema de Auditoría COBIT 5.

## Estructura

```
Backend/
├── server.js           # Punto de entrada
├── package.json        # Dependencias
├── .env                # Variables de entorno
├── src/
│   ├── app.js          # Configuración Express
│   ├── config/         # Configuración de BD
│   ├── controllers/    # Lógica de negocio
│   ├── routes/         # Rutas API
│   ├── models/         # Modelos Sequelize
│   ├── middleware/     # Middleware Express
│   └── utils/          # Utilidades
└── uploads/            # Archivos subidos
```

## Requisitos

- Node.js 16+
- PostgreSQL 12+

## Instalación

```bash
npm install
```

## Configuración

Copia `.env.example` a `.env` y configura:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=cobit_audit_db
JWT_SECRET=tu_secreto_jwt
```

## Ejecución

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:5000/api`

## API Endpoints

- **Auth**: `/api/auth` - Registro y login
- **Audits**: `/api/audits` - Gestión de auditorías
- **Assessments**: `/api/assessments` - Evaluaciones
- **Findings**: `/api/findings` - Hallazgos
- **Reports**: `/api/reports` - Reportes
- **Users**: `/api/users` - Gestión de usuarios

## Health Check

```bash
curl http://localhost:5000/api/health
```

## Notas

- Los archivos de prueba (`test-*.js`, `seed-*.js`, etc.) fueron removidos
- Se usa Sequelize ORM para manejo de BD
- JWT para autenticación
- Morgan para logging
- Helmet para seguridad
