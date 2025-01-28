import mongoose from "mongoose";
import {catchAsyncError} from "../Middleware/catchAsyncError.js"
import ErrorHandler from "../Middleware/error.js"
import { Club } from "../models/clubSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/userSchema.js";
import { Post } from "../models/postSchema.js";




export const updateClub = catchAsyncError(async (req,res,next)=> {
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const checkClub = await Club.findById(id);
    if(!checkClub.clubLead.equals(req.user._id))
        return next(new ErrorHandler("You cannot update club",400));
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
    const checkClub = await Club.findById(id);
    if(!checkClub.clubLead.equals(req.user._id))
        return next(new ErrorHandler("You cannot add members to the club",400));
    const user=await User.findOne({email});
    if(checkClub.members.includes(user._id))
        return next(new ErrorHandler("User is alreay in the club",401));
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
        return next(new ErrorHandler("UserId format is invalid",400));
    const checkClub = await Club.findById(id);
    if(!checkClub.clubLead.equals(req.user._id))
        return next(new ErrorHandler("You cannot remove members from club",400));
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
    const checkClub = await Club.findById(id);
    if(!checkClub.clubLead.equals(req.user._id))
        return next(new ErrorHandler("You cannot update club",400));
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


export const createClubPost = catchAsyncError(async (req,res,next) => {
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const checkClub = await Club.findById(id);
    if(!checkClub.clubLead.equals(req.user._id))
        return next(new ErrorHandler("You cannot create post for the club",400));
    if(!req.files || Object.keys(req.files).length === 0 )
        return next(new ErrorHandler("Club Post Image is Needed",400));
     const {postImage}=req.files;
     const allowedFormart=["image/png","image/jpeg","image/webp"];
     if(!allowedFormart.includes(postImage.mimetype))
         return next(new ErrorHandler("Club Post Image format not supported",400));

    const {title,description} = req.body;
    if(!title || !description)
            return next(new ErrorHandler("Enter the title and description",400));
    const cloudinaryResponse= await cloudinary.uploader.upload(
        postImage.tempFilePath,
        {
            folder:"Post_Image"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "UnKnown Cloudinary Error Happend!");
        return next(new ErrorHandler("Failed to upload image top cloudinary",400));
    }
    const userPost = await Post.create({
        title,description,postImage:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        },
        clubId:id
    });
    res.status(201).json({
        success:true,
        message:"Club Post created",
        userPost
    });
});

export const myClubPost=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const ClubPost=await Post.find({clubId:id});
    res.status(200).json({
        success:true,
        message:"Club post fetched",
        ClubPost
    });
});

export const assignLead = catchAsyncError(async (req,res,next) => {
    const {email}=req.body;
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const club = await Club.findById(id);
    if(!club.clubMentor.includes(req.user._id))
        return next(new ErrorHandler("Only mentors can assign Lead!",400));
    const user=await User.findOne({email});
    if(!user)
        return next(new ErrorHandler("User not Found",404));
    const updatedClub=await Club.findByIdAndUpdate(id,{
        clubLead:user._id
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(201).json({
        success:true,
        message:"Club Lead Assigned!",
        updatedClub
    })
})


export const allClubs=catchAsyncError(async(req,res,next) =>{
    const clubs=await Club.find();
    res.status(201).json({
        success:true,
        message:"All clubs are fetched",
        clubs
    })
})

export const clubLeader=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const club=await Club.findById(id);
    if(!club)
        return next(new ErrorHandler("Club not found!",404));
    const clubLead=await User.findById(club.clubLead);
    res.status(201).json({
        success:true,
        message:"Club Lead Fetched",
        clubLead
    })
})

export const clubMentors=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const club=await Club.findById(id);
    if(!club)
        return next(new ErrorHandler("Club not found!",404));
    let mentors = await Promise.all(
        club.clubMentor.map(async (u) => {
            const newUser = await User.findById(u);
            return newUser; 
        })
    );

    res.status(201).json({
        success:true,
        message:"Club mentors are fetched",
        mentors
    });
})

export const allMembersOfClub=catchAsyncError(async(req,res,next) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
        return next(new ErrorHandler("Id format is invalid",400));
    const club=await Club.findById(id);
    if(!club)
        return next(new ErrorHandler("Club Not Found!",404));
    let members=await Promise.all(
    club.members.map(async(u)=>{
        const user=await User.findById(u);
        return user;
    })
    );
    res.status(201).json({
        success:true,
        message:"All members fetched",
        members
    });
})







