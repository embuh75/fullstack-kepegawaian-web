// src/middlewares/errorHandler.js
const logger   = require("../utils/logger");
const response = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.path} - ${err.message}`);

  if (err.code === "P2002") {
    // ✅ Fix #7: target bisa string atau array tergantung versi Prisma
    const field = Array.isArray(err.meta?.target)
      ? err.meta.target.join(", ")
      : err.meta?.target || "field";
    return response.error(res, `Data duplikat pada: ${field}`, 409);
  }
  if (err.code === "P2025") return response.notFound(res, "Data tidak ditemukan");
  if (err.code === "P2003") return response.error(res, "Data referensi tidak ditemukan", 400);

  return response.error(res, err.message || "Internal Server Error", err.statusCode || 500);
};

const notFoundHandler = (req, res) => {
  return response.notFound(res, `Route ${req.method} ${req.path} tidak ditemukan`);
};

module.exports = { errorHandler, notFoundHandler };