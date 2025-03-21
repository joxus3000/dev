require("dotenv").config();
const express = require("express");
const cors = require("cors");
const AppointmentRoutes = require("./routes/appointmentRoutes");


const app = express();





// Middleware

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
