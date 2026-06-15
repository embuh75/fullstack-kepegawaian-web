const prisma = require("../../config/database");

const createValidator = async (data) => {
  try {
    // Cek duplikat KTP
    if (data.noKTP) {
      const duplicate = await prisma.pegawai.findUnique({
        where: { noKTP: data.noKTP },
      });

      if (duplicate)
        throw {
          statusCode: 409,
          message: `Nomor KTP: ${data.noKTP} sudah terdaftar`,
        };
    }

    // Cek duplikat NBM
    if (data.noNBM) {
      const duplicate = await prisma.pegawai.findUnique({
        where: { noNBM: data.noNBM },
      });

      if (duplicate)
        throw {
          statusCode: 409,
          message: `Nomor NBM: ${data.noNBM} sudah terdaftar`,
        };
    }

    // cek duplikasi email
    if (data.alamatEmail) {
      const duplicate = await prisma.pegawai.findUnique({
        where: { alamatEmail: data.alamatEmail },
      });

      if (duplicate) {
        throw {
          statusCode: 409,
          message: `Email: ${data.alamatEmail} sudah terdaftar`,
        };
      }
    }

    // cek duplikasi BPJS
    if (data.nomorBpjs) {
      const duplicate = await prisma.pegawai.findUnique({
        where: { nomorBpjs: data.nomorBpjs },
      });

      if (duplicate) {
        throw {
          statusCode: 409,
          message: `Nomor BPJS: ${data.nomorBpjs} sudah terdaftar`,
        };
      }
    }
  } catch (error) {
    throw error;
  }
};

const updateValidator = async (id, data) => {
  try {
    // Cek duplikat KTP di pegawai lain
    if (data.noKTP) {
      const dup = await prisma.pegawai.findFirst({
        where: { noKTP: data.noKTP, NOT: { id: Number(id) } },
      });
      if (dup)
        throw {
          statusCode: 409,
          message: `Nomor KTP ${data.noKTP} sudah digunakan`,
        };
    }

    // Cek duplikat NBM di pegawai lain
    if (data.noNBM) {
      const dup = await prisma.pegawai.findFirst({
        where: { noNBM: data.noNBM, NOT: { id: Number(id) } },
      });
      if (dup)
        throw {
          statusCode: 409,
          message: `Nomor NBM ${data.noNBM} sudah digunakan`,
        };
    }

    // Cek duplikat email di pegawai lain
    if (data.alamatEmail) {
      const dup = await prisma.pegawai.findFirst({
        where: { alamatEmail: data.alamatEmail, NOT: { id: Number(id) } },
      });
      if (dup)
        throw {
          statusCode: 409,
          message: `Email ${data.alamatEmail} sudah digunakan`,
        };
    }

    // Cek duplikat nomor bpjs di pegawai lain
    if (data.nomorBpjs) {
      const dup = await prisma.pegawai.findFirst({
        where: { nomorBpjs: data.nomorBpjs, NOT: { id: Number(id) } },
      });
      if (dup)
        throw {
          statusCode: 409,
          message: `Nomor Bpjs ${data.nomorBpjs} sudah digunakan`,
        };
    }

    // Konversi tanggal
    if (data.tanggalLahir) data.tanggalLahir = new Date(data.tanggalLahir);
    if (data.tahunLulus) data.tahunLulus = Number(data.tahunLulus);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createValidator,
  updateValidator,
};
