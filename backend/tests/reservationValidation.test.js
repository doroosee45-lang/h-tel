const test = require("node:test");
const assert = require("node:assert/strict");
const { parseStayDates, parseManualDiscount } = require("../src/utils/reservationValidation");

test("accepts a valid stay and returns parsed dates", () => {
  const dates = parseStayDates("2026-10-10", "2026-10-12");
  assert.ok(dates);
  assert.equal(dates.checkOut - dates.checkIn, 2 * 24 * 60 * 60 * 1000);
});

test("rejects missing, invalid, and reversed stay dates", () => {
  assert.equal(parseStayDates("", "2026-10-12"), null);
  assert.equal(parseStayDates("invalid", "2026-10-12"), null);
  assert.equal(parseStayDates("2026-02-30", "2026-03-02"), null);
  assert.equal(parseStayDates("2026-10-10T00:00:00Z", "2026-10-12"), null);
  assert.equal(parseStayDates("2026-10-12", "2026-10-12"), null);
  assert.equal(parseStayDates("2026-10-13", "2026-10-12"), null);
});

test("limits staff discounts to the remaining charge after promotions", () => {
  assert.equal(parseManualDiscount(20, 100, 10), 20);
  assert.equal(parseManualDiscount(91, 100, 10), null);
  assert.equal(parseManualDiscount(-1, 100, 10), null);
  assert.equal(parseManualDiscount("not-a-number", 100, 10), null);
});
