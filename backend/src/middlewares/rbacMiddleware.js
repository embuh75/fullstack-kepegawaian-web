const response = require("../utils/response");

const hasPermission = (...required) => (req, res, next) => {
    if (!req.user) return response.unauthorized(res);

    const allowed = required.some((p) =>
      (req.user.permissions || []).includes(p),
    );

    if (!allowed) {
      return response.forbidden(res,`Diperlukan permission: ${required.join(" atau ")}`);
    }

    next();
  };

const hasAllPermissions = (...required) => (req, res, next) => {
    if (!req.user) return response.unauthorized(res);

    const allowed = required.every((p) =>
      (req.user.permissions || []).includes(p),
    );

    if (!allowed) {
      return response.forbidden(res, "Tidak semua permission terpenuhi");
    }

    next();
  };

const hasRole = (...roles) => (req, res, next) => {
    if (!req.user) return response.unauthorized(res);

    if (!roles.includes(req.user.role?.nama)) {
      return response.forbidden(res, `Dibutuhkan role: ${roles.join(" atau ")}`);
    }

    next();
  };

module.exports = { hasPermission, hasAllPermissions, hasRole };
