/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      console.log(
        `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
      );
    });
  }

  next();
};

/**
 * CORS and security headers middleware
 */
export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
};

export default { requestLogger, securityHeaders };
