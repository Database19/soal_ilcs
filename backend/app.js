const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

// Konfigurasi aplikasi
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Konfigurasi database
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Kodok123!",
  database: "soal_ilcs",
  waitForConnections: true,
  connectionLimit: 10,
});

// Helper untuk menghitung nilai FOB, CIF, dan CIF Rp
const calculateValues = (payload) => {
  const fob =
    (parseFloat(payload.nilai_incoterm || 0) +
      parseFloat(payload.biaya_tambahan || 0) -
      parseFloat(payload.biaya_pengurang || 0) +
      parseFloat(payload.tarif_vd || 0));
  const cif =
    fob + parseFloat(payload.nilai_asuransi || 0) + parseFloat(payload.freight || 0);
  return { fob, cif, cifRp: cif * parseFloat(payload.nilai_kurs || 0) };
};

const formatDate = (date) => {
  const [day, month, year] = date.split('-');
  return `${year}-${month}-${day}`;
};


// Fungsi untuk menyimpan atau memperbarui data ke tabel
const upsertData = async (connection, query, params) => {
  await connection.query(query, params);
};

app.post("/api/data", async (req, res) => {
  const { utama, entitas, pungutan } = req.body;
  console.log(utama)
  const requiredUtama = ["id_aju", "nomor_pengajuan", "tanggal_pengajuan"];
  const requiredPungutan = ["id_aju", "nilai_incoterm", "biaya_tambahan", "biaya_pengurang", "tarif_vd", "nilai_asuransi", "freight", "nilai_kurs"];

  for (const field of requiredUtama) if (!utama[field]) return res.status(400).json({ error: `${field} is required in utama` });
  for (const field of requiredPungutan) if (!pungutan[field]) return res.status(400).json({ error: `${field} is required in pungutan` });

  const { fob, cif, cifRp } = calculateValues(pungutan);

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert/update untuk tabel utama
    await upsertData(connection,
      `INSERT INTO utama (id_aju, nomor_pengajuan, tanggal_pengajuan, kd_pabean_asal, jenis_kegiatan)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE nomor_pengajuan = VALUES(nomor_pengajuan), tanggal_pengajuan = VALUES(tanggal_pengajuan), kd_pabean_asal = VALUES(kd_pabean_asal), jenis_kegiatan = VALUES(jenis_kegiatan)`,
      [utama.id_aju, utama.nomor_pengajuan, formatDate(utama.tanggal_pengajuan), utama.kd_pabean_asal, utama.jenis_kegiatan]
    );

    // Insert/update untuk tabel entitas
    await upsertData(connection,
      `INSERT INTO entitas (id_aju, npwp_pengaju, user_portal, kd_entitas_pemberitahu, ur_entitas_pemberitahu, nama_identitas, alamat_identitas, kota_identitas, kd_negara, ur_negara)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE npwp_pengaju = VALUES(npwp_pengaju), user_portal = VALUES(user_portal), kd_entitas_pemberitahu = VALUES(kd_entitas_pemberitahu), ur_entitas_pemberitahu = VALUES(ur_entitas_pemberitahu), nama_identitas = VALUES(nama_identitas), alamat_identitas = VALUES(alamat_identitas), kota_identitas = VALUES(kota_identitas), kd_negara = VALUES(kd_negara), ur_negara = VALUES(ur_negara)`,
      [utama.id_aju, entitas.npwp_pengaju, entitas.user_portal, entitas.kd_entitas_pemberitahu, entitas.ur_entitas_pemberitahu, entitas.nama_identitas, entitas.alamat_identitas, entitas.kota_identitas, entitas.kd_negara, entitas.ur_negara]
    );

    // Insert/update untuk tabel pungutan
    await upsertData(connection,
      `INSERT INTO pungutan (id_aju, kd_incoterm, nilai_incoterm, biaya_tambahan, biaya_pengurang, tarif_vd, nilai_asuransi, freight, nilai_kurs, fob, cif, cif_rp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE kd_incoterm = VALUES(kd_incoterm), nilai_incoterm = VALUES(nilai_incoterm), biaya_tambahan = VALUES(biaya_tambahan), biaya_pengurang = VALUES(biaya_pengurang), tarif_vd = VALUES(tarif_vd), nilai_asuransi = VALUES(nilai_asuransi), freight = VALUES(freight), nilai_kurs = VALUES(nilai_kurs), fob = VALUES(fob), cif = VALUES(cif), cif_rp = VALUES(cif_rp)`,
      [utama.id_aju, pungutan.kd_incoterm, pungutan.nilai_incoterm, pungutan.biaya_tambahan, pungutan.biaya_pengurang, pungutan.tarif_vd, pungutan.nilai_asuransi, pungutan.freight, pungutan.nilai_kurs, fob, cif, cifRp]
    );

    await connection.commit();
    connection.release();
    res.status(200).json({ message: "Data processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Jalankan server
app.listen(4000, () => console.log("Server is running on port 4000"));
