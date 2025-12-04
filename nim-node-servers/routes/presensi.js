const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const verifyToken = require('../middleware/auth');

// Route Check-In (Upload Foto)
router.post('/check-in', 
    verifyToken, 
    presensiController.upload.single('image'), 
    presensiController.checkIn
);

// Route Check-Out
router.post('/check-out', verifyToken, presensiController.checkOut);

// Route Hapus (PASTIKAN BARIS INI ADA DAN TIDAK DI-KOMENTAR)
router.delete('/:id', verifyToken, presensiController.deletePresensi);

module.exports = router;