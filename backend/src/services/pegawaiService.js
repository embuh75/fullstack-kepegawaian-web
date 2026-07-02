// src/services/pegawaiService.js
require("dotenv").config();
const path = require("path");
const prisma = require("../config/database");
const {
  createValidator,
  updateValidator,
} = require("../utils/validator/serviceValidator");
const { getFile, uploadFile, deleteFile } = require("../config/bucket");
const response = require("../utils/response");

const select = {
  id: true,
  nama: true,
  foto: true,
  noKTP: true,
  noNBM: true,
  tempatLahir: true,
  tanggalLahir: true,
  jenisKelamin: true,
  status: true,
  alamatRumah: true,
  nomorTelephone: true,
  alamatEmail: true,
  pendidikanTerakhir: true,
  namaKampus: true,
  jurusan: true,
  tahunLulus: true,
  jabatan: { select: { id: true, nama: true, kode: true } },
  mataPelajaran: {
    select: { id: true, nama: true, kode: true },
  },
  nomorBpjs: true,
  kontakDarurat: true,
  user: { select: { id: true, username: true } },
  createdAt: true,
  updatedAt: true,
};

const getMapel = async () => {
  return await prisma.mataPelajaran.findMany({ orderBy: { id: "asc" } });
};

const getJabatan = async () => {
  return await prisma.jabatan.findMany({ orderBy: { id: "asc" } });
};

const getAll = async ({ page = 1, limit = 10, search }) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.OR = [
      { nama: { contains: search } },
      { noKTP: { contains: search } },
      { noNBM: { contains: search } },
      { alamatEmail: { contains: search } },
    ];
  }

  const [data, total] = await prisma.$transaction([
    prisma.pegawai.findMany({
      where,
      select,
      skip,
      take: limit,
      orderBy: { id: "asc" },
    }),
    prisma.pegawai.count({ where }),
  ]);

  for (const result of data) {
    if (result.foto) {
      result.foto = await getFile(result.foto);
    }
  }

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getById = async (id) => {
  const pegawai = await prisma.pegawai.findUnique({
    where: { id: Number(id) },
    select,
  });

  if (!pegawai)
    throw { statusCode: 404, message: "Data pegawai tidak ditemukan" };

  if (pegawai.foto) {
    pegawai.foto = await getFile(pegawai.foto);
  }

  return pegawai;
};

const create = async (req, res) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileExt = path.extname(req.file.originalname);
  const fileName = `IMG_${uniqueSuffix}${fileExt}`;

  const data = { foto: fileName, ...req.body };

  await createValidator(data);

  const response = await prisma.pegawai.create({
    data,
    select,
  });

  await uploadFile(fileName, req);

  return response
};

const update = async (req, res) => {
  const oldData = await prisma.pegawai.findUnique({where: { id: Number(req.params.id) }, select: { foto: true }});

  if(!oldData) {
    throw { statusCode: 404, message: "Data pegawai tidak ditemukan" };
  }

  const oldFoto = oldData.foto;

  const data = { foto: oldFoto, ...req.body };

  const selectFields = Object.keys(data).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

  await updateValidator(Number(req.params.id), data);

  const response = await prisma.pegawai.update({
    where: { id: Number(req.params.id) },
    data,
    select: selectFields,
  });

  await uploadFile(oldFoto, req);

  return response;
};

const remove = async (id) => {
  
  const oldData = await prisma.pegawai.findUnique({where: {id: Number(id)}, select: {foto: true}});

  if(!oldData) {
    throw { statusCode: 404, message: "Data pegawai tidak ditemukan" };
  }

  const oldFoto = oldData.foto;

  await prisma.pegawai.delete({ where: { id: Number(id) }, select: {id: true, nama: true, noKTP: true} });
  
  await deleteFile(oldFoto);
};

module.exports = {
  getAll,
  getById,
  getMapel,
  getJabatan,
  create,
  update,
  remove,
};
