import mongoose from "mongoose";
import { catchAsyncError } from "../Middleware/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../Middleware/error.js";
import { Club } from "../models/clubSchema.js";
import { v2 as cloudinary } from "cloudinary";


export const deleteUser = catchAsyncError(async (req,res,next) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const deletedUser=await User.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"User Deleted!",
        deletedUser
    });
})

export const deleteClub=catchAsyncError(async (req,res,next) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const club=await Club.findByIdAndDelete(id);
    res.status(201).json({
        success:true,
        message:"Club deleted!",
        club
    });
});

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

export const assignMentor=catchAsyncError(async(req,res,next) =>{
    const {email}=req.body;
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const user=await User.findOne({email});
    console.log(user);
    if(!user)
        return next(new ErrorHandler("User not Found",404));
    console.log(email)
    const updatedData=await Club.findByIdAndUpdate(id,{
        $push:{
            clubMentor:user._id
        }
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(201).json({
        success:true,
        message:"Mentor Assigned Successfully",
        updatedData
    });
});
