import React from 'react'
import "./assets/css/bootstrap.min.css";
import "./assets/css/style.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Services from './pages/Services'
import Privacy from './pages/Privacy'
import UserHome from './pages/UserHome'
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './layouts/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import MyProfile from './pages/MyProfile';
import EditProfile from './pages/EditProfile';
import UserAbout from './pages/UserAbout';
import UserServices from './pages/UserServices';
import UserContact from './pages/UserContact';
import UserPrivacy from './pages/UserPrivacy';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />   {/* same as path="/" */}
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="services" element={<Services />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        {/* Private Route */}
        <Route element={  <ProtectedRoute>    <UserLayout />   {/* contains <UserNavbar /> + <Outlet /> */}  </ProtectedRoute>}>
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path='/edit-profile/:id' element={<EditProfile/>} />
          <Route path="/user-about" element={<UserAbout />} caseSensitive={false} />
          <Route path="/user-contact" element={<UserContact />} />
          <Route path="/user-services" element={<UserServices />} />
          <Route path="/user-privacy" element={<UserPrivacy />} />

        </Route>
      </Routes>
    </Router>
  )
}

export default App
