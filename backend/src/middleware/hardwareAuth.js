// Authentifie les appels provenant de la passerelle matérielle des serrures connectées
// (pas un utilisateur humain avec JWT, mais un système physique) via une clé partagée
// transmise dans l'en-tête x-lock-gateway-secret.
const requireHardwareSecret = (req, res, next) => {
  const secret = req.headers["x-lock-gateway-secret"];
  const expected = process.env.LOCK_GATEWAY_SECRET;

  if (!expected) {
    res.status(503);
    throw new Error("LOCK_GATEWAY_SECRET non configuré côté serveur");
  }
  if (!secret || secret !== expected) {
    res.status(401);
    throw new Error("Clé de passerelle matérielle invalide");
  }
  next();
};

module.exports = { requireHardwareSecret };
