const DataPungutan = require("../models/dataPungutan");

exports.saveOrUpdateDataPungutan = async (req, res) => {
  try {
    const payload = req.body;

    // Validasi input
    if (!payload.id_aju || !payload.id_nilai_pabean) {
      return res.status(400).json({ error: "ID Aju dan ID Nilai Pabean wajib diisi." });
    }

    const nilaiFob =
      parseFloat(payload.nilai_incoterm || 0) +
      parseFloat(payload.biaya_tambahan || 0) -
      parseFloat(payload.biaya_pengurang || 0) +
      parseFloat(payload.tarif_vd || 0);

    const cif = nilaiFob + parseFloat(payload.nilai_asuransi || 0) + parseFloat(payload.freight || 0);
    const cifIdr = cif * parseFloat(payload.nilai_kurs || 0);

    payload.fob = nilaiFob;
    payload.nilai_pabean = cif;
    payload.nilai_pabean_idr = cifIdr;

    let result;

    if (payload.id) {
      const existingData = await DataPungutan.findByPk(payload.id);
      if (!existingData) {
        return res.status(404).json({ error: "Data tidak ditemukan untuk ID tersebut." });
      }

      result = await existingData.update(payload);
    } else {
      // Simpan data baru jika id tidak diberikan
      result = await DataPungutan.create(payload);
    }

    return res.status(200).json({ message: "Data berhasil diproses.", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
