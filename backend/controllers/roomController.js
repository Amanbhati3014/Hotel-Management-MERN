const Room = require("../models/Room");


// CREATE ROOM
exports.createRoom =
async(req,res)=>{

try{

console.log("BODY →",req.body);

console.log("FILE →",req.file);



const room =
await Room.create({

title:req.body.title,

city:req.body.city,

price:req.body.price,

description:req.body.description,

image:req.file?.path

});


console.log("ROOM SAVED →",room);

res.json(room);

}

catch(err){

console.log(err);

res.status(500).json({

message:err.message

});

}

};

// GET ALL ROOMS
exports.getRooms =
async(req,res)=>{

try{

const rooms =
await Room.find();

res.json(
rooms
);

}

catch(err){

res.status(500)
.json({

message:
err.message

});

}

};


// UPDATE ROOM
exports.updateRoom =
async(req,res)=>{

try{

const room =
await Room.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true
}

);

res.json(
room
);

}

catch(err){

res.status(500)
.json({

message:
err.message

});

}

};


// DELETE ROOM
exports.deleteRoom =
async(req,res)=>{

try{

await Room.findByIdAndDelete(
req.params.id
);

res.json({

message:
"Room Deleted"

});

}

catch(err){

res.status(500)
.json({

message:
err.message

});

}

};