# AuditSys - Sistema de Gestión de Auditorías COBIT 5

Un aplicativo completo para la gestión de auditorías de sistemas basado en el marco de trabajo COBIT 5.

## 🎯 Características

- ✅ **Gestión Completa de Auditorías**: Crear, editar y monitorear auditorías
- ✅ **COBIT 5 Framework**: 37 procesos y controles según COBIT 5
- ✅ **Evaluaciones de Control**: Evaluar el cumplimiento de controles
- ✅ **Gestión de Hallazgos**: Registrar y hacer seguimiento a hallazgos de auditoría
- ✅ **Gestión de Evidencia**: Subir y gestionar documentos de evidencia
- ✅ **Reportes Personalizados**: Generar reportes en PDF, Excel y Word
- ✅ **Dashboard Analítico**: Métricas y gráficos de cumplimiento
- ✅ **Gestión de Usuarios**: Control de acceso basado en roles
- ✅ **Tema Oscuro/Claro**: Interfaz adaptable

## 🏗️ Arquitectura

### Frontend
- **React 19** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Recharts** para gráficos
- **React Hook Form** para formularios
- **React Router** para navegación

### Backend
- **Node.js** + **Express.js**
- **Sequelize** como ORM
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **Multer** para subida de archivos
- **Helmet** para seguridad
- **CORS** habilitado

## 📦 Instalación

### Requisitos Previos
- Node.js >= 16
- PostgreSQL >= 12
- npm o yarn

### Pasos de Instalación

#### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd System_auditor
```

#### 2. Configurar Backend

```bash
cd Backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales de base de datos
# DB_HOST=localhost
# DB_NAME=auditsys
# DB_USER=postgres
# DB_PASSWORD=your_password

# Crear base de datos
createdb auditsys

# Iniciar servidor (desarrollo)
npm run dev

# O para producción
npm start
```

#### 3. Configurar Frontend

```bash
cd Frontend

# Instalar dependencias
npm install

# Crear archivo .env.local (si es necesario)
# VITE_API_URL=http://localhost:5000/api

# Iniciar servidor de desarrollo
npm run dev

# O compilar para producción
npm run build
```

## 🔐 Autenticación

El sistema incluye autenticación basada en JWT. Las credenciales de prueba se pueden crear usando los endpoints de registro.

### Roles disponibles:
- **admin**: Acceso completo al sistema
- **auditor**: Puede participar en auditorías
- **audit_leader**: Lidera auditorías
- **process_owner**: Propietario de procesos
- **reviewer**: Revisor de auditorías

## 📚 Rutas API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

### Auditorías
- `GET /api/audits` - Listar auditorías
- `POST /api/audits` - Crear auditoría
- `GET /api/audits/:id` - Obtener auditoría
- `PUT /api/audits/:id` - Actualizar auditoría
- `DELETE /api/audits/:id` - Eliminar auditoría

### COBIT 5
- `GET /api/cobit/processes` - Listar procesos COBIT
- `GET /api/cobit/processes/:id` - Obtener proceso
- `GET /api/cobit/controls` - Listar controles
- `GET /api/cobit/process/:processId/controls` - Controles por proceso

### Evaluaciones
- `GET /api/assessments/audit/:auditId` - Evaluaciones de auditoría
- `PUT /api/assessments/:id` - Actualizar evaluación
- `POST /api/assessments/:id/evidence` - Agregar evidencia

### Hallazgos
- `GET /api/findings/audit/:auditId` - Hallazgos de auditoría
- `POST /api/findings/audit/:auditId` - Crear hallazgo
- `PUT /api/findings/:id` - Actualizar hallazgo
- `DELETE /api/findings/:id` - Eliminar hallazgo

### Reportes
- `GET /api/reports/audit/:auditId/pdf` - Generar reporte PDF
- `GET /api/reports/audit/:auditId/excel` - Generar reporte Excel
- `GET /api/reports/audit/:auditId/word` - Generar reporte Word

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `POST /api/users` - Crear usuario (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

### Configuración
- `GET /api/settings` - Obtener configuración (admin)
- `PUT /api/settings` - Actualizar configuración (admin)

## 📊 Estructura de Base de Datos

### Principales Tablas
- **Users**: Usuarios del sistema
- **Audits**: Registros de auditorías
- **Assessments**: Evaluaciones de controles
- **Controls**: Controles COBIT 5
- **CobitProcesses**: Procesos COBIT 5
- **Findings**: Hallazgos de auditoría
- **Evidence**: Evidencia de evaluaciones

## 🛠️ Desarrollo

### Scripts disponibles

**Backend**
```bash
npm start          # Iniciar servidor
npm run dev        # Iniciar con nodemon
npm test           # Ejecutar tests
```

**Frontend**
```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm run preview    # Vista previa de compilación
npm run lint       # Ejecutar eslint
```

## 📖 Documentación COBIT 5

El sistema incluye:
- **5 Dominios**: EDM, APO, BAI, DSS, MEA
- **37 Procesos**: Completos según COBIT 5
- **Controles Detallados**: Con métricas y niveles de madurez
- **Modelos de Madurez**: Desde 0 (No Optimizado) hasta 5 (Optimizado Continuo)

## 🔍 Niveles de Madurez COBIT

- **Nivel 0**: No Optimizado
- **Nivel 1**: Repetible (Ad-hoc)
- **Nivel 2**: Definido (Documentado)
- **Nivel 3**: Administrado (Controlado)
- **Nivel 4**: Optimizado (Medido)
- **Nivel 5**: Optimizado Continuo (Mejorado)

## 🐛 Troubleshooting

### Error de conexión a base de datos
Verificar que PostgreSQL esté corriendo y las credenciales en `.env` sean correctas.

### Puerto ya en uso
Cambiar `PORT` en `.env` a otro puerto disponible.

### Errores de CORS
Verificar `APP_URL` en `.env` coincida con la URL del frontend.

## 📄 Licencia

Este proyecto está bajo licencia académica para uso educativo.

## 👥 Equipo

Desarrollado como sistema de gestión de auditorías COBIT 5 académico.

## 📞 Soporte

Para soporte o reportar bugs, contactar al equipo de desarrollo.

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
