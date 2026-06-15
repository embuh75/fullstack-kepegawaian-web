const { validationResult } = require("express-validator");
const pegawaiService = require("../services/pegawaiService");
const response = require("../utils/response");

const getMapel = async (req, res, next) => {
  try {
    const result = await pegawaiService.getMapel();
    return response.success(res, result, "Data mata pelajaran");
  } catch (err) {
    next(err);
  }
};

const getJabatan = async (req, res, next) => {
  try {
    const result = await pegawaiService.getJabatan();
    return response.success(res, result, "Data Jabatan");
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      departemenId,
      jabatanId,
      statusKerja,
    } = req.query;
    const result = await pegawaiService.getAll({
      page: Number(page),
      limit: Number(limit),
      search,
      departemenId,
      jabatanId,
      statusKerja,
    });
    return response.paginated(
      res,
      result.data,
      result.pagination,
      "Data pegawai",
    );
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    return response.success(
      res,
      await pegawaiService.getById(req.params.id),
      "Detail pegawai",
    );
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    return response.created(
      res,
      await pegawaiService.create(req, res),
      "Pegawai berhasil ditambahkan",
    );
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return response.validationError(res, errors.array());
    }

    return response.success(
      res,
      await pegawaiService.update(req, res),
      "Data pegawai diperbarui",
    );
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await pegawaiService.remove(req.params.id);
    return response.success(res, null, "Data pegawai dihapus");
  } catch (err) {
    next(err);
  }
};

module.exports = { getMapel, getJabatan, getAll, getById, create, update, remove };
