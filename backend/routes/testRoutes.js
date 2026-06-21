const router =
require("express").Router();

const auth =
require("../middleware/authMiddleware");

const admin =
require("../middleware/adminMiddleware");


router.get(

"/user",

auth,

(req,res)=>{

res.json({

message:
"Welcome User"

});

}

);


router.get(

"/admin",

auth,

admin,

(req,res)=>{

res.json({

message:
"Welcome Admin"

});

}

);

module.exports =
router;