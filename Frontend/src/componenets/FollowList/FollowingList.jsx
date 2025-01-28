import React from 'react';
import { 
  Button, 
  Typography, 
  Paper,
  Box
} from '@mui/material';
import './FollowersList.css';

const FollowingList = ({ following }) => {
  return (
    <div className="user-list-container">
      <Typography variant="h5" className="list-header">
        Following
      </Typography>
      
      <div className="user-list">
        {following?.map((user) => (
          <Paper 
            key={user.id} 
            className="user-card"
            elevation={0}
          >
            <div className="user-info">
              <div className="profile-picture">
                <img
                  src={user.profilePicture || "/api/placeholder/48/48"}
                  alt={`${user.name}'s profile`}
                />
              </div>
              <div className="user-details">
                <Typography className="user-name">
                  {user.name}
                </Typography>
                <Typography className="username">
                  @{user.username}
                </Typography>
              </div>
            </div>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={() => console.log(`Unfollow ${user.id}`)}
              sx={{ minWidth: 100 }}
            >
              Unfollow
            </Button>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default FollowingList;