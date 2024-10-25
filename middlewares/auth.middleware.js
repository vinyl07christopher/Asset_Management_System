const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  const sessionData = req.session?.user;
  const isApiRoute = req.originalUrl.startsWith("/api/");

  if (!sessionData || !sessionData.id || !sessionData.isAuthenticated)
    return isApiRoute ? res.status(401).json({ message: "Unauthorized" }) : res.redirect("/login");

  const user = await User.findByPk(sessionData.id);
  if (!user) return isApiRoute ? res.status(401).json({ message: "Unauthorized" }) : res.redirect("/login");

  req.user = user;
  next();
};

module.exports = authMiddleware;
