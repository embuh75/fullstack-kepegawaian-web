const pegawaiServices = require("../services/pegawaiService");
const { validationResult } = require("express-validator");
const response = require("../utils/response");

const getMapel = async (req, res, next) => {
  try {
    const result = await pegawaiServices.getMapel();
    return response.success(res, result, "Data mata pelajaran");
  } catch (err) {
    next(err);
  }
};

const getJabatan = async (req, res, next) => {
  try {
    const result = await pegawaiServices.getJabatan();
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
    } = req.query;

    const result = await pegawaiServices.getAll({
      page: Number(page),
      limit: Number(limit),
      search,
    });

    const resp = response.paginated(res, result.data, result.pagination, "Data pegawai");

    return resp;
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await pegawaiServices.getById(id);
    const resp = response.success(res, result, "Detail pegawai");

    return resp;
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
    
    const result = await pegawaiServices.create(req, res);
    const resp = response.created(res, result, "Pegawai berhasil ditambahkan");

    return resp;
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

    const result = await pegawaiServices.update(req, res);
    const resp = response.success(res, result, "Data pegawai diperbarui");

    return resp;
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    await pegawaiServices.remove(id);
    
    const resp = response.success(res, null, "Data pegawai berhasil dihapus", 204);
    
    return resp;
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMapel,
  getJabatan,
  getAll,
  getById,
  create,
  update,
  remove,
};
