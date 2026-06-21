const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      validate: {
        validator: (value) => typeof value === "string" && value.length > 0,
        message: "Title must be a non-empty string",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      validate: {
        validator: (value) => typeof value === "string" && value.length > 0,
        message: "Description must be a non-empty string",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
      validate: {
        validator: Number.isFinite,
        message: "Price must be a valid number",
      },
    },
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
      validate: {
        validator: (value) => typeof value === "string" && value.length > 0,
        message: "Room number must be a non-empty string",
      },
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Capacity must be an integer",
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (value) =>
          Array.isArray(value) &&
          value.every((item) => typeof item === "string" && item.trim().length > 0),
        message: "Images must be an array of non-empty strings",
      },
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
