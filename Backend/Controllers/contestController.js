import mongoose from "mongoose";
import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/error.js";
import {Contest} from "../models/contestSchema.js";
import { v2 as cloudinary } from "cloudinary";


export const createContest = catchAsyncError(async (req,res,next)=> {
   
    if(!req.files || Object.keys(req.files).length === 0 )
        return next(new ErrorHandler("Contest Image is Needed",400));
     const {contestPicture}=req.files;
     const allowedFormart=["image/png","image/jpeg","image/webp"];
     if(!allowedFormart.includes(contestPicture.mimetype))
         return next(new ErrorHandler("Contest Image format not supported",400));
     const {title,description,date} = req.body;
    if(!title || !description || !date)
            return next(new ErrorHandler("Please Provide all fields",400));
    const cloudinaryResponse= await cloudinary.uploader.upload(
        contestPicture.tempFilePath,
        {
            folder:"Contest_Image"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
        return next(new ErrorHandler("Failed to upload image top cloudinary",400));
    }
    const contest=await Contest.create({
        title,description,date,contestPicture:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    });
    res.status(201).json({
        success:true,
        message:"Contest Added!",
        contest
    })
})

export const updateContest = catchAsyncError(async (req,res,next)=> {
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const contest=await Contest.findByIdAndUpdate(id,req.body,{
        new :true,
        runValidators :true,
        useFindAndModify :false
    });
    res.status(201).json({
        success:true,
        message:"Data Updated",
        contest
    });
})

export const deleteContest = catchAsyncError(async (req,res,next)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const contest=await Contest.findById(id);
    if(!contest)
        return next(new ErrorHandler("Contest not Found",404));

    const deletedContest=await Contest.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"Contest Deleted Successfully",
        deletedContest
    })
})

export const showContest = catchAsyncError(async (req,res,next) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const contest = await Contest.findById(id);
    if(!contest)
        return next(new ErrorHandler("Contest not Found",404));
    res.status(201).json({
        success:true,
        message:"Contest Fetched!",
        contest
    });
});

export const applyContest = catchAsyncError(async (req,res,next) => {
    const {id} = req.params;
    const alreadyAppliedUser = await Contest.find({_id:id,participants:{
        $in:req.user._id
    }});
    if(alreadyAppliedUser.length===1)
        return next(new ErrorHandler("You already applied",400));
    const apply=await Contest.findByIdAndUpdate(id,{
        $push:{
            participants:req.user._id
        }
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(201).json({
        success:true,
        message:"Applied for Contest Successfully!",
        apply
    });
});

export const unApplyContest = catchAsyncError(async (req,res,next) => {
    const {id} = req.params;
    const alreadyAppliedUser = await Contest.find({_id:id,participants:{
        $in:req.user._id
    }});
    if(alreadyAppliedUser.length===0)
        return next(new ErrorHandler("You haven't applied yet!",400));
    const unapply=await Contest.findByIdAndUpdate(id,{
        $pull:{
            participants:req.user._id
        }
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(201).json({
        success:true,
        message:"Un-Applied for Contest Successfully!",
        unapply
    });
});