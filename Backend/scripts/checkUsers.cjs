// Check users in database
const mongoose = require("mongoose");

async function checkUsers() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Game");
  console.log("Connected to MongoDB");

  const users = await mongoose.connection.db.collection("users").find({}).toArray();
  console.log("Total users:", users.length);

  if (users.length > 0) {
    users.forEach((u) => {
      console.log("- Email:", u.email, "| Role:", u.role);
    });
  } else {
    console.log("No users found. Creating admin...");
    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash("admin123", 10);

    await mongoose.connection.db.collection("users").insertOne({
      name: "Admin User",
      email: "admin@factory.com",
      password: hash,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Admin created! Email: admin@factory.com, Password: admin123");
  }

  await mongoose.connection.close();
  process.exit(0);
}

checkUsers().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
