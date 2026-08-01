/**
 * Calcule la variation de quantité à appliquer à un StockItem selon le type de mouvement.
 *  - "in"                 : entrée en stock, toujours positive (+quantity)
 *  - "out" / "loss"        : sortie/perte, toujours négative (-|quantity|), quel que soit
 *                            le signe fourni en entrée (protège contre une saisie erronée)
 *  - "inventory_adjustment": correction suite à un inventaire physique — la quantité
 *                            REPRÉSENTE DIRECTEMENT L'ÉCART (peut être positif si le
 *                            comptage physique révèle plus de stock que prévu, ou négatif
 *                            dans le cas contraire). Ne pas forcer en négatif ici, sinon
 *                            un ajustement ne pourrait jamais AUGMENTER le stock.
 */
const computeStockDelta = (type, quantity) => {
  if (type === "in") return Math.abs(quantity);
  if (type === "out" || type === "loss") return -Math.abs(quantity);
  if (type === "inventory_adjustment") return quantity; // signé, tel quel
  return 0;
};

module.exports = { computeStockDelta };
