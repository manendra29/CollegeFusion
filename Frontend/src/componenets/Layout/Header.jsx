
import React, { useContext, useState } from 'react';
import { Home, Search, MessageCircle, Heart, LogOut, Menu } from 'lucide-react';
import './Header.css';
import { Sidebar } from './Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';



export const Header = ({ isMenuOpen, setIsMenuOpen }) => {  
  const {isAuthorized,setIsAuthorized,setUser} =useContext(Context);
  

  const navigateTo=useNavigate();
  const handleLogout=async()=>{
    try {
      await axios.get("",{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      toast.success("logout successfully !");
      setIsAuthorized(false);
      setUser({});
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
   return(
  <>
  <header className="header">
    <div className="logo">Logo</div>
    <div className="nav-icons">
      <Home className="icon" />
      <Search className="icon" />
      <MessageCircle className="icon" />
      <Heart className="icon" />
      <LogOut className="icon" onClick={handleLogout} />
    </div>
    <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
  <Menu className="icon" />
  <Sidebar isMenuOpen={isMenuOpen} />
</button>
  </header>
    
  </>)
};