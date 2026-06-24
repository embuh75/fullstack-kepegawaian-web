const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);

    cb(null, `IMG_${uniqueSuffix}${fileExt}`);
  },
});

const fileFilter = (req, file, callback) => {
  const fileExt = path.extname(file.originalname);
  const allowedTypes = [".jpeg", ".jpg", ".png", ".webp"];

  if (!allowedTypes.includes(fileExt)) {
    return callback(
      new Error("Format gambar salah! (.jpeg, .jpg, .png, .webp)"),
    );
  }

  callback(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
