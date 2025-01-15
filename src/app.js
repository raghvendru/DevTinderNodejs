const express = require("express");
const app = express();
const connectDb = require("./config/database")
const cookieparser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const cors =require("cors")
require("dotenv").config();

const authRouter =require("./routes/auth")
const profileRouter =require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(express.json());//to conv json to js obj
app.use(cookieparser());//to store and send back token and read

//find by email
// app.get("/user",async (req,res)=>{
//     const userEmail = req.body.email
//    try{
//    const user =  await User.findOne({emailId:userEmail});
//    res.send(user)


//    }catch(err)
// {
//     res.status(400).send("something went wrong")
// }     
// })

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDb().then(()=>{
    console.log("db conn established")
    app.listen(4000,()=>{
        console.log("server successfully listening 4000...")
    });

}).catch(err=>{
    console.error("failed to est db")
})



