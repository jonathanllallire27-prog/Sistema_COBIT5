const express = require('express');
const router = express.Router();
const { getProcesses, getControls, getProcessById, getControlsByProcess } = require('../controllers/cobit.controller');
const { auth } = require('../middleware/auth');

router.use(auth);

// Obtener todos los procesos
router.get('/processes', getProcesses);

// Obtener todos los controles
router.get('/controls', getControls);

// Obtener controles de un proceso específico (ANTES de :id)
router.get('/process/:processId/controls', getControlsByProcess);

// Obtener proceso por ID (DESPUÉS de las rutas específicas)
router.get('/processes/:id', getProcessById);

module.exports = router;