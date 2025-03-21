const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


const JWT_SECRET = "your_jwt_secret";

exports.register = async (req, res) => {
    try {
      console.log("🟢 Register endpoint hit with data:", req.body);
      const db = global.db;  // Ensure `db` is available
      if (!db) {
        console.error("❌ Database connection is undefined!");
        return res.status(500).json({ error: "Database connection error" });
      }
  
      const { fullName, username, password } = req.body;
      console.log("❌ Missing fields in request");
      if (!fullName || !username || !password || !specialization ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

  
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("🔒 Hashed password:", hashedPassword);
  
      const [result] = await db.query(
        "INSERT INTO doctor (fullName, username, password, doctorid, specialty, phone) VALUES (?, ?, ?, ?, ?, ?)",
        [fullName, username, hashedPassword, doctorid, specialty, phone]
      );

      console.log("✅ User registered, ID:", result.insertId);
        res.json({ message: "✅ Account created", account_id: result.insertId });
    }
    catch (err) {
      console.error("❌ Registration error:", err.message);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
    
  };

  exports.login = async (req, res) => {
    try {
      const db = global.db;  // Ensure `db` is available inside function
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
  
      const [users] = await db.query("SELECT * FROM doctor WHERE username = ?", [username]);
      if (users.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }
  
      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { doctorid: user.doctorid, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: "1h" }
      );
  
      res.json({ message: "✅ Login successful", token });
    } catch (err) {
      console.error("❌ Login error:", err.message);
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
  }

    exports.getAllDoctors = async (req, res) => {
        try {
        const db = global.db;  // Ensure `db` is available inside function
        const [users] = await db.query("SELECT doctorid, fullName, username, specialty, phone FROM doctor");
        res.json(users);
        } catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).json({ error: "Internal server error" });
        }
    };

    exports.forgotPassword = async (req, res) => {
        try {
        const db = global.db;  // Ensure `db` is available inside function
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and new password are required" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            "UPDATE doctor SET password = ? WHERE username = ?",
            [hashedPassword, username]
        );
    
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "User not found" });
        }
    
        res.json({ message: "✅ Password updated" });
        } catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).json({ error: "Internal server error" });
        }
    };