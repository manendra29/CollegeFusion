import React, { useEffect, useState } from 'react';
import './Club.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Club = () => {
  const [clubs,setClubs]=useState([]);
  const navigateTo=useNavigate();
  useEffect(() =>{
    const fetch=async()=>{
      try{
      const response=await axios.get("http://localhost:5000/api/v1/club/allclubs",{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      setClubs(response.data.clubs);
      
    }
    catch(error){
      console.log(error);
    }
    }
    fetch();
  },[])
  return(
  <div className="right-sidebar">
    <h3 className="sidebar-title">Clubs</h3>
    <div className="clubs-list">
      {clubs.map((club) => (
        <div key={club._id} className="club-item" onClick={()=>navigateTo(`/club/${club._id}`)}>
          <img className="club-avatar" src={club.clubImage?.url} alt="Club Logo" /> 
          <span className="club-name">{club.name}</span>
        </div>
      ))}
    </div>
  </div>
)
};
