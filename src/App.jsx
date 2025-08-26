import React from 'react'
import "./assets/css/bootstrap.min.css";
import "./assets/css/style.css";
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Jobs from './pages/Jobs'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Services from './pages/Services'
import Privacy from './pages/Privacy';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/Jobs' element={<Jobs/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Services' element={<Services/>}/>
        <Route path='/Privacy' element={<Privacy/>}/>


      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
