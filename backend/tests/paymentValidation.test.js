const test = require("node:test");
const assert = require("node:assert/strict");
const { parseExactPaymentAmount, isValidPaymentReference } = require("../src/utils/paymentValidation");

test("accepts only a positive amount matching the server-side balance to cents", () => {
  assert.equal(parseExactPaymentAmount("12.34", 12.34), 12.34);
  assert.equal(parseExactPaymentAmount(12.339, 12.34), 12.34);
  assert.equal(parseExactPaymentAmount(12, 12.34), null);
  assert.equal(parseExactPaymentAmount(-1, 12.34), null);
  assert.equal(parseExactPaymentAmount("invalid", 12.34), null);
  assert.equal(parseExactPaymentAmount(1, Number.NaN), null);
});

test("accepts bounded provider references without query operators", () => {
  assert.equal(isValidPaymentReference("pi_0123456789-ABC.def"), true);
  assert.equal(isValidPaymentReference("$ne"), false);
  assert.equal(isValidPaymentReference("x".repeat(201)), false);
  assert.equal(isValidPaymentReference({ $ne: null }), false);
});
