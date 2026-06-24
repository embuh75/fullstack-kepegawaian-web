const { validationResult } = require("express-validator");

const authService = require("../services/authService");
const response = require("../utils/response");
const logger = require("../utils/logger");

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return response.validationError(res, errors.array());
    const result = await authService.login(req.body);
    logger.info(`Login: ${result.user.username}`);
    return response.success(res, result, "Login berhasil");
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return response.error(res, "Refresh token diperlukan", 400);
    const result = await authService.refresh(refreshToken);
    return response.success(res, result, "Token diperbarui");
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await authService.logout(refreshToken);
    return response.success(res, null, "Logout berhasil");
  } catch (err) {
    next(err);
  }
};

const me = (req, res) =>
  response.success(
    res,
    {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role.nama,
      permissions: req.user.permissions,
    },
    "Profil user",
  );

const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return response.validationError(res, errors.array());
    await authService.changePassword(req.user.id, req.body);
    return response.success(res, null, "Password berhasil diubah");
  } catch (err) {
    next(err);
  }
};

module.exports = { login, refreshToken, logout, me, changePassword };
