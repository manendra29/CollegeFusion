import React from 'react';
import { Typography, Tooltip } from '@mui/material';
import { GitHub, LinkedIn, Code } from '@mui/icons-material';
import './ProfileHeader.css';

const ProfileHeader = ({ isOwner, user, friend }) => {
  const profileData = isOwner ? user : friend;

  return (
    <div className="profile-header-container">
      <Typography variant="h4" className="profile-name">
        {profileData.username}
      </Typography>
      
      <Typography className="profile-details">
        {profileData.college}
      </Typography>

      <div className="social-links">
      
          <Tooltip 
            key={profileData._id} 
            title="Leetcode"
            arrow
            placement="top"
          >
            <a 
              href={profileData.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            
            >
              <Code />
              <span className="link-text">LeetCode</span>
            </a>
          </Tooltip>


          <Tooltip 
            key={profileData._id} 
            title="GitHib"
            arrow
            placement="top"
          >
            <a 
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            
            >
              <GitHub />
              <span className="link-text">GitHub</span>
            </a>
          </Tooltip>





          
          <Tooltip 
            key={profileData._id} 
            title="LinkedIn"
            arrow
            placement="top"
          >
            <a 
              href={profileData.LinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            
            >
              <LinkedIn />
              <span className="link-text">LinkedIn</span>
            </a>
          </Tooltip>

    
      </div>
    </div>
  );
};

export default ProfileHeader;