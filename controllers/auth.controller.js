const User = require("../models/user.model");

const create = async (req, res) => {
  const data = {
    username: "user",
    email: "user@user.com",
    password: "user@123",
  };
  try {
    await User.create(data);
    res.json({ message: "User created:" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: "user@user.com",
        password: "user@123",
      },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.session.user = {
      id: user.id,
      role: user.role,
      isAuthenticated: true,
    };

    res.json({ message: "logged in successfully !" });
  } catch (error) {
    res.status(500).json({ message: "Error while trying log in" });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.json({ message: "Error during logout" });
    res.redirect("/login");
  });
};

module.exports = { create, login, logout };
