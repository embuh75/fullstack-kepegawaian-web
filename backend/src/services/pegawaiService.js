// src/services/pegawaiService.js
require("dotenv").config();
const prisma = require("../config/database");
const {
  createValidator,
  updateValidator,
} = require("../utils/validator/serviceValidator");

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
<<<<<<< HEAD
  mataPelajaran: {
    select: { id: true, nama: true, kode: true },
  },
=======
  mataPelajaran: { select: { id: true, nama: true, kode: true } },
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
  nomorBpjs: true,
  kontakDarurat: true,
  user: { select: { id: true, username: true } },
  createdAt: true,
  updatedAt: true,
};

const getMapel = async () => {
<<<<<<< HEAD
  return prisma.mataPelajaran.findMany({ orderBy: { nama: "asc" } });
};

const getJabatan = async () => {
  return prisma.jabatan.findMany({ orderBy: { nama: "asc" } });
=======
  const result = await prisma.mataPelajaran.findMany();

  return result;
};

const getJabatan = async () => {
  const result = await prisma.jabatan.findMany();

  return result;
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
};

const getAll = async ({ page = 1, limit = 10, search, jabatanId }) => {
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
<<<<<<< HEAD
=======

>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
  if (jabatanId) where.jabatanId = Number(jabatanId);

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
<<<<<<< HEAD
=======

>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
  if (!pegawai)
    throw { statusCode: 404, message: "Data pegawai tidak ditemukan" };
  return pegawai;
};

<<<<<<< HEAD
// ✅ Fix #4: konversi mataPelajaranId jadi array of number
const parseMataPelajaran = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(Number);
  return String(raw)
    .split(",")
    .map((x) => Number(x.trim()))
    .filter(Boolean);
};

const create = async (req, res) => {
  const baseUrl = process.env.APP_URL;
  const fotoUrl = req.file
    ? `${baseUrl}/api/v1/img/${req.file.filename}`
    : null;

  const data = { ...(fotoUrl && { foto: fotoUrl }), ...req.body };

  await createValidator(data);

  // ✅ Fix #4: key mataPelajaranId (bukan mataPelajaranIds)
  const mataPelajaranId = parseMataPelajaran(data.mataPelajaranId);
  const { mataPelajaranId: _, ...pegawaiData } = data;
=======
const create = async (req, res) => {
  //file foto
  const baseUrl = process.env.APP_URL;
  const fotoUrl = `${baseUrl}/api/v1/img/${req.file?.filename}`;

  //body
  /* req.body.jabatanId = Number(req.body.jabatanId);
  req.body.mataPelajaranId = Number(req.body.mataPelajaranId); */
  const data = { foto: req.file ? fotoUrl : null, ...req.body };

  await createValidator(data);

  // Pisahkan mataPelajaran dari data utama
  const { mataPelajaranIds, ...pegawaiData } = data;
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3

  return prisma.pegawai.create({
    data: {
      ...pegawaiData,
<<<<<<< HEAD
      ...(mataPelajaranId.length && {
        mataPelajaran: {
          create: mataPelajaranId.map((id) => ({ mataPelajaranId: id })),
=======
      ...(mataPelajaranIds?.length && {
        mataPelajaran: {
          create: mataPelajaranIds.map((id) => ({ mataPelajaranId: id })),
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
        },
      }),
    },
    select,
  });
};

const update = async (req, res) => {
<<<<<<< HEAD
  const baseUrl = process.env.APP_URL;
  const id = req.params.id;

  // ✅ Fix #3: kalau tidak ada file baru, JANGAN timpa foto lama (pakai undefined)
  const fotoUrl = req.file
    ? `${baseUrl}/api/v1/img/${req.file.filename}`
    : undefined;

  // ✅ Fix #4: jangan konversi mataPelajaranId ke Number (biarkan array)
  const data = { ...(fotoUrl !== undefined && { foto: fotoUrl }), ...req.body };

  await getById(id);
  await updateValidator(id, data);

  // ✅ Fix #4: parse mataPelajaranId jadi array of number
  const mataPelajaranId = parseMataPelajaran(data.mataPelajaranId);
  const { mataPelajaranId: _, ...pegawaiData } = data;
=======
  //file foto
  const baseUrl = process.env.APP_URL;
  const fotoUrl = `${baseUrl}/api/v1/img/${req.file?.filename}`;

  //body
  const id = req.params.id;
  req.body.jabatanId = Number(req.body.jabatanId);
  req.body.mataPelajaranId = Number(req.body.mataPelajaranId);
  const data = { foto: req.file ? fotoUrl : null, ...req.body };

  await getById(id);

  await updateValidator(id, data);

  // Pisahkan mataPelajaran
  const { mataPelajaranIds, ...pegawaiData } = data;
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3

  return prisma.pegawai.update({
    where: { id: Number(id) },
    data: {
      ...pegawaiData,
<<<<<<< HEAD
      ...(mataPelajaranId.length && {
        mataPelajaran: {
          deleteMany: {},
          create: mataPelajaranId.map((mid) => ({ mataPelajaranId: mid })),
=======
      ...(mataPelajaranIds && {
        mataPelajaran: {
          deleteMany: {},
          create: mataPelajaranIds.map((mid) => ({ mataPelajaranId: mid })),
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
        },
      }),
    },
    select,
  });
};

const remove = async (id) => {
  await getById(id);
  await prisma.pegawai.delete({ where: { id: Number(id) } });
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
