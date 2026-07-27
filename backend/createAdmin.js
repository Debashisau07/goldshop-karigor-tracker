require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123456", salt);

    // Insert directly to database
    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Check if admin exists
    const existing = await usersCollection.findOne({ role: "admin" });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    // Create admin directly
    await usersCollection.insertOne({
      name: "Admin",
      email: "debusau06@gmail.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Admin created successfully");
    console.log("Email: debusau06@gmail.com");
    console.log("Password: admin123456");
    process.exit(0);

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();