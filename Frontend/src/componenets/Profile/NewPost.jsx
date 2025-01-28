import React from 'react'
import "./NewPost.css";

import  { useContext, useEffect, useState } from 'react';
import {Context} from "../../main"
import { 
  Typography,
  Button,
  TextField,
  Paper
} from '@mui/material';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NewPost = ({isOwner,clubs}) => {

    //   const [posts,setPosts]=useState([]);
    //   const navigateTo=useNavigate();
  
  
      const [formData,setFormData]=useState({
          title:"",
          desc:"",
          file:null
      });
  
      const handleFileChange = (e) => {
          setFormData({
            ...formData,
            file: e.target.files[0],
          });
        };

    const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        };
  
  
  const handlePostButton=async()=>{
    if(clubs){
      try {
        const response=await axios.post(`http://localhost:5000/api/v1/club/createclubpost/${clubs._id}`,{
            title:formData.title,
            description:formData.desc,
            postImage:formData.file
        },{
            withCredentials:true,
            headers:{
                "Content-Type":"multipart/form-data"
            }
        });
        toast.success("Post has been posted successfully");
        console.log("Post has been posted successfully");
    } catch (error) {
        console.log(error);
    }
    }
    else{
      try {
          const response=await axios.post("http://localhost:5000/api/v1/post/createpost",{
              title:formData.title,
              description:formData.desc,
              postImage:formData.file
          },{
              withCredentials:true,
              headers:{
                  "Content-Type":"multipart/form-data"
              }
          });
          toast.success("Post has been posted successfully");
          console.log("Post has been posted successfully");
      } catch (error) {
          console.log(error);
      }
    }
  }
 

  return (
    <div>
       {isOwner && (
        <Paper className="new-post-section">
          <Typography variant="h5" gutterBottom>
            Create New Post
          </Typography>
          <TextField
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleChange}
            variant="outlined"
            placeholder="Post Title"
            className="post-input"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Write your post description..."
            className="post-input post-textarea"
            sx={{ mb: 2 }}
          />
          <input
        
            name="file"
            sx={{ height: '100px', mb: 2 }}
            type="file"
            onChange={handleFileChange}
           
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePostButton}
          >
            Post
          </Button>
        </Paper>
      )}

    </div>
  )
}

export default NewPost
