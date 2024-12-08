const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DataPungutan = sequelize.define("DataPungutan", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kd_moda: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  id_aju: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ur_moda: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  kd_negara: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  ur_negara: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  id_nilai_pabean: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kd_incoterm: {
    type: DataTypes.STRING,
  },
  ur_incoterm: {
    type: DataTypes.STRING,
  },
  kd_valuta: {
    type: DataTypes.STRING,
  },
  ur_valuta: {
    type: DataTypes.STRING,
  },
  nilai_kurs: {
    type: DataTypes.FLOAT,
  },
  nilai_incoterm: {
    type: DataTypes.FLOAT,
  },
  biaya_tambahan: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  biaya_pengurang: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  tarif_vd: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  flag_vd: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  kd_asuransi: {
    type: DataTypes.STRING,
  },
  ur_asuransi: {
    type: DataTypes.STRING,
  },
  nilai_asuransi: {
    type: DataTypes.FLOAT,
  },
  freight: {
    type: DataTypes.FLOAT,
  },
  nilai_pabean: {
    type: DataTypes.FLOAT,
  },
  nilai_pabean_idr: {
    type: DataTypes.FLOAT,
  },
  nilai_jasa: {
    type: DataTypes.FLOAT,
  },
  potongan_harga: {
    type: DataTypes.FLOAT,
  },
  uang_muka: {
    type: DataTypes.FLOAT,
  },
  kd_jaminan: {
    type: DataTypes.INTEGER,
  },
  ur_jaminan: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  harga_penyerahan: {
    type: DataTypes.FLOAT,
  },
  flag_curah: {
    type: DataTypes.STRING,
  },
  ur_flag_curah: {
    type: DataTypes.STRING,
  },
  flag_migas: {
    type: DataTypes.BOOLEAN,
    defaultValue: null,
  },
  ur_flag_migas: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  flag_maklon: {
    type: DataTypes.BOOLEAN,
    defaultValue: null,
  },
  nilai_maklon: {
    type: DataTypes.FLOAT,
  },
  fob: {
    type: DataTypes.FLOAT,
  },
  kd_jasa_pajak: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  ur_jasa_pajak: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  dn_asuransi: {
    type: DataTypes.BOOLEAN,
  },
  dn_freight: {
    type: DataTypes.BOOLEAN,
  },
  ln_asuransi: {
    type: DataTypes.BOOLEAN,
  },
  ln_freight: {
    type: DataTypes.BOOLEAN,
  },
  berat_bersih: {
    type: DataTypes.FLOAT,
  },
  berat_kotor: {
    type: DataTypes.FLOAT,
  },
  volume: {
    type: DataTypes.FLOAT,
  },
});

module.exports = DataPungutan;
