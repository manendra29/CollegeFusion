import React, { useState, useEffect, useContext } from 'react';
import { 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Paper, 
  Container, 
  Typography 
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import './PersonSearch.css';
import axios from 'axios';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';


const PersonSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([{}]);
  const {isAuthorized}=useContext(Context);
  const [hasFetched,setHasFetched]=useState(false);
    const naviagteTo=useNavigate();

  useEffect(() => {
    if (searchTerm==="") { 
        setSearchResults([{}]);
        return;
      }
    try {
        const fetch=async()=>{
    const response=await axios.get(`http://localhost:5000/api/v1/user/searchperson`,{
        params:{
            name:searchTerm
        }
    }
)
setSearchResults(response.data.users);
   }  
   fetch();
    } catch (error) {
        console.log(error);
    }
 
  },[searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container className="person-search-container">
      <Paper elevation={3} className="search-paper">
        <Typography 
          variant="h4" 
          component="h1" 
          className="search-title"
        >
          Person Search
        </Typography>
        
        <div className="search-input-container">
          <SearchIcon className="search-icon" />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search people..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            InputProps={{
              className: 'input-base'
            }}
          />
        </div>

        {searchResults.length>0 && (
          <List className="search-results-list">
            {searchResults.map((person) => (
              <ListItem key={person._id} className="search-result-item" style={{cursor:"pointer"}}>
                <ListItemAvatar>
                  <Avatar 
                    alt={person.username} 
                    src={person.profilePicture?.url} 
                    className="search-avatar"
                    onClick={() => naviagteTo(`/profile/person._id`)}
                  />
                </ListItemAvatar>
                <ListItemText onClick={() => naviagteTo(`/profile/${person._id}`)} primary={person.username} />
              </ListItem>
        ))}
          </List>
        )}

        {searchTerm && searchResults.length === 0 && (
          <Typography 
            variant="body2" 
            className="no-results-text"
          >
            No matching people found
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default PersonSearch;