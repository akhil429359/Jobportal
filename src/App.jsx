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
import JobPost from './pages/JobPosts';
import JobList from './pages/JobList';
import Userslist from './pages/Userslist';
import ChatWindows from './pages/ChatWindows';
import UserDetails from './pages/UserDetails';
import GroupChatsPage from './pages/GroupChatsPage';
import GroupDetails from './pages/GroupDetails';
import GroupList from './pages/GroupList';
import EditJobPage from './pages/EditJobPage';
import EmployerJobPosts from './components/EmployerJobPosts';
import EmployerApplication from './pages/EmployerApplication';
import NotifyJobAppDetail from './pages/NotifyJobAppDetail';
import Connections from './pages/Connections';
import JobApply from './pages/JobApply';
const currentUserId = parseInt(localStorage.getItem("user_id"));

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />  
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="services" element={<Services />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        {/* Private Route */}
        <Route element={  <ProtectedRoute>    <UserLayout /></ProtectedRoute>}>
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path='/edit-profile/:id' element={<EditProfile/>} />
          <Route path="/user-about" element={<UserAbout />} />
          <Route path="/user-contact" element={<UserContact />} />
          <Route path="/user-services" element={<UserServices />} />
          <Route path="/user-privacy" element={<UserPrivacy />} />
          <Route path='/job-post' element={<JobPost/>} />
          <Route path='/job-list' element={<JobList/>} />
          <Route path="/jobs/:jobId/apply" element={<JobApply />} />
          <Route path='/user-list' element={<Userslist/>} />
          <Route path="/chat/:userId" element={<ChatWindows />} />
          <Route path="/profile/:id" element={<UserDetails/>} />
          <Route path="/groups-list" element={<GroupList/>} />
          <Route path="/groups/:id" element={<GroupDetails/>} />
          <Route path="/group-chat/:id" element={<GroupChatsPage currentUserId={currentUserId} />}/>
          <Route path="/jobs-edit/:id" element={<EditJobPage />} />
          <Route path="/my-jobs" element={<EmployerJobPosts />} />
          <Route path="/employer-applications/:jobId" element={<EmployerApplication />} />
          <Route path="/applications/:id" element={<NotifyJobAppDetail />} />
          <Route path="/connections" element={<Connections />} />



        </Route>
      </Routes>
    </Router>
  )
}

export default App
