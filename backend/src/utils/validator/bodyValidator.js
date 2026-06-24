<<<<<<< HEAD
// src/utils/validator/bodyValidator.js
=======
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
const { body } = require("express-validator");

const loginBodyValidator = [
  body("username").notEmpty().withMessage("Username wajib diisi"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
];

const changePwBodyValidator = [
  body("passwordLama").notEmpty().withMessage("Password lama wajib diisi"),
  body("passwordBaru")
<<<<<<< HEAD
    .isLength({ min: 8 }).withMessage("Minimal 8 karakter")
=======
    .isLength({ min: 8 })
    .withMessage("Minimal 8 karakter")
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Harus ada huruf besar, kecil, dan angka"),
];

const createBodyValidator = [
  body("nama")
<<<<<<< HEAD
    .notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {nama} tidak valid"),
  body("noKTP")
    .notEmpty({ ignore_whitespace: true }).trim()
    .isNumeric({ no_symbols: true }).withMessage("Format {noKTP} tidak valid (NUMBER)")
    .isLength({ min: 16, max: 16 }).withMessage("Format {noKTP} tidak valid [min: 16, max: 16]"),
  body("noNBM")
    .optional()
    .customSanitizer((val) => val === "" ? undefined : val)
    .isNumeric({ no_symbols: true }).withMessage("Format {noNBM} tidak valid (NUMBER)")
    .isLength({ max: 20 }).withMessage("Format {noNBM} tidak valid [max: 20]"),
  body("tempatLahir")
    .optional()
    .notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {tempatLahir} tidak valid"),
  body("tanggalLahir")
    .notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {tanggalLahir} tidak valid")
    .isISO8601({ strict: true }).toDate()
    .withMessage("Format {tanggalLahir} tidak valid (YYYY-MM-DD)"),
  body("jenisKelamin")
    .notEmpty()
    .isIn(["L", "P"]).withMessage("Format {jenisKelamin} tidak valid (L/P)"),
  body("status")
    .notEmpty()
    .isIn(["Belum_Menikah", "Menikah", "Duda"])
    .withMessage("Format {status} tidak valid"),
  body("alamatRumah")
    .notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {alamatRumah} tidak valid (!NULL)"),
  body("nomorTelephone")
    .notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {nomorTelephone} tidak valid (!NULL)")
    .isNumeric({ no_symbols: true }).withMessage("Format {nomorTelephone} tidak valid (NUMBER)"),
  body("alamatEmail")
    .optional()
    .customSanitizer((val) => val === "" ? undefined : val)
    .isEmail().withMessage("Format {alamatEmail} tidak valid (EMAIL)"),
  body("pendidikanTerakhir")
    .optional()
    .notEmpty().trim()
    .withMessage("Format {pendidikanTerakhir} tidak valid (!NULL)")
    .isIn(["SMA", "SMK", "S1", "S2", "S3", "D3", "D4", "D2", "D1", "-"])
    .withMessage("Format {pendidikanTerakhir} tidak valid"),
  body("namaKampus")
    .optional()
    .customSanitizer((val) => val === "" ? undefined : val),
  body("jurusan")
    .optional()
    .customSanitizer((val) => val === "" ? undefined : val),
  body("tahunLulus")
    .optional()
    .customSanitizer((val) => val === "" ? undefined : val)
    .isInt({ allow_leading_zeroes: false, min: 1900, max: new Date().getFullYear() })
    .toInt()
    .withMessage(`Format {tahunLulus} tidak valid [min: 1900, max: ${new Date().getFullYear()}]`),
  body("jabatanId")
    .notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {jabatanId} tidak valid (!NULL)")
    .customSanitizer((val) => Number(val))
    .isInt({ min: 1 }).withMessage("Format {jabatanId} tidak valid [min: 1]"),
  // ✅ Fix #5: mataPelajaranId optional saja, konversi di service
  body("mataPelajaranId").optional(),
  body("nomorBpjs")
    .optional()
    .customSanitizer((val) => val === "" ? undefined : val)
    .isNumeric({ no_symbols: true }).withMessage("Format {nomorBpjs} tidak valid (NUMBER)"),
  // ✅ Fix #6: kontakDarurat tidak pakai isNumeric (bisa berisi nama + nomor)
  body("kontakDarurat")
    .optional()
    .customSanitizer((val) => val === "" ? undefined : val),
];

const updateBodyValidator = [
  body("nama").optional().notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {nama} tidak valid"),
  body("noKTP").optional()
    .isNumeric({ no_symbols: true }).withMessage("Format {noKTP} tidak valid (NUMBER)")
    .isLength({ min: 16, max: 16 }).withMessage("Format {noKTP} tidak valid [min: 16, max: 16]"),
  body("noNBM").optional()
    .customSanitizer((val) => val === "" ? undefined : val)
    .isNumeric({ no_symbols: true }).withMessage("Format {noNBM} tidak valid (NUMBER)"),
  body("tempatLahir").optional()
    .notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {tempatLahir} tidak valid"),
  body("tanggalLahir").optional()
    .isISO8601({ strict: true }).toDate()
    .withMessage("Format {tanggalLahir} tidak valid (YYYY-MM-DD)"),
  body("jenisKelamin").optional()
    .isIn(["L", "P"]).withMessage("Format {jenisKelamin} tidak valid (L/P)"),
  body("status").optional()
    .isIn(["Belum_Menikah", "Menikah", "Duda"])
    .withMessage("Format {status} tidak valid"),
  body("alamatRumah").optional()
    .notEmpty({ ignore_whitespace: true }).trim()
    .withMessage("Format {alamatRumah} tidak valid (!NULL)"),
  body("nomorTelephone").optional()
    .isNumeric({ no_symbols: true }).withMessage("Format {nomorTelephone} tidak valid (NUMBER)"),
  body("alamatEmail").optional()
    .customSanitizer((val) => val === "" ? undefined : val)
    .isEmail().withMessage("Format {alamatEmail} tidak valid (EMAIL)"),
  body("pendidikanTerakhir").optional()
    .isIn(["SMA", "SMK", "S1", "S2", "S3", "D3", "D4", "D2", "D1", "-"])
    .withMessage("Format {pendidikanTerakhir} tidak valid"),
  body("namaKampus").optional()
    .customSanitizer((val) => val === "" ? undefined : val),
  body("jurusan").optional()
    .customSanitizer((val) => val === "" ? undefined : val),
  body("tahunLulus").optional()
    .customSanitizer((val) => val === "" ? undefined : val)
    .isInt({ allow_leading_zeroes: false, min: 1900, max: new Date().getFullYear() })
    .toInt()
    .withMessage(`Format {tahunLulus} tidak valid [min: 1900, max: ${new Date().getFullYear()}]`),
  body("jabatanId").optional()
    .customSanitizer((val) => Number(val))
    .isInt({ min: 1 }).withMessage("Format {jabatanId} tidak valid [min: 1]"),
  body("mataPelajaranId").optional(),
  body("nomorBpjs").optional()
    .customSanitizer((val) => val === "" ? undefined : val)
    .isNumeric({ no_symbols: true }).withMessage("Format {nomorBpjs} tidak valid (NUMBER)"),
  body("kontakDarurat").optional()
    .customSanitizer((val) => val === "" ? undefined : val),
=======
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {nama} tidak valid"),
  body("noKTP")
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
  body("tempatLahir")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {tempatLahir} tidak valid"),
  body("tanggalLahir")
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {tanggalLahir} tidak valid")
    .isISO8601({ strict: true })
    .toDate()
    .withMessage("Format {tanggalLahir} tidak valid (YYYY-MM-DD)"),
  body("jenisKelamin")
    .notEmpty()
    .isIn(["L", "P"])
    .withMessage("Format {jenisKelamin} tidak valid (L/P)"),
  body("status")
    .notEmpty()
    .isIn(["Belum_Menikah", "Menikah"])
    .withMessage("Format {status} tidak valid (BELUM_MENIKAH/MENIKAH)"),
  body("alamatRumah")
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {alamatRumah} tidak valid (!NULL)"),
  body("nomorTelephone")
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
    .notEmpty()
    .trim()
    .withMessage("Format {pendidikanTerakhir} tidak valid (!NULL)")
    .isIn(["SMA", "SMK", "S1", "S2", "S3", "D3", "-"])
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
    .notEmpty({ ignore_whitespace: true })
    .trim()
    .withMessage("Format {jabatanId} tidak valid (!NULL)")
    .isInt({ min: 1, allow_leading_zeroes: false })
    .toInt()
    .withMessage("Format {jabatanId} tidak valid [min: 1]"),
  body("mataPelajaranId")
    .notEmpty()
    .trim()
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
    .isIn(["SMA", "SMK", "S1", "S2", "S3", "D3", "-"])
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
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
];

module.exports = {
  loginBodyValidator,
  changePwBodyValidator,
  createBodyValidator,
  updateBodyValidator,
<<<<<<< HEAD
};
=======
};
>>>>>>> 898c7b6573e86a41da64e90e291b0ff89da570d3
