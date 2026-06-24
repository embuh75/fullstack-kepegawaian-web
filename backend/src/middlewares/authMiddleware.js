const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const prisma = require("../config/database");
const response = require("../utils/response");
const logger = require("../utils/logger");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.unauthorized(res, "Token autentikasi tidak ditemukan");
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, jwtConfig.secret);
    } 
    catch (err) {
      if (err.name === "TokenExpiredError") {
        return response.unauthorized(res, "Token telah kedaluwarsa");
      }

      return response.unauthorized(res, "Token tidak valid");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        isAktif: true,
        role: {
          select: {
            id: true,
            nama: true,
            permissions: { select: { permission: { select: { nama: true } } } },
          },
        },
      },
    });

    if (!user) return response.unauthorized(res, "User tidak ditemukan");

    if (!user.isAktif) return response.unauthorized(res, "Akun tidak aktif");

    req.user = {
      ...user,
      permissions: user.role.permissions.map((rp) => rp.permission.nama),
    };

    next();
  } 
  catch (err) {
    logger.error("Auth middleware error:", err);
    return response.error(res, "Kesalahan autentikasi");
  }
};
module.exports = { authenticate };
