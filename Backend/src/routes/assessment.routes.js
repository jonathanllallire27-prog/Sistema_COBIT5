const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAssessmentsByAudit,
  updateAssessment,
  addEvidence
} = require('../controllers/assessment.controller');
const { auth } = require('../middleware/auth');
const { validateAssessment, handleValidationErrors } = require('../middleware/validation');

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/evidences/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.use(auth);

router.get('/audit/:auditId', getAssessmentsByAudit);
router.put('/:id', validateAssessment, handleValidationErrors, updateAssessment);
router.post('/:assessmentId/evidence', upload.single('file'), addEvidence);

module.exports = router;