require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");
const logger = require("./utils/logger");

// Main
const app = express();
const PORT = process.env.PORT || 3000;

// MIddleware
app.use(helmet());
app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(
  "/api/",
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    message: { success: false, message: "Terlalu banyak permintaan" },
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Routes & Handler
app.use(
  "/api/v1/img",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static("public/uploads/"),
);
app.use("/api/v1", routes);
app.use(notFoundHandler);
app.use(errorHandler);

// Port
app.listen(PORT, () => {
  logger.info(`Server: http://localhost:${PORT}/api/v1`);
  logger.info(`Env   : ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
