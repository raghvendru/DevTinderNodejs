const express = require("express")

const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation")

const User = require("../model/user")
const bcrypt = require("bcrypt")



authRouter.post("/signup",async (req,res)=>{
    //console.log(req.body)
    try{
        //validation of data
    validateSignUpData(req);
    //encrypt data(npm bcrypt)
    const {firstName,age,lastName,emailId,password} = req.body;

    const passwordHash =await bcrypt.hash(password,10)
    console.log(passwordHash)


    //creating nerw instance of userModel
    const user =new User({
        firstName,
        lastName,
        emailId,
        age,
        password:passwordHash
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
         console.log(token)
 
         //add token to cookie and send res back to user
         res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)})
    res.json({message:"user added successfully",data:savedUser})
    }catch(err){
        res.status(400).send("Error:"+err.message)
    }



  
    


})

authRouter.post("/login",async(req,res)=>{
    try {
       const {emailId,password} = req.body  ;
       const user = await User.findOne({emailId:emailId})
       if(!user){
         throw new Error("invalid credentials")
       }
       const isPasswordValid = await user.validatePasswords(password)
       if(isPasswordValid){
         //create jwt token
         const token = await user.getJWT();
         console.log(token)
 
         //add token to cookie and send res back to user
         res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)})
         res.send(user)
         
       }else{
         throw new Error("invalid cred")
       }
 
 
     }catch(err){
         res.status(400).send("ERROR: "+ err.message)
     }
 
 })

 authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("logout successful");

 })

module.exports = authRouter;

