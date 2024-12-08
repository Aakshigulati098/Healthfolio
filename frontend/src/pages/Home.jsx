import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    
    <div>
      <Banner/>
      <TopDoctors/>
      <Header></Header>
      <SpecialityMenu/>
    
    </div>
  )
}

export default Home