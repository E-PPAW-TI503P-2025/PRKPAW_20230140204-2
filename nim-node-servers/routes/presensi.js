const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const verifyToken = require('../middleware/auth'); // Pastikan path benar

// Pasang middleware verifyToken SEBELUM controller checkIn
router.post('/check-in', verifyToken, presensiController.checkIn);
router.post('/check-out', verifyToken, presensiController.checkOut); // (Jika ada)
router.delete('/:id', verifyToken, presensiController.deletePresensi);

module.exports = router;