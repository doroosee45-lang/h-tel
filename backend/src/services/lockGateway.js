const axios = require("axios");

// Comme pour le Mobile Money, il n'existe PAS d'API universelle pour les serrures
// connectées : chaque fabricant (Salto, Assa Abloy, dormakaba, Nuki, TTLock, Akiles...)
// a son propre SDK/API cloud. Ce module est un ADAPTATEUR GÉNÉRIQUE qui gère tout le
// cycle de vie logiciel de la clé numérique (émission, validation, révocation) — la
// seule pièce manquante est l'appel réseau final vers VOTRE fabricant, isolé ici dans
// `pushKeyToDevice`. Sans configuration, le système fonctionne quand même en mode
// "QR code affiché à la réception/au personnel" (déverrouillage manuel assisté).

const isConfigured = () => !!(process.env.LOCK_GATEWAY_API_URL && process.env.LOCK_GATEWAY_API_KEY);

/**
 * Pousse une clé numérique vers la passerelle du fabricant de serrures, pour qu'elle
 * soit reconnue par la serrure physique (BLE/NFC) de la chambre. À adapter au SDK réel.
 */
const pushKeyToDevice = async ({ deviceId, token, validFrom, validUntil }) => {
  if (!isConfigured()) {
    console.warn(
      "⚠️  LOCK_GATEWAY non configuré: la clé numérique est créée en base mais pas poussée " +
        "vers une serrure physique. Le personnel doit utiliser une clé/carte physique en attendant."
    );
    return { pushed: false, reason: "not_configured" };
  }

  const response = await axios.post(
    `${process.env.LOCK_GATEWAY_API_URL}/keys`,
    { device_id: deviceId, access_token: token, valid_from: validFrom, valid_until: validUntil },
    { headers: { Authorization: `Bearer ${process.env.LOCK_GATEWAY_API_KEY}` } }
  );
  return { pushed: true, providerResponse: response.data };
};

/**
 * Révoque immédiatement une clé côté serrure physique (ex: check-out anticipé,
 * perte de téléphone signalée par le client).
 */
const revokeKeyOnDevice = async ({ deviceId, token }) => {
  if (!isConfigured()) return { revoked: false, reason: "not_configured" };

  const response = await axios.delete(`${process.env.LOCK_GATEWAY_API_URL}/keys/${token}`, {
    headers: { Authorization: `Bearer ${process.env.LOCK_GATEWAY_API_KEY}` },
    data: { device_id: deviceId },
  });
  return { revoked: true, providerResponse: response.data };
};

module.exports = { isConfigured, pushKeyToDevice, revokeKeyOnDevice };
