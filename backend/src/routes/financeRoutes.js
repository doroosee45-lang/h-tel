const express = require("express");
const router = express.Router();
const {
  openCashRegister, closeCashRegister, getCashRegisters,
  getInvoices, getInvoice, createInvoice, verifyInvoice,
  createPayment,
  getExpenses, getExpense, createExpense, updateExpense, approveExpense, deleteExpense,
  getDailyReport, getLedger,
} = require("../controllers/financeController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.get("/invoices/verify/:id", verifyInvoice); // accessible publiquement (scan QR facture)

router.use(protect);
router.use(authorize("admin", "accountant", "receptionist"));

router.post("/cash-register/open", openCashRegister);
router.post("/cash-register/:id/close", closeCashRegister);
router.get("/cash-register", getCashRegisters);

router.get("/invoices", getInvoices);
router.get("/invoices/:id", getInvoice);
router.post("/invoices", createInvoice);

router.post("/payments", createPayment);

router.get("/expenses", authorize("admin", "accountant"), getExpenses);
router.get("/expenses/:id", authorize("admin", "accountant"), getExpense);
router.post("/expenses", authorize("admin", "accountant"), createExpense);
router.put("/expenses/:id", authorize("admin", "accountant"), updateExpense);
router.patch("/expenses/:id/approve", authorize("admin"), approveExpense);
router.delete("/expenses/:id", authorize("admin"), deleteExpense);

router.get("/reports/daily", authorize("admin", "accountant"), getDailyReport);
router.get("/reports/ledger", authorize("admin", "accountant"), getLedger);

module.exports = router;
