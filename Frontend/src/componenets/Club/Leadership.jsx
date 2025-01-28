import React, { useEffect, useState } from 'react';
import './Leadership.css';
import axios from 'axios';

const Leadership = ({ id }) => {
const [leader,setLeader]=useState({});
const [mentors,setMentors]=useState([]);
  useEffect(() =>{
    try {
    const fetch=async()=>{
      const response=await axios.get(`http://localhost:5000/api/v1/club/clublead/${id}`,{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      setLeader(response.data.clubLead);
    }
    const fetchMentors=async()=>{
      const response=await axios.get(`http://localhost:5000/api/v1/club/clubmentors/${id}`,{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      setMentors(response.data.mentors);
    }
    fetch();
    fetchMentors();
       
  } catch (error) {
      console.log(error);
  }

  },[]);

  return (
    <div className="leadership-section">
      <h2>Club Leadership</h2>
      {leader===null ? <div style={{ display:"flex",justifyContent:"center",textAlign:"center"}}><h1>No Leader Assigned Yet!</h1></div> :
      <div className="leadership-cards">
        <div className="leader-card">
          <img src={leader.profilePicture?.url} alt={leader.username} />
          <h3>{leader.username}</h3>
          <p>Club Leader</p>
        </div>
        <div className="mentors-container">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="mentor-card">
              <img src={mentor.profilePicture?.url} alt={mentor.username} />
              <h3>{mentor.username}</h3>
              <p>Club Mentor</p>
            </div>
          ))}
        </div>
      </div>
      }
    </div>
  );
};

export default Leadership;