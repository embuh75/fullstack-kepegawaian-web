const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

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

const upload = multer({ storage, limits: { fileSize: 1024 * 1024}, fileFilter });

module.exports = upload;
