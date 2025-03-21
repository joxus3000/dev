const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


const JWT_SECRET = "your_jwt_secret";

exports.register = async (req, res) => {
    try {
        console.log("🟢 Register endpoint hit with data:", req.body);

        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Insert user into the database
        const [result] = await db.query(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, password, role]
        );

        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } catch (error) {
        console.error("❌ Error in register:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.login = async (req, res) => {
  try {
    const db = global.db;  // Ensure `db` is available inside function
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const [users] = await db.query("SELECT * FROM Account WHERE username = ?", [username]);
    if (users.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { account_id: user.account_id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ message: "✅ Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [users] = await global.db.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const doctorModel = require("../models/doctormodels");

exports.forgotPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
      return res.status(400).json({ error: "Username and new password are required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const affectedRows = await doctorModel.updatePassword(username, hashedPassword);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({ message: "✅ Password updated successfully" });
  } catch (error) {
    console.error("❌ Error updating password:", error.message);
    res.status(500).json({ error: "Failed to update password" });
  }
};
