<<<<<<< HEAD
// src/middlewares/errorHandler.js
const logger   = require("../utils/logger");
=======
const logger = require("../utils/logger");
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
const response = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.path} - ${err.message}`);
<<<<<<< HEAD

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
=======
  if (err.code === "P2002")
    return response.error(
      res,
      `Data duplikat pada: ${err.meta?.target?.join(", ")}`,
      409,
    );
  if (err.code === "P2025")
    return response.notFound(res, "Data tidak ditemukan");
  if (err.code === "P2003")
    return response.error(res, "Data referensi tidak ditemukan", 400);
  return response.error(
    res,
    err.message || "Internal Server Error",
    err.statusCode || 500,
  );
};

const notFoundHandler = (req, res) => {
  return response.notFound(
    res,
    `Route ${req.method} ${req.path} tidak ditemukan`,
  );
};

module.exports = { errorHandler, notFoundHandler };
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
