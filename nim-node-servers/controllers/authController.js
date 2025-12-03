// PERBAIKAN 1: Path import model disesuaikan (cukup satu titik dua '..')
const { User } = require('../models'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Gunakan secret key yang sama persis
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.register = async (req, res) => {
  try {
    // PERBAIKAN 2: Terima 'fullName' (dari React) ATAU 'nama' (dari Postman)
    const { fullName, nama, email, password, role } = req.body;

    // Prioritaskan nama, jika tidak ada pakai fullName
    const namaUser = nama || fullName;

    // Validasi input
    if (!namaUser || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password harus diisi" });
    }

    // Validasi Role
    if (role && !['mahasiswa', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid. Harus 'mahasiswa' atau 'admin'." });
    }

    // Cek apakah email sudah ada (Manual check untuk pesan error lebih jelas)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "Email sudah terdaftar, gunakan email lain." });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat User Baru
    const newUser = await User.create({
      nama: namaUser, // Masukkan data yang sudah dipastikan ada
      email,
      password: hashedPassword,
      role: role || 'mahasiswa'
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      data: { 
          id: newUser.id, 
          nama: newUser.nama, 
          email: newUser.email, 
          role: newUser.role 
      }
    });

  } catch (error) {
    console.log(">>> INI ERRORNYA:", error); // Log error agar muncul di terminal
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    // 2. Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah." });
    }

    // 3. Buat Payload Token
    const payload = {
      id: user.id,
      nama: user.nama,
      role: user.role
    };

    // 4. Buat Token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({
      message: "Login berhasil",
      token: token,
      user: {
          id: user.id,
          nama: user.nama,
          role: user.role
      }
    });

  } catch (error) {
    console.log(">>> ERROR LOGIN:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};