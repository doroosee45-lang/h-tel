const express = require("express");
const router = express.Router();
const { uploadFile, uploadMultipleFiles } = require("../controllers/uploadController");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", upload.single("file"), uploadFile);
router.post("/multiple", upload.array("files", 10), uploadMultipleFiles);

module.exports = router;
