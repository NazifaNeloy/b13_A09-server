export const errorHandler = (err, req, res, next) => {
  console.error("Centralized Error Catcher 🚨:", err.stack || err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected system anomaly occurred inside the vault.";
  
  res.status(statusCode).send({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
