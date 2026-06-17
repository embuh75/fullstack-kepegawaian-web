const router = require("express").Router();
const auth = require("./authRoutes");
const pegawai = require("./pegawaiRoutes");

router.use("/auth", auth);
router.use("/pegawai", pegawai);
router.get("/status", (req, res) =>
  res.json({ status: "OK", service: "Kepegawaian API", time: new Date() }),
);

module.exports = router;
