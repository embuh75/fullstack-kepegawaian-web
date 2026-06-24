const response = {
  success(res, data = null, message = "Berhasil", statusCode = 200) {
    return res
      .status(statusCode)
      .json({ success: true, message, count: data.length, data });
  },
  created(res, data = null, message = "Data berhasil dibuat") {
    return res.status(201).json({ success: true, message, data });
  },
  paginated(res, data, pagination, message = "Berhasil") {
    return res.status(200).json({ success: true, message, data, pagination });
  },
  error(res, message = "Terjadi kesalahan", statusCode = 500, errors = null) {
    const body = { success: false, message };
    if (errors) body.errors = errors;
    return res.status(statusCode).json(body);
  },
  notFound(res, message = "Data tidak ditemukan") {
    return res.status(404).json({ success: false, message });
  },
  unauthorized(res, message = "Akses tidak diizinkan") {
    return res.status(401).json({ success: false, message });
  },
  forbidden(res, message = "Anda tidak memiliki hak akses") {
    return res.status(403).json({ success: false, message });
  },
  validationError(res, errors) {
    return res
      .status(422)
      .json({ success: false, message: "Validasi gagal", errors });
  },
};
module.exports = response;
