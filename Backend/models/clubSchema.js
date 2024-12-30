import mongoose from "mongoose"

const clubSchema=new mongoose.Schema({
    name:String,
    description:String,
    email:String,
    phone:String,
    category:String,
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    clubLead:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    clubMentor:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    clubImage:{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

export const Club=mongoose.model("Club",clubSchema);