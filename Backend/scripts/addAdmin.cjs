// CommonJS script to create admin user
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Game");
    console.log("Connected to MongoDB");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const result = await mongoose.connection.db.collection("users").insertOne({
      name: "Admin User",
      email: "admin@factory.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@factory.com");
    console.log("Password: admin123");
    console.log("User ID:", result.insertedId);
  } catch (error) {
    if (error.code === 11000) {
      console.log("Admin user already exists!");
      console.log("Email: admin@factory.com");
      console.log("Password: admin123");
    } else {
      console.error("Error:", error.message);
    }
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
