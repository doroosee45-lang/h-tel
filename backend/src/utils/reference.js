const { v4: uuidv4 } = require("uuid");

// Génère une référence lisible: PREFIX-YYYYMMDD-XXXX
const generateReference = (prefix = "REF") => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const short = uuidv4().split("-")[0].toUpperCase();
  return `${prefix}-${y}${m}${d}-${short}`;
};

module.exports = { generateReference };
