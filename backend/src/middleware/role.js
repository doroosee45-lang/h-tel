// Contrôle d'accès basé sur les rôles (RBAC)
// Usage: authorize("admin", "receptionist")
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Non autorisé");
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Accès refusé pour le rôle: ${req.user.role}`);
    }
    next();
  };
};

module.exports = { authorize };
