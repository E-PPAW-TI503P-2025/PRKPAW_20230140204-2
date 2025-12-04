'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      // Relasi ke tabel User (Wajib ada agar nama muncul di laporan)
      Presensi.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  
  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    // --- TAMBAHAN PENTING (Agar foto muncul) ---
    buktiFoto: {
      type: DataTypes.STRING,
      allowNull: true
    }
    // ------------------------------------------
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  
  return Presensi;
};