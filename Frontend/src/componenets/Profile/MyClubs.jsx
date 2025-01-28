import React, { useContext, useEffect, useState } from 'react';
import './MyClubs.css'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,

} from '@mui/material';

import axios from "axios";
import { useParams } from 'react-router-dom';



const MyClubs = ({isOwner}) => {
  const {id}=useParams();

      const [clubs,setClubs]=useState([]);
      const myClub=async()=>{
        const response=await axios.get("http://localhost:5000/api/v1/user/myclub",{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        });
        setClubs(response.data.clubs);
    }

    const friendClub=async()=>{
      const response=await axios.get(`http://localhost:5000/api/v1/user/friendclub/${id}`,{
          withCredentials:true,
          headers:{
              "Content-Type":"application/json"
          }
      });
      setClubs(response.data.clubs);
  }
  
  useEffect(() =>{
      try {
        if(isOwner)
          myClub();
        else
        friendClub();
      } catch (error) {
          console.log(error);
      }
  },[]);


  return (
    <div>
      
      <Box className="clubs-section">
          <Typography variant="h5" gutterBottom>
            Clubs
          </Typography>
          <Box className="clubs-grid">
          {clubs.length===0 && <h3>No Club is There</h3>}
            {clubs.map((club, index) => (
              <Card key={index} className="club-card">
                <CardMedia
                  component="img"
                  image={club.clubImage?.url}
                  alt={club.name}
                  className="club-image"
                />
                <CardContent>
                  <Typography variant="h6" align="center">
                    {club.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
    </div>
  )
}

export default MyClubs
