const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');


const { body } = require('express-validator');


const validatePresensiUpdate = [
  body('checkIn')
    .optional()
    .isISO8601()
    .withMessage('Format tanggal checkIn tidak valid. Gunakan format ISO8601.'),
  body('checkOut')
    .optional()
    .isISO8601()
    .withMessage('Format tanggal checkOut tidak valid. Gunakan format ISO8601.')
];


router.use(addUserData);


router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.delete("/:id", presensiController.deletePresensi);


router.put(
  "/:id", 
  validatePresensiUpdate, 
  presensiController.updatePresensi 
);

module.exports = router;