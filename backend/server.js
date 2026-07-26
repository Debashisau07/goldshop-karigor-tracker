require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");;
const connectDB = require("./src/config/db");

const app = express();
//database connection
connectDB();
//middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//Test route
app.get("/",(req,res)=>{
  res.json({ message: "Gold Karigor Tracker API Running" });
})

// Routes (we add these next)
// app.use("/api/auth", require("./src/routes/auth.routes"));
// app.use("/api/kaaj", require("./src/routes/kaaj.routes"));

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});