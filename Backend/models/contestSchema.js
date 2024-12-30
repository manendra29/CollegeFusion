import mongoose from "mongoose";


const contestSchema = new mongoose.Schema({
    title:String,
    description:String,
    date:String,
    contestPicture:{
        public_id:{
            type:String,
            require:true,
        },
        url:{
            type:String,
            require:true,
        }
    },
    ranking:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    participants:[{
       type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    contestLink:String,
    clubId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Club"
    },
    status:{
        type:String,
        default:"UpComing",
        enum:["UpComing","Completed"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
});

export const Contest = mongoose.model("Contest",contestSchema);