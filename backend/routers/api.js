const express = require("express");
const { saveOrUpdateDataPungutan } = require("../controllers/dataPungutanController");

const router = express.Router();

router.post("/dataPungutan", saveOrUpdateDataPungutan);

module.exports = router;
