const { Presensi } = require('../models');

const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;

    const sudahCheckIn = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null
      }
    });

    if (sudahCheckIn) {
      return res.status(400).json({ message: "Anda belum check-out dari sesi sebelumnya" });
    }

    await Presensi.create({
      userId: userId,
      checkIn: new Date()
    });

    res.status(200).json({ message: "Berhasil Check-In" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const presensi = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null
      }
    });

    if (!presensi) {
      return res.status(400).json({ message: "Anda belum melakukan check-in" });
    }

    await presensi.update({
      checkOut: new Date()
    });

    res.status(200).json({ message: "Berhasil Check-Out" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = { checkIn, checkOut };