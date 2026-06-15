// src/services/pegawaiService.js
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
  mataPelajaran: { select: { id: true, nama: true, kode: true } },
  nomorBpjs: true,
  kontakDarurat: true,
  user: { select: { id: true, username: true } },
  createdAt: true,
  updatedAt: true,
};

const getMapel = async () => {
  const result = await prisma.mataPelajaran.findMany();

  return result;
};

const getJabatan = async () => {
  const result = await prisma.jabatan.findMany();

  return result;
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

  if (jabatanId) where.jabatanId = Number(jabatanId);

  const [data, total] = await prisma.$transaction([
    prisma.pegawai.findMany({
      where,
      select,
      skip,
      take: limit,
      orderBy: { nama: "asc" },
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

  if (!pegawai)
    throw { statusCode: 404, message: "Data pegawai tidak ditemukan" };
  return pegawai;
};

const create = async (req, res) => {
  const data = req.body;
  const filePath = req.file ? req.file.path : null;

  await createValidator(data);

  // Pisahkan mataPelajaran dari data utama
  const { mataPelajaranIds, ...pegawaiData } = data;

  return prisma.pegawai.create({
    data: {
      ...pegawaiData,
      ...(mataPelajaranIds?.length && {
        mataPelajaran: {
          create: mataPelajaranIds.map((id) => ({ mataPelajaranId: id })),
        },
      }),
    },
    select,
  });
};

const update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  /* await getById(id);

  await updateValidator(id, data); */

  res.json(data);

  /* // Pisahkan mataPelajaran
  const { mataPelajaranIds, ...pegawaiData } = data;

  return prisma.pegawai.update({
    where: { id: Number(id) },
    data: {
      ...pegawaiData,
      ...(mataPelajaranIds && {
        mataPelajaran: {
          deleteMany: {},
          create: mataPelajaranIds.map((mid) => ({ mataPelajaranId: mid })),
        },
      }),
    },
    select,
  }); */
};

const remove = async (id) => {
  await getById(id);
  await prisma.pegawai.delete({ where: { id: Number(id) } });
};

module.exports = { getMapel, getJabatan, getAll, getById, create, update, remove };
