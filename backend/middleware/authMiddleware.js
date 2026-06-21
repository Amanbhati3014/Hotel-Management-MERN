const jwt =
require("jsonwebtoken");

const auth =
(req,res,next)=>{

try{

const authHeader =
req.headers.authorization;

console.log(
"Header:",
authHeader
);

if(!authHeader){

return res
.status(401)
.json({

message:
"No Token"

});

}


// Remove Bearer safely

const token =
authHeader.replace(
/^Bearer\s+/i,
""
).trim();

console.log(
"JWT:",
token
);


const decoded =
jwt.verify(

token,

process.env.JWT_SECRET

);

console.log(
"Decoded:",
decoded
);

req.user =
decoded;

next();

}

catch(err){

console.log(
err.message
);

return res
.status(401)
.json({

message:
"Invalid Token"

});

}

};

module.exports =
auth;
