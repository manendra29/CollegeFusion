import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:String,
    comment:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        value:String
    }],
    like:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    postImage:{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    clubId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Club"
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});
export const Post=mongoose.model("Post",postSchema);