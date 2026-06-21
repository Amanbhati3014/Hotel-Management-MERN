const express=require("express");
const path=
require("path");

const cors=require("cors");

require("dotenv").config();

const connectDB=
require("./config/db");
const authRoutes=require("./routes/authRoutes");
const testRoutes=require("./routes/testRoutes");
const roomRoutes=require("./routes/roomRoutes");

connectDB();

const app=
express();

app.use(express.json());
//to serve static files from the uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(cors());

//using auth routes
app.use("/api/auth", authRoutes);
//using test routes
app.use("/api/test", testRoutes);

//using room routes
app.use("/api/rooms", roomRoutes);


app.listen(
process.env.PORT,
()=>{

console.log("Server Running");

}
);
