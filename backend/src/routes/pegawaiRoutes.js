// src/routes/pegawaiRoutes.js
const router = require("express").Router();

<<<<<<< HEAD
const { authenticate }    = require("../middlewares/authMiddleware");
const { hasPermission }   = require("../middlewares/rbacMiddleware");
const uploadFoto          = require("../services/uploadService");
const { createBodyValidator, updateBodyValidator } = require("../utils/validator/bodyValidator");
const control             = require("../controllers/pegawaiController");

router.get("/",         authenticate, hasPermission("pegawai:read"),   control.getAll);
router.get("/mapel",    authenticate, hasPermission("pegawai:read"),   control.getMapel);   // ✅ Fix #1: ganti pegawai:delete → pegawai:read
router.get("/jabatan",  authenticate, hasPermission("pegawai:read"),   control.getJabatan);
router.get("/:id",      authenticate, hasPermission("pegawai:read"),   control.getById);
router.post("/",        authenticate, hasPermission("pegawai:create"), uploadFoto.single("foto"), createBodyValidator, control.create);
router.put("/:id",      authenticate, hasPermission("pegawai:update"), uploadFoto.single("foto"), updateBodyValidator, control.update);
router.delete("/:id",   authenticate, hasPermission("pegawai:delete"), control.remove);

module.exports = router;
=======
// Middleware & Controller
const { authenticate } = require("../middlewares/authMiddleware");
const { hasPermission } = require("../middlewares/rbacMiddleware");
const uploadFoto = require("../services/uploadService");
const {createBodyValidator, updateBodyValidator} = require("../utils/validator/bodyValidator");
const control = require("../controllers/pegawaiController");

router.get("/", authenticate, hasPermission("pegawai:read"), control.getAll);
router.get("/mapel", authenticate, hasPermission("pegawai:delete"), control.getMapel);
router.get("/jabatan", authenticate, hasPermission("pegawai:read"), control.getJabatan);
router.get("/:id", authenticate, hasPermission("pegawai:read"), control.getById);
router.post("/", authenticate, hasPermission("pegawai:create"), uploadFoto.single("foto"), createBodyValidator,  control.create);
router.put("/:id", authenticate, hasPermission("pegawai:update"), uploadFoto.single("foto"), updateBodyValidator,  control.update );
router.delete("/:id", authenticate, hasPermission("pegawai:delete"), control.remove);

module.exports = router;
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
