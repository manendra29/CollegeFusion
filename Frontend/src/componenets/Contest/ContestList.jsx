import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Grid2 } from '@mui/material';
import { ContestCard } from './ContestCard';
import './ContestList.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const ContestList = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [isOwner,setIsOwner]=useState(false);
  const {id}=useParams();
  



const fetchUpcomingContest=async()=>{
    try {
         const response=await axios.get(`http://localhost:5000/api/v1/contest/upcoming/${id}`,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    setUpcomingContests(response.data.contests);
    } catch (error) {
        console.log(error);
    }
}

const fetchPastContest=async ()=>{
    try {
         const response=await axios.get(`http://localhost:5000/api/v1/contest/completed/${id}`,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    setPastContests(response.data.contests);
    } catch (error) {
        console.log(error);
    }
   
}


  useEffect(() => {
   fetchUpcomingContest();
   fetchPastContest();
  }, []);

  return (
    
    <Container className="contest-list-container">
      <Typography variant="h4" className="section-title">
        Upcoming Contests
      </Typography>
      <Grid2 container spacing={3} className="contests-grid">
      {upcomingContests.length === 0 && <h2>No UpComing Contest</h2>}
        {upcomingContests.map((contest) => (
          <Grid2 item xs={12} sm={6} md={4} key={contest._id}>
          {contest.clubLead}
            <ContestCard contest={contest} clubId={id} />
          </Grid2>
        ))}
      </Grid2>

      <Typography variant="h4" className="section-title">
        Past Contests
      </Typography>
      <Grid2 container spacing={3} className="contests-grid">
      {pastContests.length === 0 && <h2>No Past Contests</h2>}
        {pastContests.map(contest => (
          <Grid2 item xs={12} sm={6} md={4} key={contest._id}>
            <ContestCard contest={contest} />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};