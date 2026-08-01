const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Stockage local sur disque (dossier /uploads servi statiquement par Express).
// À remplacer par multer-storage-cloudinary si vous préférez un stockage cloud direct.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  if (isValid) return cb(null, true);
  cb(new Error("Seules les images (jpeg, jpg, png, webp, gif) sont autorisées"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max par fichier
});

module.exports = upload;
