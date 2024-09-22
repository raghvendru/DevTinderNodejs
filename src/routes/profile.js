const express = require("express")

const profileRouter = express.Router()
const {userAuth} =require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")


profileRouter.get("/profile",userAuth,async(req,res)=>{
    try {
     const user = req.user
     res.send(user)
 }catch(err){
     res.status(400).send("ERROR"+ err.message)
 }
 })

 profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
       if (!validateEditProfileData(req)){
        throw new Error("Invalid edit requests")
       }
       const loggedInUser = req.user;

       Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))

       res.json({message:`${loggedInUser.firstName} ,your profile updated successfully`,data:loggedInUser});



      console.log(loggedInUser)
      await loggedInUser.save()

    }catch(err){
        res.status(400).send("Error:" +err.message)
    }

 })

 module.exports = profileRouter;