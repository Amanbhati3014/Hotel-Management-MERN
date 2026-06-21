const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const parseImages = (value) => {
    if (Array.isArray(value)) {
        return value
            .flatMap((item) => parseImages(item))
            .filter(Boolean);
    }

    if (typeof value !== "string") {
        return [];
    }

    return value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);
};

const normalizeRoomPayload = (body, files = []) => {
    const {
        title,
        description,
        price,
        roomNumber,
        capacity,
        images = []
    } = body;

    const uploadedImages = Array.isArray(files)
        ? files.map((file) => `/uploads/${file.filename}`)
        : [];

    const normalizedImages = [
        ...parseImages(images),
        ...uploadedImages
    ];

    return {
        title: typeof title === "string" ? title.trim() : title,
        description: typeof description === "string" ? description.trim() : description,
        price: price === "" || price === null || price === undefined ? price : Number(price),
        roomNumber: typeof roomNumber === "string" ? roomNumber.trim() : roomNumber,
        capacity: capacity === "" || capacity === null || capacity === undefined ? capacity : Number(capacity),
        images: normalizedImages,
    };
};

const validateRoomPayload = (req, res, next) => {
    const room = normalizeRoomPayload(req.body, req.files);

    const errors = [];

    if (typeof room.title !== "string" || !room.title) {
        errors.push("title");
    }

    if (typeof room.description !== "string" || !room.description) {
        errors.push("description");
    }

    if (!Number.isFinite(room.price)) {
        errors.push("price");
    }

    if (typeof room.roomNumber !== "string" || !room.roomNumber) {
        errors.push("roomNumber");
    }

    if (!Number.isInteger(room.capacity) || room.capacity < 1) {
        errors.push("capacity");
    }

    if (!Array.isArray(room.images) || room.images.length === 0 || room.images.some((image) => !image)) {
        errors.push("images");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Invalid room data",
            invalidFields: errors,
        });
    }

    req.body = room;
    next();
};

const validateRoomUpdatePayload = (req, res, next) => {
    const updates = {};
    const errors = [];
    const uploadedImages = Array.isArray(req.files)
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

    if (Object.prototype.hasOwnProperty.call(req.body, "title")) {
        updates.title = typeof req.body.title === "string" ? req.body.title.trim() : req.body.title;
        if (typeof updates.title !== "string" || !updates.title) {
            errors.push("title");
        }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
        updates.description =
            typeof req.body.description === "string" ? req.body.description.trim() : req.body.description;
        if (typeof updates.description !== "string" || !updates.description) {
            errors.push("description");
        }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "price")) {
        updates.price =
            req.body.price === "" || req.body.price === null || req.body.price === undefined
                ? req.body.price
                : Number(req.body.price);
        if (!Number.isFinite(updates.price)) {
            errors.push("price");
        }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "roomNumber")) {
        updates.roomNumber =
            typeof req.body.roomNumber === "string" ? req.body.roomNumber.trim() : req.body.roomNumber;
        if (typeof updates.roomNumber !== "string" || !updates.roomNumber) {
            errors.push("roomNumber");
        }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "capacity")) {
        updates.capacity =
            req.body.capacity === "" || req.body.capacity === null || req.body.capacity === undefined
                ? req.body.capacity
                : Number(req.body.capacity);
        if (!Number.isInteger(updates.capacity) || updates.capacity < 1) {
            errors.push("capacity");
        }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "images")) {
        updates.images = [
            ...parseImages(req.body.images),
            ...uploadedImages
        ];

        if (!Array.isArray(updates.images) || updates.images.length === 0 || updates.images.some((image) => !image)) {
            errors.push("images");
        }
    }

    if (uploadedImages.length > 0 && !Object.prototype.hasOwnProperty.call(req.body, "images")) {
        updates.images = uploadedImages;
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            message: "No room fields provided",
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Invalid room data",
            invalidFields: errors,
        });
    }

    req.body = updates;
    next();
};

// CREATE ROOM
// CREATE ROOM
router.post(
"/",
auth,
admin,
upload.array("images", 8),
validateRoomPayload,

async (req, res) => {

try{

console.log("BODY:", req.body);

console.log("FILES:", req.files);


const room =
await Room.create({

...req.body,

images:

req.body.images || []

});


console.log("ROOM SAVED:", room);

res.status(201).json(room);

}

catch(err){

console.log(err);

if(
err.name==="ValidationError"
||
err.name==="CastError"
||
err.name==="StrictModeError"
){

return res.status(400).json({

message: err.message

});

}

res.status(500).json({

message: err.message

});

}

}
);

// GET ALL ROOMS
router.get("/", async (req, res) => {
  try {
    const { minPrice, maxPrice, capacity, search } = req.query;

    let filter = {};

    // 🔍 search by title
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // 💰 price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 👥 capacity filter
    if (capacity) {
      filter.capacity = { $gte: Number(capacity) };
    }

    const rooms = await Room.find(filter);

    res.json({
      count: rooms.length,
      rooms,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get single room
router.get("/:id", async (req, res) => {
    try{
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
        console.log(err);
    }
});

// UPDATE ROOM
router.put("/:id", auth, admin, upload.array("images", 8), validateRoomUpdatePayload, async (req, res) => {
    try{
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json(room);
    }
    catch(err){
        if (err.name === "ValidationError" || err.name === "CastError" || err.name === "StrictModeError") {
            return res.status(400).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: err.message
        });
        console.log(err);
    }
});

// DELETE ROOM
router.delete("/:id", auth, admin, async (req, res) => {
    try{
        const room = await Room.findByIdAndDelete(req.params.id);
        res.status(200).json(room);
    }
    catch(err){
        res.status(500).json({
            message: err.message
        });
        console.log(err);
    }
});

module.exports = router;
