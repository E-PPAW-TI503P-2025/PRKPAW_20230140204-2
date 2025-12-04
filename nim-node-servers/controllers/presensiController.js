const { Presensi } = require('../models');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

// --- SETUP MULTER ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Hanya file gambar yang boleh diupload!'), false);
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// --- CHECK IN ---
exports.checkIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const { latitude, longitude } = req.body;
        const buktiFoto = req.file ? req.file.path : null;

        if (!buktiFoto) return res.status(400).json({ message: "Foto wajib ada!" });

        const presensi = await Presensi.create({
            userId, checkIn: new Date(), latitude, longitude, buktiFoto
        });

        res.status(201).json({ message: "Check-in Berhasil", data: presensi });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- CHECK OUT ---
exports.checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const presensi = await Presensi.findOne({
            where: {
                userId: userId,
                checkOut: null,
                createdAt: { [Op.gte]: today }
            },
            order: [['createdAt', 'DESC']]
        });

        if (!presensi) return res.status(400).json({ message: "Belum Check-In hari ini." });

        await presensi.update({ checkOut: new Date() });
        res.status(200).json({ message: "Berhasil Check-Out!" });
    } catch (error) {
        res.status(500).json({ message: "Error server" });
    }
};

exports.deletePresensi = async (req, res) => {
    try {
        const { id } = req.params;
        const presensi = await Presensi.findByPk(id);

        if (!presensi) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        // Hapus data dari database
        await presensi.destroy();
    
        res.status(200).json({ message: "Data berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus: " + error.message });
    }
};
// PASTIKAN TIDAK ADA KODE LAIN DI BAWAH SINI