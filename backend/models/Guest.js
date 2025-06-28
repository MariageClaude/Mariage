const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dotResponse: {
      type: String,
      enum: ["pending", "attending", "not-attending"],
      default: "pending",
    },
    civilResponse: {
      type: String,
      enum: ["pending", "attending", "not-attending"],
      default: "pending",
    },
    NightResponse: {
      type: String,
      enum: ["pending", "attending", "not-attending"],
      default: "pending",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", guestSchema);
