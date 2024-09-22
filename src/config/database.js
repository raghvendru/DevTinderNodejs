const mongoose = require("mongoose")

const connectDb = async ()=>{
    mongoose.connect("mongodb+srv://raghavendr:12345@devtinder.npcym.mongodb.net/DivTinder")

}


module.exports = connectDb;
