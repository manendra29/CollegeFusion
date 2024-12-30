import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        minLength:[3,"Username should have 3 characters atleast"],
        maxLength:[40,"Username cannot exceed 40 characters"],
    },
    password:{
        type:String,
        selected:false,
        minLength:[8,"password should be of 8 characters atleast"],
    },
    email: String,
    college:String,
    department:{
      Type:String,
      enum:["ISE","CSE"]
    },
    linkedIn:String,
    leetcode:String,
    github:String,
    profilePicture:{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    },
    coverPicture:{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    },
    following:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }],
    followers:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }],
    role:{
      type:String,
      enum:["Student","Teacher","Hod","Admin"]
    },
    ranking:Number,
    createdAt: {
    type: Date,
    default: Date.now,
  },
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
  }
  
  userSchema.methods.generateJsonWebToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
      expiresIn:process.env.JWT_EXPIRES_IN
    })
  }
  
  export const User=new mongoose.model("User",userSchema);