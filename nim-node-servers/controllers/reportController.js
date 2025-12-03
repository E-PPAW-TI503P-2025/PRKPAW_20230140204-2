// nim-node-servers/controllers/reportController.js
const { User, Presensi } = require('../models'); // <-- WAJIB IMPORT KEDUA MODEL INI!
const { Op } = require('sequelize');

exports.getDailyReport = async (req, res) => {
    try {
        // Logika query pencarian
        const { nama } = req.query;
        let userCondition = {};
        if (nama) {
            userCondition = {
                nama: { [Op.like]: `%${nama}%` }
            };
        }

        const reports = await Presensi.findAll({
            // INI KUNCINYA: Menggabungkan data User
            include: [{
                model: User,
                as: 'user', 
                attributes: ['nama', 'email'], 
                where: userCondition 
            }],
            order: [['checkIn', 'DESC']]
        });

        res.status(200).json({
            status: "success",
            // Mengirim data ke Frontend
            data: reports
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal mengambil laporan" });
    }
};