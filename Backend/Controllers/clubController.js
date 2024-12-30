import mongoose from "mongoose";
import {catchAsyncError} from "../Middleware/catchAsyncError.js"
import ErrorHandler from "../Middleware/error.js"
import { Club } from "../models/clubSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/userSchema.js";


export const createClub=catchAsyncError(async(req,res,next) =>{
    if(!req.files || Object.keys(req.files).length === 0 )
        return next(new ErrorHandler("Club Picture is Needed",400));
     const {clubImage}=req.files;
     const allowedFormart=["image/png","image/jpeg","image/webp"];
     if(!allowedFormart.includes(clubImage.mimetype))
         return next(new ErrorHandler("Club Picture format not supported",400));

    const {name,email,phone,category,description}=req.body;
    if(!name || !email || !phone || !category || !description)
        return next(new ErrorHandler("Please Enter all details",400));

    const cloudinaryResponse= await cloudinary.uploader.upload(
        clubImage.tempFilePath,
        {
            folder:"Club_Image"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
        return next(new ErrorHandler("Failed to upload image top cloudinary",400));
    }
    const club=await Club.create({
        name,description,email,phone,category,clubImage:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    });
    res.status(200).json({
        success:true,
        message:"Club created successfully",
        club
    });
});

export const updateClub = catchAsyncError(async (req,res,next)=> {
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const club=await Club.findByIdAndUpdate(id,req.body,{
        new :true,
        runValidators :true,
        useFindAndModify :false
    });
    res.status(201).json({
        success:true,
        message:"Data Updated",
        club
    });
})

export const deleteClub = catchAsyncError(async (req,res,next)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const club=await Club.findById(id);
    if(!club)
        return next(new ErrorHandler("Club not Found",404));

    const deletedClub=await Club.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"Club Deleted Successfully",
        deletedClub
    })
})

export const showClub = catchAsyncError(async (req,res,next) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const club = await Club.findById(id);
    if(!club)
        return next(new ErrorHandler("Club not Found",404));
    res.status(201).json({
        success:true,
        message:"Club Fetched!",
        club
    });
});

export const addMember=catchAsyncError(async(req,res,next) =>{
    const {email}=req.body;
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const user=await User.find({email});
    if(!user)
        return next(new ErrorHandler("User not Found",404));

    const updatedData=await Club.findByIdAndUpdate(id,{
        $push:{
            members:user._id
        }
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(201).json({
        success:true,
        message:"Member Added Successfully",
        updatedData
    });
});

export const removeMember=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    const {userId}=req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    if(!mongoose.Types.ObjectId.isValid(userId))
        return next(new ErrorHandler("Id format is invalid",400));
    const user=await User.findById(userId);
    if(!user)
        return next(new ErrorHandler("User not Found",404));

    const updatedData=await Club.findByIdAndUpdate(id,{
        $pull:{
            members:userId
        }
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(201).json({
        success:true,
        message:"Member removed Successfully",
        updatedData
    });
});

export const changeDp=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    if(!req.files || Object.keys(req.files).length === 0 )
        return next(new ErrorHandler("Club Picture is Needed",400));
     const {clubImage}=req.files;
     const allowedFormart=["image/png","image/jpeg","image/webp"];
     if(!allowedFormart.includes(clubImage.mimetype))
         return next(new ErrorHandler("Club Picture format not supported",400));

     const cloudinaryResponse= await cloudinary.uploader.upload(
        clubImage.tempFilePath,
        {
            folder:"Club_Image"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
        return next(new ErrorHandler("Failed to upload image top cloudinary",400));
    }
    const filter={_id:id};
    const data = {
        $set: {
          clubImage:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }
        }
      };
    const updatedImage=await Club.updateOne(filter,data);
    res.status(201).json({
        success:true,
        message:"Club Image Updated Successfully",
        updatedImage
    })
})







