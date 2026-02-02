const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  level: Number,
  name: String,
  hasCapital: Boolean,
  hasPlantSize: Boolean,
});

module.exports = mongoose.model("Level", levelSchema);
