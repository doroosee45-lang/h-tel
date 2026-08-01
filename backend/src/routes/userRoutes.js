const express = require("express");
const router = express.Router();
const { getUsers, getUser, updateUser, deactivateUser } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.use(protect);
router.get("/", authorize("admin", "hr_manager"), getUsers);
router.get("/:id", getUser);
router.put("/:id", authorize("admin", "hr_manager"), updateUser);
router.delete("/:id", authorize("admin"), deactivateUser);

module.exports = router;
