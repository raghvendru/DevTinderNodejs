// const  adminAuth = (req,res,next)=>{
//     console.log("Admit auth is getting checked")
//     const token = "xyz"
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).send("unauthorised request")
//     } else{
//         next();
//     }
// }

// const  userAuth = (req,res,next)=>{
//     console.log("Admit auth is getting checked")
//     const token = "xyz"
//     const isAdminAuthorized = token === "xyz";
//     if(!isAdminAuthorized){
//         res.status(401).send("unauthorised request")
//     } else{
//         next();
//     }
// }

const jwt =require("jsonwebtoken");
const User =require("../model/user")

const  userAuth =async (req,res,next)=>{
    //read the token from the req cookies
  try {const {token} = req.cookies
  if(!token){
    return res.status(401).send("Please log in")
  }

   const decodedObj = await jwt.verify(token,"DEVhkj@$jsjj222ahk")

   const {_id} = decodedObj;

   const user = await User.findById(_id);
   if(!user){
    throw new Error("no user found")
   }
   req.user = user
   next();
}
   catch(err){
    res.status(400).send("Error" +err.message)

   }


    //validate token
    //find  user

    
}

module.exports = {userAuth};