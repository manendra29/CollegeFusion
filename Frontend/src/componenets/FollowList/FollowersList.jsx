import React from 'react';
import { 
  Button, 
  Typography, 
  Paper,
  Box
} from '@mui/material';
import './FollowersList.css';

const FollowersList = ({ followers }) => {
    console.log(followers);
  return (
    <div className="user-list-container">
      <Typography variant="h5" className="list-header">
        Followers
      </Typography>
      
      <div className="user-list">
      {followers.length === 0 &&<h1>No Followers</h1>}
        {followers.map((follower) => (
          <Paper 
            key={follower._id} 
            className="user-card"
            elevation={0}
          >
            <div className="user-info">
              <div className="profile-picture-list">
                <img
                  src={follower.profilePicture || "/api/placeholder/48/48"}
                  alt={`${follower.username}'s profile`}
                />
              </div>
              <div className="user-details">
                <Typography className="user-name">
                  {follower.username}
                </Typography>
                {/* <Typography className="username">
                  @{follower.username}
                </Typography> */}
              </div>
            </div>
            
            <Button
              variant={follower.isFollowing ? "outlined" : "contained"}
              color="primary"
              onClick={() => console.log(`Toggle follow for ${follower._id}`)}
              sx={{ minWidth: 100 }}
            >
              {follower.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default FollowersList;