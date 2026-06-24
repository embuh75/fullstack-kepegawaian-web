const router = require("express").Router();
const { body } = require("express-validator");

// Middleware & Controller
const { changePwBodyValidator, loginBodyValidator } = require("../utils/validator/bodyValidator");
const { authenticate } = require("../middlewares/authMiddleware");
const control = require("../controllers/authController");

router.post("/login", loginBodyValidator, control.login);
router.post("/refresh", control.refreshToken);
router.post("/logout", authenticate, control.logout);
router.get("/me", authenticate, control.me);
router.put("/change-password", authenticate, changePwBodyValidator, control.changePassword);

module.exports = router;
