// src/utils/validator/serviceValidator.js
const prisma = require("../../config/database");

// ✅ Fix #8: pakai new Error() agar tidak UnhandledPromiseRejection di Node v24
const throwError = (statusCode, message) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};

const createValidator = async (data) => {
  // Cek duplikat KTP
  if (data.noKTP) {
    const dup = await prisma.pegawai.findUnique({
      where: { noKTP: data.noKTP },
    });
    if (dup) throwError(409, `Nomor KTP: ${data.noKTP} sudah terdaftar`);
  }
  // Cek duplikat NBM
  if (data.noNBM) {
    const dup = await prisma.pegawai.findUnique({
      where: { noNBM: data.noNBM },
    });
    if (dup) throwError(409, `Nomor NBM: ${data.noNBM} sudah terdaftar`);
  }
  // Cek duplikat email
  if (data.alamatEmail) {
    const dup = await prisma.pegawai.findUnique({
      where: { alamatEmail: data.alamatEmail },
    });
    if (dup) throwError(409, `Email: ${data.alamatEmail} sudah terdaftar`);
  }
  // Cek duplikat BPJS
  if (data.nomorBpjs) {
    const dup = await prisma.pegawai.findUnique({
      where: { nomorBpjs: data.nomorBpjs },
    });
    if (dup) throwError(409, `Nomor BPJS: ${data.nomorBpjs} sudah terdaftar`);
  }
  // Konversi MapelId Ke Number
  data.mataPelajaranId = Number(data.mataPelajaranId);
  // Cek mapel id
  const mapelId = await prisma.mataPelajaran.findUnique({ where: { id: data.mataPelajaranId }, select: { id: true } });
  if(!mapelId) {
    throw { statusCode: 400, message: `Mata pelajaran dengan ID ${data.mataPelajaranId} tidak ditemukan di database!` };
  }
  //Cek jabatan id
  const jabatanId = await prisma.jabatan.findUnique({ where: { id: data.jabatanId }, select: { id: true } });
  if(!jabatanId) {
    throw { statusCode: 400, message: `Jabatan dengan ID ${data.jabatanId} tidak ditemukan di database!` };
  }
};

const updateValidator = async (id, data) => {
  if (data.noKTP) {
    const dup = await prisma.pegawai.findFirst({
      where: { noKTP: data.noKTP, NOT: { id: Number(id) } },
    });
    if (dup) throwError(409, `Nomor KTP ${data.noKTP} sudah digunakan`);
  }
  if (data.noNBM) {
    const dup = await prisma.pegawai.findFirst({
      where: { noNBM: data.noNBM, NOT: { id: Number(id) } },
    });
    if (dup) throwError(409, `Nomor NBM ${data.noNBM} sudah digunakan`);
  }
  if (data.alamatEmail) {
    const dup = await prisma.pegawai.findFirst({
      where: { alamatEmail: data.alamatEmail, NOT: { id: Number(id) } },
    });
    if (dup) throwError(409, `Email ${data.alamatEmail} sudah digunakan`);
  }
  if (data.nomorBpjs) {
    const dup = await prisma.pegawai.findFirst({
      where: { nomorBpjs: data.nomorBpjs, NOT: { id: Number(id) } },
    });
    if (dup) throwError(409, `Nomor BPJS ${data.nomorBpjs} sudah digunakan`);
  }
  // Konversi MapelId Ke Number
  data.mataPelajaranId = Number(data.mataPelajaranId);
  // Cek mapel id
  const mapelId = await prisma.mataPelajaran.findUnique({ where: { id: data.mataPelajaranId }, select: { id: true } });
  if(!mapelId) {
    throw { statusCode: 400, message: `Mata pelajaran dengan ID ${data.mataPelajaranId} tidak ditemukan di database!` };
  }
  //Cek jabatan id
  const jabatanId = await prisma.jabatan.findUnique({ where: { id: data.jabatanId }, select: { id: true } });
  if(!jabatanId) {
    throw { statusCode: 400, message: `Jabatan dengan ID ${data.jabatanId} tidak ditemukan di database!` };
  }
  // Konversi tanggal & tahunLulus
  if (data.tanggalLahir) data.tanggalLahir = new Date(data.tanggalLahir);
  if (data.tahunLulus) data.tahunLulus = Number(data.tahunLulus);
};

module.exports = { createValidator, updateValidator };
