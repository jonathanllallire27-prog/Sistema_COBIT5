const express = require('express');
const router = express.Router();
const { getProcesses, getControls, getProcessById, getControlsByProcess } = require('../controllers/cobit.controller');
const { auth } = require('../middleware/auth');

router.use(auth);

// Obtener todos los procesos
router.get('/processes', getProcesses);

// Obtener todos los controles
router.get('/controls', getControls);

// Obtener proceso por ID
router.get('/processes/:id', getProcessById);

// Obtener controles de un proceso específico
router.get('/process/:processId/controls', getControlsByProcess);

module.exports = router;