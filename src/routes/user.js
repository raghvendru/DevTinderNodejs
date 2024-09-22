const express = require("express")

const userRouter = express.Router();
const {userAuth} =require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user")
const USER_SAFE_DATA ="firstName lastName age photoUrl gender skills about";


//get all the pending connection request for the loggedin user

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInuser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInuser._id,
            status:"interested"

        }).populate("fromUserId",USER_SAFE_DATA)


        res.json({message:"data fetched successfully",data:connectionRequest})


    }catch(err){
        res.status(400).send("ERROR "+err.message)
    }
    

})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[

                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString() ){
                return row.toUserId


            }
           return row.fromUserId})

        res.json({data})


    }catch(err){
        res.status(400).send("ERROR "+err.message)
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser =req.user;

//  /feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
//  /feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
//  /feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)
//  /feed?page=4&limit=10 => 21-30 => .skip(20) & .limit(10)
//  skip = (page-1)*limit;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit =limit>50 ? 50 :limit


        const skip = (page-1)*limit;

        //user should see all user cards except his own card and his connections,ignored people,already sent cnnection req
        //ex;a [b c d e f]

        //find all connection requests (sent+received)
        const connectionRequest = await ConnectionRequest.find({
           $or:[
            {fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}
           ] 
        }).select("fromUserId toUserId")

        const hideUserFromFeed =  new Set();
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString())
            });
        console.log(hideUserFromFeed)

        const users = await User.find({

        $and: [{_id: {$nin: Array.from(hideUserFromFeed)}},{_id:{$ne:loggedInUser._id}}]

        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.send(users)



        

    }catch(err){
        res.status(400).send("ERROR " + err.message);
    }
})



module.exports = userRouter;