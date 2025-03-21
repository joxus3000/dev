const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const db = require("../config/db"); // Ensure the correct relative path
const authRoutes = require("./routes/authRoutes"); // Move auth routes to a separate file
const doctorRoutes = require("./routes/doctorsRoute");
const AppointmentRoutes = require("./routes/AppointmentsRoute");
// const patientRoutes = require("./routes/patientsRoute");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Request Logger Middleware
app.use((req, res, next) => {
  console.log(`🟢 Received ${req.method} request on ${req.url}`);
  next();
});

// ✅ Routes
app.use("/auth", authRoutes); // Now auth routes are separate
app.use("/doctors", doctorRoutes);
app.use("/Appointments",AppointmentRoutes );
// app.use("/patients", patientRoutes);


// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Server is running.");
});

// ✅ Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
