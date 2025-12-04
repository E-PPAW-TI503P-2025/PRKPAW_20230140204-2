const express = require("express");
const cors = require("cors");
const path = require("path"); 
const app = express();
const PORT = 3001;
const morgan = require("morgan");

// --- PERBAIKAN IMPORT PATH (Jalur Folder) ---
// Karena server.js ada di luar, kita harus masuk ke folder 'nim-node-servers' dulu
const presensiRoutes = require("./nim-node-servers/routes/presensi");
const reportRoutes = require("./nim-node-servers/routes/reports");
const authRoutes = require('./nim-node-servers/routes/auth');
// const ruteBuku = require("./nim-node-servers/routes/books"); // Uncomment jika file books.js ada

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- KONFIGURASI FOLDER FOTO ---
// Folder 'uploads' akan dibuat di tempat server.js berada (Root Folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// --- DAFTARKAN RUTE ---
// app.use("/api/books", ruteBuku); 
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});