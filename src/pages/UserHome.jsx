import React from 'react'
import Search from '../components/Search'
import Category from '../components/Category'
import Carousel from '../components/Carousel'
function UserHome() {
  return (
    <>
        <div className="container-xxl py-5">

            <Carousel/>
            <Search/>
            <Category/>
        </div> 
    </>
  )
}

export default UserHome
