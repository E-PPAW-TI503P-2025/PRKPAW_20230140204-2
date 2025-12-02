const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
   
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
    }

    
    const token = header.split(" ")[1];
    if (!token) {
       return res.status(401).json({ message: 'Akses ditolak. Format token salah.' });
    }
    
    
    const decoded = jwt.verify(token, 'RAHASIA_NEGARA'); 
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token tidak valid atau kadaluarsa'
    });
  }
};

module.exports = auth;