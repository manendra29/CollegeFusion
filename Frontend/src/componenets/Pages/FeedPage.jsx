import React, { useContext, useEffect, useState } from 'react';
import './FeedPage.css';
import { Header } from '../Layout/Header';
import { Sidebar } from '../Layout/Sidebar';
import { Club } from '../Feed/Club';
import { Feed } from '../Feed/Feed';
import { Context } from '../../main';
import { useNavigate } from 'react-router-dom';

const FeedPage = ({all}) => {
  const navigateTo=useNavigate();
  const {isAuthorized}=useContext(Context);
  useEffect(() =>{
    if(!isAuthorized)
      navigateTo("/login");
  },[]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="feedpage">
    <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    <Sidebar isMenuOpen={isMenuOpen} />
    <Feed  all={all} />
    <Club />
  </div>
  );
};

export default FeedPage;
