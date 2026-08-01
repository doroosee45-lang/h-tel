const asyncHandler = require("../middleware/asyncHandler");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");
const Payroll = require("../models/Payroll");
const User = require("../models/User");
const Expense = require("../models/Expense");
const { generateReference } = require("../utils/reference");

// ---------- Employés ----------

// @route GET /api/hr/employees
const getEmployees = asyncHandler(async (req, res) => {
  const { department, status, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (status) filter.status = status;

  const employees = await Employee.find(filter)
    .populate("user", "firstName lastName email phone avatar")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Employee.countDocuments(filter);
  res.json({ success: true, count: employees.length, total, data: employees });
});

// @route GET /api/hr/employees/:id
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("user");
  if (!employee) {
    res.status(404);
    throw new Error("Employé non trouvé");
  }
  res.json({ success: true, data: employee });
});

// @route POST /api/hr/employees  (crée le compte User + le dossier Employee)
const createEmployee = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, role, employeeCode, department, position, hireDate, contractType, baseSalary } = req.body;

  const user = await User.create({ firstName, lastName, email, phone, password, role: role || "employee" });

  const employee = await Employee.create({
    user: user._id,
    employeeCode,
    department,
    position,
    hireDate,
    contractType,
    baseSalary,
  });

  res.status(201).json({ success: true, data: employee });
});

// @route PUT /api/hr/employees/:id
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!employee) {
    res.status(404);
    throw new Error("Employé non trouvé");
  }
  res.json({ success: true, data: employee });
});

// ---------- Présence / Pointage ----------

// @route POST /api/hr/attendance/checkin
const clockIn = asyncHandler(async (req, res) => {
  const { employee, lat, lng } = req.body;

  // Empêche un employé de pointer une deuxième fois sans avoir dépointé au préalable
  const openAttendance = await Attendance.findOne({ employee, checkOut: null });
  if (openAttendance) {
    res.status(400);
    throw new Error("Un pointage est déjà en cours pour cet employé (dépointez d'abord)");
  }

  const attendance = await Attendance.create({
    employee,
    checkIn: new Date(),
    location: { lat, lng },
  });
  res.status(201).json({ success: true, data: attendance });
});

// @route POST /api/hr/attendance/:id/checkout
const clockOut = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    { checkOut: new Date() },
    { new: true }
  );
  if (!attendance) {
    res.status(404);
    throw new Error("Pointage non trouvé");
  }
  res.json({ success: true, data: attendance });
});

// @route GET /api/hr/attendance
const getAttendance = asyncHandler(async (req, res) => {
  const { employee, from, to } = req.query;
  const filter = {};
  if (employee) filter.employee = employee;
  if (from || to) {
    filter.checkIn = {};
    if (from) filter.checkIn.$gte = new Date(from);
    if (to) filter.checkIn.$lte = new Date(to);
  }
  const records = await Attendance.find(filter).populate("employee").sort({ checkIn: -1 });
  res.json({ success: true, data: records });
});

// ---------- Congés ----------

// @route POST /api/hr/leaves
const requestLeave = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.create(req.body);
  res.status(201).json({ success: true, data: leave });
});

// @route GET /api/hr/leaves
const getLeaves = asyncHandler(async (req, res) => {
  const { status, employee } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (employee) filter.employee = employee;
  const leaves = await LeaveRequest.find(filter).populate("employee").sort({ createdAt: -1 });
  res.json({ success: true, data: leaves });
});

// @route PATCH /api/hr/leaves/:id/review
const reviewLeave = asyncHandler(async (req, res) => {
  const { status } = req.body; // approved | rejected
  const leave = await LeaveRequest.findById(req.params.id);
  if (!leave) {
    res.status(404);
    throw new Error("Demande de congé non trouvée");
  }

  if (status === "approved") {
    // Empêche d'approuver un congé qui chevauche un autre congé déjà approuvé pour
    // le même employé (double-approbation involontaire).
    const overlap = await LeaveRequest.findOne({
      _id: { $ne: leave._id },
      employee: leave.employee,
      status: "approved",
      startDate: { $lte: leave.endDate },
      endDate: { $gte: leave.startDate },
    });
    if (overlap) {
      res.status(400);
      throw new Error("Cet employé a déjà un congé approuvé qui chevauche cette période");
    }
  }

  leave.status = status;
  leave.reviewedBy = req.user._id;
  await leave.save();

  if (status === "approved") {
    await Employee.findByIdAndUpdate(leave.employee, { status: "on_leave" });
  }
  res.json({ success: true, data: leave });
});

// ---------- Paie ----------

// @route POST /api/hr/payroll  (calcule et enregistre la paie d'un employé pour une période)
const createPayroll = asyncHandler(async (req, res) => {
  const { employee, period, bonuses, deductions } = req.body;
  const emp = await Employee.findById(employee);
  if (!emp) {
    res.status(404);
    throw new Error("Employé non trouvé");
  }
  const netSalary = emp.baseSalary + (bonuses || 0) - (deductions || 0);

  const payroll = await Payroll.create({
    employee,
    period,
    baseSalary: emp.baseSalary,
    bonuses: bonuses || 0,
    deductions: deductions || 0,
    netSalary,
  });

  res.status(201).json({ success: true, data: payroll });
});

// @route GET /api/hr/payroll
const getPayrolls = asyncHandler(async (req, res) => {
  const { employee, period, status } = req.query;
  const filter = {};
  if (employee) filter.employee = employee;
  if (period) filter.period = period;
  if (status) filter.status = status;
  const payrolls = await Payroll.find(filter).populate({ path: "employee", populate: { path: "user", select: "firstName lastName" } });
  res.json({ success: true, data: payrolls });
});

// @route PATCH /api/hr/payroll/:id/pay
const markPayrollPaid = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findByIdAndUpdate(
    req.params.id,
    { status: "paid", paidAt: new Date() },
    { new: true }
  ).populate({ path: "employee", populate: { path: "user", select: "firstName lastName" } });
  if (!payroll) {
    res.status(404);
    throw new Error("Fiche de paie non trouvée");
  }

  // Répercute automatiquement le paiement en Dépense (comptabilité §8/§14)
  await Expense.create({
    reference: generateReference("EXP"),
    category: "salaries",
    description: `Salaire ${payroll.period} — ${payroll.employee?.user?.firstName || ""} ${payroll.employee?.user?.lastName || ""}`.trim(),
    amount: payroll.netSalary,
    date: new Date(),
    paymentMethod: "bank_transfer",
    recordedBy: req.user._id,
    approvedBy: req.user._id,
    status: "approved",
  });

  res.json({ success: true, data: payroll });
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  clockIn,
  clockOut,
  getAttendance,
  requestLeave,
  getLeaves,
  reviewLeave,
  createPayroll,
  getPayrolls,
  markPayrollPaid,
};
