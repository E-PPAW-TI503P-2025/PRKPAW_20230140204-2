const express = require('express');
const router = express.Router();


const presensiController = require('../controllers/presensiController'); 

const auth = require('../middleware/auth'); 

router.post('/check-in', auth, presensiController.checkIn);
router.post('/check-out', auth, presensiController.checkOut);

module.exports = router;