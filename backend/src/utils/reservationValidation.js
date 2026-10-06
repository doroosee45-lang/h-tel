const parseStayDates = (checkInDate, checkOutDate) => {
  const isValidDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  };
  if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) return null;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (checkOut <= checkIn) {
    return null;
  }
  return { checkIn, checkOut };
};

const parseManualDiscount = (value, subtotal, promotionDiscount) => {
  const discount = Number(value || 0);
  if (
    !Number.isFinite(discount) ||
    !Number.isFinite(subtotal) ||
    !Number.isFinite(promotionDiscount) ||
    subtotal < 0 ||
    promotionDiscount < 0 ||
    promotionDiscount > subtotal ||
    discount < 0 ||
    discount > subtotal - promotionDiscount
  ) {
    return null;
  }
  return discount;
};

module.exports = { parseStayDates, parseManualDiscount };
