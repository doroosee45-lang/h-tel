const parseExactPaymentAmount = (requestedAmount, amountDue) => {
  const amount = Number(requestedAmount);
  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(amountDue) ||
    amount <= 0 ||
    amountDue <= 0 ||
    Math.round(amount * 100) !== Math.round(amountDue * 100)
  ) {
    return null;
  }
  return amountDue;
};

module.exports = { parseExactPaymentAmount };
