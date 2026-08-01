const express = require("express");
const router = express.Router();
const {
  getEmployees, getEmployee, createEmployee, updateEmployee,
  clockIn, clockOut, getAttendance,
  requestLeave, getLeaves, reviewLeave,
  createPayroll, getPayrolls, markPayrollPaid,
} = require("../controllers/hrController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.use(protect);

router.get("/employees", authorize("admin", "hr_manager"), getEmployees);
router.get("/employees/:id", authorize("admin", "hr_manager"), getEmployee);
router.post("/employees", authorize("admin", "hr_manager"), createEmployee);
router.put("/employees/:id", authorize("admin", "hr_manager"), updateEmployee);

router.post("/attendance/checkin", clockIn); // tout employé peut pointer
router.post("/attendance/:id/checkout", clockOut);
router.get("/attendance", authorize("admin", "hr_manager"), getAttendance);

router.post("/leaves", requestLeave); // tout employé peut demander un congé
router.get("/leaves", authorize("admin", "hr_manager"), getLeaves);
router.patch("/leaves/:id/review", authorize("admin", "hr_manager"), reviewLeave);

router.post("/payroll", authorize("admin", "hr_manager", "accountant"), createPayroll);
router.get("/payroll", authorize("admin", "hr_manager", "accountant"), getPayrolls);
router.patch("/payroll/:id/pay", authorize("admin", "accountant"), markPayrollPaid);

module.exports = router;
