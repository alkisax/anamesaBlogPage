// middleware/verification.middleware.js

const authService = require('../services/auth.service');

/**
 * Middleware to verify JWT token.
 * Attaches decoded user data to `req.user` if valid.
 */
const verifyToken = (req, res, next) => {
  const token = authService.getTokenFrom(req);
  console.log("🔵 Token extracted:", token);
  if (!token) {
    console.log("🔵 No token provided, setting req.user to undefined");
    // No token provided, continue with undefined req.user
    req.user = undefined;
    return next();
  }

  const verificationResult = authService.verifyAccessToken(token);
  if (!verificationResult.verified) {
    console.log(`Unauthorized access attempt with token: ${token}`);
    return res.status(401).json({
      status: false,
      error: verificationResult.data
    });
  }

  req.user = verificationResult.data;
  console.log("🔵 User data from token:", req.user); 
  next();
};

const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const verificationResult = authService.verifyAccessToken(token);
      
      if (verificationResult.verified) {
        req.user = verificationResult.data;
      } else {
        console.warn("Optional token verification failed");
      }
    } catch (error) {
      console.warn("Optional token failed to verify:", error.message);
      // Continue without attaching user
    }
  }
  next();
};

/**
 * Middleware to check if user has required role.
 * Call after verifyToken middleware.
 */
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roles.includes(requiredRole)) {
      console.log(`Forbidden access by user: ${user?.username || 'unknown'}`);
      return res.status(403).json({
        status: false,
        error: 'Forbidden'
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  optionalVerifyToken,
  checkRole
};
