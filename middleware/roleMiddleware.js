const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
      try {
        // check user exists 
        if (!req.user) {
          return res.status(401).json({
            error: true,
            message: "Unauthorized access"
          });
        }
  
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
            error: true,
            message: "Access denied: insufficient permissions"
          });
        }
  
        next();
  
      } catch (error) {
        res.status(500).json({
          error: true,
          message: error.message
        });
      }
    };
  };
  
  module.exports = roleMiddleware;