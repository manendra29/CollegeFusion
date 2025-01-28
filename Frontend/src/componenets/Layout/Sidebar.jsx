import React, { useContext, useEffect, useState } from 'react';
import { Home, Search, MessageCircle, PlusSquare } from 'lucide-react';
import './Sidebar.css';
import { Feed } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import axios from 'axios';

export const Sidebar = ({ isMenuOpen }) => {
  const { user } = useContext(Context);
  const [isAdmin,setIsAdmin]=useState(false);
  const navigateTo = useNavigate();

  useEffect(() =>{
    if(user.role==="Admin")
      setIsAdmin(true);
  },[])

  return (
    <div className={`left-sidebar ${isMenuOpen ? 'active' : ''}`}>
      <div className="sidebar-content">
        <NavItem icon={<Home />} label="Home" onClick={() => navigateTo("/")} />
        <NavItem icon={<Feed />} label="MyFeed" onClick={() => navigateTo("/myfeed")} />
        <NavItem icon={<Search />} label="Search" onClick={() => navigateTo("/personsearch")} />
       {isAdmin && <NavItem icon={<Groups2SharpIcon />} label="Create Club" onClick={() => navigateTo("/createclub")} /> }
        <NavItem icon={<PlusSquare />} label="Create" onClick={() => navigateTo("/create")} />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, onClick }) => (
  <div
    className="nav-item"
    onClick={onClick}
    style={{ cursor: 'pointer' }} // Add cursor styling for clickable items
  >
    {icon}
    <span className="nav-label">{label}</span>
  </div>
);
