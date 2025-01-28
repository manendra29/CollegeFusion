import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import './ContestDetail.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Context } from '../../main';

export const ContestDetail = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const [applied,setApplied]=useState(false);
  const {user}=useContext(Context);



  const fetchContestDetail=async()=>{
    try {
         const response=await axios.get(`http://localhost:5000/api/v1/contest/show/${id}`,{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
    });
    setContest(response.data.contest);
    if(response.data.contest.participants.includes(user._id))
      setApplied(true);
    } catch (error) {
        console.log(error);
    }
}






  useEffect(() => {
    fetchContestDetail();
  }, [id]);

  if (!contest) return <div>Loading...</div>;

  const handleApplyButton=async()=>{
    try {
        const response=await axios.put(`http://localhost:5000/api/v1/contest/apply/${contest._id}`,{},{
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    });
    setApplied(!applied);
    toast.success("Applied successfully!");
    } catch (error) {
      console.log(error);
    }

  }


  const handleUnApplyButton=async()=>{
    try {
        const response=await axios.put(`http://localhost:5000/api/v1/contest/unapply/${contest._id}`,{},{
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    });
    setApplied(!applied);
    toast.success("UnApplied successfully!");
    } catch (error) {
      console.log(error);
    }

  }


  return (
    <Container className="contest-detail-container">
      <Paper elevation={3} className="contest-detail-paper">
        <img
          src={contest.contestPicture?.url || '/api/placeholder/800/400'}
          alt={contest.title}
          className="contest-detail-image"
        />
        <Typography variant="h4" className="contest-detail-title">
          {contest.title}
        </Typography>
        <Typography variant="body1" className="contest-detail-date">
          {contest.date}
        </Typography>
        <Typography variant="body1" className="contest-detail-description">
          {contest.description}
        </Typography>
        <a
          href={contest.contestLink}
          target="_blank"
          rel="noopener noreferrer"
          className="contest-link"
        >
          Contest Link
        </a>




        <div className="center-container">
      <button
        className={`apply-button ${applied ? "unapply" : "apply"}`}
        onClick={applied ? handleUnApplyButton : handleApplyButton}
      >
        {applied ? "UnApply" : "Apply"}
      </button>
    </div>




        <Typography variant="h5" className="leaderboard-title">
          Leaderboard
        </Typography>
        <TableContainer component={Paper} className="leaderboard-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Participant</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Time Taken</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {leaderboard.length === 0 && <h2>No Ranking Yet!</h2>}
              {leaderboard.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.participant}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                  <TableCell>{entry.timeTaken}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};