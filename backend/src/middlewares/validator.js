const prisma = require("../config/database");
const { body } = require("express-validator");

const loginBodyValidator = [
  body("username").notEmpty().withMessage("Username wajib diisi"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
];

const changePwBodyValidator = [
  body("passwordLama").notEmpty().withMessage("Password lama wajib diisi"),
  body("passwordBaru")
    .isLength({ min: 8 })
    .withMessage("Minimal 8 karakter")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Harus ada huruf besar, kecil, dan angka"),
];

const createBodyValidator = [
  body("nama").notEmpty().withMessage("Nama wajib diisi"),
  body("noKTP")
    .notEmpty()
    .withMessage("Nomor KTP wajib diisi")
    .isLength({ min: 16, max: 16 })
    .withMessage("Nomor KTP harus 16 digit"),
  body("noNBM")
    .optional()
    .customSanitizer((val) => (val ? val : null))
    .isLength({ max: 20 })
    .withMessage("Nomor NBM maksimal 20 karakter"),
  body("foto")
    .optional()
    .customSanitizer((val) => (val ? val : null)),
  body("tempatLahir").notEmpty().withMessage("Tempat lahir wajib diisi"),
  body("tanggalLahir")
    .isISO8601()
    .withMessage("Format tanggal lahir tidak valid (YYYY-MM-DD)")
    .customSanitizer((val) => new Date(val)),
  body("jenisKelamin")
    .notEmpty()
    .isIn(["L", "P"])
    .withMessage("Jenis kelamin harus L atau P"),
  body("status")
    .notEmpty()
    .isIn(["Belum_Menikah", "Menikah"])
    .withMessage("Isi dengan [Belum_Menikah / Menikah]"),
  body("alamatRumah").notEmpty().withMessage("Alamat rumah wajib diisi"),
  body("nomorTelephone").optional(),
  body("alamatEmail").optional(),
  body("pendidikanTerakhir")
    .optional()
    .customSanitizer((val) => (val ? val : null)),
  body("namaKampus").optional(),
  body("jurusan").optional(),
  body("tahunLulus")
    .optional()
    .customSanitizer((val) => (val ? Number(val) : null))
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Tahun lulus tidak valid"),
  body("jabatanId")
    .customSanitizer((val) => Number(val))
    .isInt({ min: 1 })
    .withMessage("Jabatan wajib dipilih"),
  body("mataPelajaranId")
    .customSanitizer((val) => Number(val))
    .isInt({ min: 1 })
    .withMessage("Mapel wajib dipilih"),
  body("nomorBpjs")
    .optional()
    .customSanitizer((val) => (val ? val : null)),
  body("kontakDarurat")
    .optional()
    .customSanitizer((val) => (val ? val : null)),
];

const updateBodyValidator = [
  body("nama")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {nama} tidak valid"),
  body("noKTP")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .isNumeric({ no_symbols: true })
    .withMessage("Format {noKTP} tidak valid (NUMBER)")
    .isLength({ min: 16, max: 16 })
    .withMessage("Format {noKTP} tidak valid [min: 16, max: 16]"),
  body("noNBM")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {noNBM} tidak valid (!NULL)")
    .isNumeric({ no_symbols: true })
    .withMessage("Format {noNBM} tidak valid (NUMBER)")
    .isLength({ max: 20 })
    .withMessage("Format {noNBM} tidak valid [max: 20]"),
  body("foto")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {foto} tidak valid"),
  body("tempatLahir")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {tempatLahir} tidak valid"),
  body("tanggalLahir")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {tanggalLahir} tidak valid")
    .isISO8601({ strict: true })
    .toDate()
    .withMessage("Format {tanggalLahir} tidak valid (YYYY-MM-DD)"),
  body("jenisKelamin")
    .optional()
    .isIn(["L", "P"])
    .withMessage("Format {jenisKelamin} tidak valid (L/P)"),
  body("status")
    .optional()
    .isIn(["Belum_Menikah", "Menikah"])
    .withMessage("Format {status} tidak valid (BELUM_MENIKAH/MENIKAH)"),
  body("alamatRumah")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {alamatRumah} tidak valid (!NULL)"),
  body("nomorTelephone")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {nomorTelephone} tidak valid (!NULL)")
    .isNumeric({ no_symbols: true })
    .withMessage("Format {nomorTelephone} tidak valid (NUMBER)"),
  body("alamatEmail")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {alamatEmail} tidak valid (!NULL)")
    .isEmail()
    .withMessage("Format {alamatEmail} tidak valid (EMAIL)"),
  body("pendidikanTerakhir")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {pendidikanTerakhir} tidak valid (!NULL)")
    .isIn(["SMA", "SMK", "S1", "S2", "S3", "D3"])
    .withMessage(
      "Format {pendidikanTerakhir} tidak valid (SMA/SMK/S1/S2/S3/D3)",
    ),
  body("namaKampus")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {namaKampus} tidak valid (!NULL)"),
  body("jurusan")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {jurusan} tidak valid (!NULL)"),
  body("tahunLulus")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {jurusan} tidak valid (!NULL)")
    .isInt({
      allow_leading_zeroes: false,
      min: 1900,
      max: new Date().getFullYear(),
    })
    .toInt()
    .withMessage(
      `Format {tahunLulus} tidak valid [min: 1900, max: ${new Date().getFullYear()}]`,
    ),
  body("jabatanId")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {jabatanId} tidak valid (!NULL)")
    .isInt({ min: 1, allow_leading_zeroes: false })
    .toInt()
    .withMessage("Format {jabatanId} tidak valid [min: 1]"),
  body("mataPelajaranId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Format {mataPelajaranId} tidak valid")
    .isInt({ min: 1, allow_leading_zeroes: false })
    .toInt()
    .withMessage("Format {mataPelajaranId} tidak valid [min: 1]"),
  body("nomorBpjs")
    .optional()
    .isNumeric({ no_symbols: true })
    .withMessage("Format {nomorBpjs} tidak valid (NUMBER)"),
  body("kontakDarurat")
    .optional()
    .isNumeric({ no_symbols: true })
    .withMessage("Format {kontakDarurat} tidak valid (NUMBER)"),
];

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
  loginBodyValidator,
  changePwBodyValidator,
  createBodyValidator,
  updateBodyValidator,
  createValidator,
  updateValidator,
};
