import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./componenets/Auth/login"
import Register from "./componenets/Auth/Register"
import FeedPage from './componenets/Pages/FeedPage';
import ProfilePage from './componenets/Pages/ProfilePage';
import FollowersList from './componenets/FollowList/FollowersList';
import ClubProfile from './componenets/Club/ClubProfile';
import { ContestList } from './componenets/Contest/ContestList';
import { ContestDetail } from './componenets/Contest/ContestDetail';
import { CreateContest } from './componenets/Contest/CreateContest';
import { EditContest } from './componenets/Contest/EditContest';
import ProfileEditor from './componenets/Profile/ProfileEditor';
import ClubProfileEditor from './componenets/Club/ClubProfileEditor';
import ClubMembersPage from './componenets/Club/ClubMembersPage';
import CreateClub from './componenets/Admin/CreateClub';
import PersonSearch from './componenets/Search/PersonSearch';


function App() {
  const all=true;
  return (
    <>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<FeedPage all={true} />} />
          <Route path="/myfeed" element={<FeedPage all={false} />} />
          <Route path="/myprofile" element={<ProfilePage isOwner={true} />} />
          <Route path="/profile/:id" element={<ProfilePage isOwner={false} />} />
          <Route path="/followers/:id" element={<FollowersList /> } />
          <Route path="/club/:id" element={<ClubProfile />} />
          <Route path="/contest/:id" element={<ContestList />} />
          <Route path="/thiscontest/:id" element={<ContestDetail />} />
          <Route path="/newcontest/:id" element={<CreateContest />} />
          <Route path="/editcontest/:clubid/:id" element={<EditContest />} />
          <Route path="/userprofileedit/:id" element={<ProfileEditor />} />
          <Route path="/clubprofileedit/:id" element={<ClubProfileEditor />} />
          <Route path="/club/allmembers/:id" element={<ClubMembersPage />} />
          <Route path="/createclub" element={<CreateClub />} />
          <Route path="/personsearch" element={<PersonSearch />} />

        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App
