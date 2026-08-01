const msPerDay = 1000 * 60 * 60 * 24;

/**
 * Détermine le tarif d'UNE nuit donnée pour une catégorie de chambre, par ordre de
 * priorité : tarif saisonnier (le plus spécifique) > tarif week-end > tarif de base.
 */
const calculateNightlyRate = (category, date) => {
  const t = date.getTime();

  const season = (category.seasonalPrices || []).find(
    (s) =>
      s.startDate &&
      s.endDate &&
      t >= new Date(s.startDate).getTime() &&
      t <= new Date(s.endDate).getTime()
  );
  if (season && typeof season.price === "number") return season.price;

  const day = date.getDay(); // 0=dimanche ... 5=vendredi, 6=samedi
  const isWeekend = day === 5 || day === 6; // nuits de vendredi et samedi
  if (isWeekend && category.weekendPrice) return category.weekendPrice;

  return category.basePrice;
};

/**
 * Calcule le prix complet d'un séjour: tarif nuit par nuit (saisonnier/week-end/base),
 * puis application de la meilleure promotion active sur la catégorie.
 */
const calculateStayPrice = (category, checkInDate, checkOutDate) => {
  const nights = [];
  let cursor = new Date(checkInDate);
  const end = new Date(checkOutDate);

  while (cursor < end) {
    nights.push(calculateNightlyRate(category, cursor));
    cursor = new Date(cursor.getTime() + msPerDay);
  }
  if (nights.length === 0) nights.push(category.basePrice); // sécurité: minimum 1 nuit

  const subtotal = nights.reduce((sum, price) => sum + price, 0);

  const now = new Date();
  const activePromotions = (category.promotions || []).filter(
    (p) =>
      p.isActive &&
      (!p.startDate || new Date(p.startDate) <= now) &&
      (!p.endDate || new Date(p.endDate) >= now)
  );
  const bestPromotion = activePromotions.reduce(
    (best, p) => (!best || p.discountPercent > best.discountPercent ? p : best),
    null
  );
  const promotionDiscount = bestPromotion ? Math.round((subtotal * bestPromotion.discountPercent) / 100) : 0;

  return {
    nights: nights.length,
    nightlyRates: nights,
    averagePricePerNight: Math.round(subtotal / nights.length),
    subtotal,
    appliedPromotion: bestPromotion
      ? { label: bestPromotion.label, discountPercent: bestPromotion.discountPercent }
      : null,
    promotionDiscount,
    totalAfterPromotion: subtotal - promotionDiscount,
  };
};

module.exports = { calculateNightlyRate, calculateStayPrice };
