const test = require("node:test");
const assert = require("node:assert/strict");
const { parseExactPaymentAmount } = require("../src/utils/paymentValidation");

test("accepts only a positive amount matching the server-side balance to cents", () => {
  assert.equal(parseExactPaymentAmount("12.34", 12.34), 12.34);
  assert.equal(parseExactPaymentAmount(12.339, 12.34), 12.34);
  assert.equal(parseExactPaymentAmount(12, 12.34), null);
  assert.equal(parseExactPaymentAmount(-1, 12.34), null);
  assert.equal(parseExactPaymentAmount("invalid", 12.34), null);
  assert.equal(parseExactPaymentAmount(1, Number.NaN), null);
});
