const QRCode = require("qrcode");

// Génère un QR code en data URL (base64) à partir d'un payload (string ou objet)
const generateQRCode = async (payload) => {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload);
  return await QRCode.toDataURL(data, { errorCorrectionLevel: "M", margin: 1, width: 300 });
};

module.exports = { generateQRCode };
