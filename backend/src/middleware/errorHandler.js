const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (statusCode >= 500) {
    console.error("Erreur serveur:", err);
    message = "Une erreur interne est survenue";
  }

  // Erreurs Mongoose
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Ressource non trouvée";
  }
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `La valeur pour '${field}' existe déjà`;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
