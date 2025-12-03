const jwt = require('jsonwebtoken');

// INI HARUS SAMA PERSIS DENGAN DI AUTHCONTROLLER.JS
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

const verifyToken = (req, res, next) => {
  // 1. Ambil token dari header Authorization
  const tokenHeader = req.header('Authorization');

  // 2. Cek apakah ada token
  if (!tokenHeader) {
    return res.status(401).json({ message: "Akses ditolak! Token tidak ada." });
  }

  try {
    // 3. Bersihkan prefix 'Bearer ' jika ada
    const token = tokenHeader.replace('Bearer ', '');

    // 4. Verifikasi token dengan kunci rahasia
    const verified = jwt.verify(token, JWT_SECRET); // <--- KUNCI HARUS COCOK
    
    // 5. Simpan data user ke request agar bisa dipakai di controller
    req.user = verified;
    next(); // Lanjut ke controller presensi
  } catch (error) {
    res.status(400).json({ message: "Token tidak valid atau kadaluarsa." });
  }
};

module.exports = verifyToken; // Export fungsinya
// Jika di server.js kamu importnya pakai { verifyToken }, gunakan: module.exports = { verifyToken };