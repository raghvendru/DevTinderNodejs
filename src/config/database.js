const mongoose = require("mongoose")

const connectDb = async ()=>{
  mongoose.connect("mongodb+srv://ranjankumarnayak3333:G5sN1oAqbNjJIUvU@cluster0.3pbds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/DivTinder")

}


module.exports = connectDb;