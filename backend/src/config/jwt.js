module.exports = {
  secret: process.env.JWT_SECRET || "default_secret_GANTI_DI_PRODUCTION",
  expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || "default_refresh_GANTI_DI_PRODUCTION",
  refreshExpires: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};
