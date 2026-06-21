const User=
require("../models/User");

const bcrypt=
require("bcryptjs");

const jwt=
require("jsonwebtoken");

exports.register=
async(req,res)=>{

try{

const{
name,
email,
password,
role
}=req.body;

const exists=
await User.findOne({
email
});

if(exists){

return res
.status(400)
.json({
message:
"User exists"
});

}

const hash=
await bcrypt.hash(
password,
10
);

const user=
await User.create({

name,

email,


password:
hash,
role: role || "user"

});

res.json({
message:
"Registered"
});

}

catch(err){

res
.status(500)
.json({
message:
err.message
});

}

};

exports.login=
async(req,res)=>{

try{

const{
email,
password
}=req.body;

const user=
await User.findOne({
email
});

if(!user){

return res
.status(404)
.json({
message:
"Invalid"
});

}

const match=
await bcrypt.compare(
password,
user.password
);

if(!match){

return res
.status(400)
.json({
message:
"Wrong Password"
});

}

const token=
jwt.sign(

{
id:
user._id,

role:
user.role
},

process.env.JWT_SECRET

);

res.json({

token,

user

});

}

catch(err){

res
.status(500)
.json({
message:
err.message
});

}

};