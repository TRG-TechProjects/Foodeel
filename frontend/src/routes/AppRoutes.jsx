import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import UserRegister from '../pages/auth/UserRegister'
import UserLogin from '../pages/auth/UserLogin'
import PartnerRegister from '../pages/auth/PartnerRegister'
import PartnerLogin from '../pages/auth/PartnerLogin'
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<PartnerRegister />} />
        <Route path="/food-partner/login" element={<PartnerLogin />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/:id" element={<Profile />} />
        <Route path="/saved" element={<Saved />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes