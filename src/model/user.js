const mongoose = require("mongoose");
const validator = require("validator")
const jwt =require("jsonwebtoken")
const bcrypt =require("bcrypt")


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        //index:true,
        required:true,
        minLength:3,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true, //mongodb auto create index if u write unique
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email"+value)
            }
        },

    },
    password:{
        type:String,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        required:false,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid formate")

            }
        }

    },
    photoURL:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD116U9ZCk8bEaanCeB5rSCC2uqY5Ka_2_EA&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid url"+value)
            }
        },
    },
    about:{
        type:String,
        default:"This is devtinder app"
    },
    skills:{
        type:[String],
    },
    
},{
    timestamps:true
});

userSchema.methods.getJWT =async function(){
    const user = this;
  const token = await jwt.sign({_id:user._id},"DEVhkj@$jsjj222ahk",{expiresIn:"7d",})
  return token;
}

userSchema.methods.validatePasswords = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid;

    
}

// To use our schema definition, we need to convert our userSchema into a Model we can work with. To do so, we pass it into mongoose.model(modelName, schema):

module.exports = mongoose.model("User",userSchema);