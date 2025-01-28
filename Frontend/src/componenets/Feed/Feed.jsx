import React, { useContext, useEffect, useState } from 'react';
import './Feed.css';
import Post from '../Post/Post';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';

export const Feed = ({all}) => {
  const [posts,setPost]=useState([]);
  const {isAuthorized}=useContext(Context);
  const navigateTo=useNavigate();
  
  
  useEffect( () =>{
    if(!isAuthorized)
      navigateTo("/login");
    const allFeed=async()=>{
      try{
        const response=await axios.get("http://localhost:5000/api/v1/user/feed",{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      setPost(response.data.posts);
    }
    catch(error){
      console.log(error);
    }
    }

    const followingFeed=async()=>{
      try{
        const response=await axios.get("http://localhost:5000/api/v1/user/myfeed",{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      setPost(response.data.posts);
      console.log(isAuthorized);
    }
    catch(error){
      console.log(error);
    }
    }
    if(all==true)
      allFeed();
    else
    followingFeed();
  },[all])

  return (
  <div className="feed">
  {posts.length===0 && <h1 style={{display:"flex",justifyContent:"center",alignItems:"center",height:"70vh"}}>No Post Availabel !</h1>}
    {posts.map(post => (
      <Post key={post._id} post={post} />
    ))}
  </div>
)};
