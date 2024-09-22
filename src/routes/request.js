const express = require("express")

const requestRouter  = express.Router()
const {userAuth} =require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId= req.user._id;
        const toUserId= req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"invalid message type "  + status})


        }

        //you should not send req which is not there in our db
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"user not found"})
        }


        //if there is an existing connection requ(from and to or vice-versa)
        const existingConnRequest = await ConnectionRequest.findOne({
         $or:[
            {fromUserId, toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}

         ]
        })
        if(existingConnRequest){
            return res.status(400).send({message:"Already you have sent connection request"})

        }



        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        res.json({
            message:req.user.firstName + " is " + status +" in "+toUser.firstName,
            data,
        })

        

    }catch(err){
        res.status(400).send("Error:" + err.message)
    }
   // req.send(user.firstName + "sent conn request")

})

module.exports = requestRouter

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
     try{
        const loggedInUser = req.user;
        const {status,requestId} = req.params;

        //wrong api means not allowed
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "status not allowed"})
        }

        //advik => hanamant
        //is hanamanat loggedIn
        //status = interested
        //requestId should be valid
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId : loggedInUser._id,
            status: "interested",
        })
        
        
        if(!connectionRequest){
            return res.status(404).json({message:"connection request not found"})

        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({message:"connection request "+status,data})


        //validate status

     }catch(err){
        res.status(400).send("ERROR: " + err.message)
     }

})