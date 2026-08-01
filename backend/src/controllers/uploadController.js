const asyncHandler = require("../middleware/asyncHandler");

// @route POST /api/upload  (multipart/form-data, champ "file")
// Stockage local par défaut (voir middleware/upload.js).
// Pour brancher Cloudinary/S3 en production, remplacer le contenu de ce handler
// par un upload vers le service choisi et retourner son URL publique.
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Aucun fichier fourni");
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});

// @route POST /api/upload/multiple
const uploadMultipleFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Aucun fichier fourni");
  }

  const files = req.files.map((f) => ({
    url: `${req.protocol}://${req.get("host")}/uploads/${f.filename}`,
    filename: f.filename,
    size: f.size,
    mimetype: f.mimetype,
  }));

  res.status(201).json({ success: true, data: files });
});

module.exports = { uploadFile, uploadMultipleFiles };
