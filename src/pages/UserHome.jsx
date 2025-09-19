import React from 'react'
import Carousel from '../components/Carousel'
import BackButton from '../components/BackButton'
import UserCategory from '../components/UserCategory'
function UserHome() {
  return (
    <>
        <div className="container-xxl py-5">
          <BackButton to="/my-profile" />
            <Carousel/>
            <UserCategory/>
        </div> 
    </>
  )
}

export default UserHome
