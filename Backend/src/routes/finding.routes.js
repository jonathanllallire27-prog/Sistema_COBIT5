const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createFinding,
  getFindingsByAudit,
  updateFinding,
  deleteFinding,
  addFindingEvidence
} = require('../controllers/finding.controller');
const { auth } = require('../middleware/auth');

// Configurar multer para subida de archivos de hallazgos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/findings/');
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

router.post('/audit/:auditId', createFinding);
router.get('/audit/:auditId', getFindingsByAudit);
router.put('/:id', updateFinding);
router.delete('/:id', deleteFinding);

// Subir evidencia asociada a un hallazgo
router.post('/:findingId/evidence', upload.single('file'), addFindingEvidence);

module.exports = router;