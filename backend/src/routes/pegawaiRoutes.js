// src/routes/pegawaiRoutes.js
const router = require("express").Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { hasPermission } = require("../middlewares/rbacMiddleware");
const multer = require("../middlewares/mutler");
const { createBodyValidator, updateBodyValidator } = require("../utils/validator/bodyValidator");
const control = require("../controllers/pegawaiController");

router.get("/", authenticate, hasPermission("pegawai:read"), control.getAll);
router.get("/mapel", authenticate, hasPermission("pegawai:read"), control.getMapel);  
router.get("/jabatan",authenticate, hasPermission("pegawai:read"), control.getJabatan);
router.get("/:id", authenticate, hasPermission("pegawai:read"), control.getById);
router.post("/", authenticate, hasPermission("pegawai:create"), multer.single("foto"), createBodyValidator, control.create);
router.put("/:id", authenticate, hasPermission("pegawai:update"), multer.single("foto"), updateBodyValidator, control.update);
router.delete("/:id", authenticate, hasPermission("pegawai:delete"), control.remove);

module.exports = router;
