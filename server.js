const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");

// Impor router
const presensiRoutes = require("./nim-node-servers/routes/presensi");
const reportRoutes = require("./nim-node-servers/routes/reports");
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.get("/", (req, res) => {
  res.send("Home Page for API");
});
const ruteBuku = require("./nim-node-servers/routes/books");
app.use("/api/books", ruteBuku);
app.use("/api/attendance", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
