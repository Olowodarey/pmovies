import React from 'react'
import Trending from './_component/Trending'
import Upcoming from "@/app/_component/Upcoming"
import Series from './_component/Series'
import "./globals.css";

const page = () => {
  return (
    <div className='px-5 lg:px-7'>
      

      <Trending />
      <Upcoming />
      <Series />
    
 
    </div>
  )
}

export default page
