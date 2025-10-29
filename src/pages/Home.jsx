import React from 'react'
import Category from '../components/Category'
import Carousel from '../components/Carousel'
function Home() {
  return (
    <>
    <div className="container-xxl py-5">
    <Carousel/>
    <Category/>
    </div>
    </>
  )
}

export default Home
