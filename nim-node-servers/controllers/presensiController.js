const { Presensi } = require('../models');

// Gunakan 'exports.' langsung di sini
exports.checkIn = async (req, res) => {
  try {
    // 1. Ambil ID User dari Token
    const userId = req.user.id; 

    // 2. Ambil data lokasi dari Frontend
    const { latitude, longitude } = req.body; 

    // 3. Simpan ke database
    const presensi = await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      latitude: latitude,
      longitude: longitude
    });

    res.status(201).json({ // Pakai status 201 (Created)
        message: `Halo User ${req.user.role || 'Mahasiswa'}, check-in Anda berhasil pada pukul ${new Date().toLocaleTimeString('id-ID')} WIB`, 
        data: presensi 
    });

  } catch (error) {
    res.status(500).json({ message: "Gagal Check-in: " + error.message });
  }
};

// Gunakan 'exports.' juga di sini
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;

    // Cari presensi hari ini yang belum check-out
    const presensi = await Presensi.findOne({
      where: {
        userId: userId,
        checkOut: null
      }
    });

    if (!presensi) {
      return res.status(400).json({ message: "Anda belum check-in atau sudah check-out" });
    }

    // Update waktu check-out
    await presensi.update({
      checkOut: new Date()
    });

    res.status(200).json({ message: "Berhasil Check-Out" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server: " + error.message });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari URL

    // Cari data dulu (opsional, untuk memastikan data ada)
    const data = await Presensi.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // Lakukan penghapusan
    await data.destroy();

    res.status(200).json({ message: "Data presensi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data: " + error.message });
  }
};

// ---------------------------------------------------------
// PENTING: JANGAN ADA KODE 'module.exports' DI BAWAH SINI!
// BIARKAN KOSONG ATAU KOMENTAR SAJA.
// ---------------------------------------------------------