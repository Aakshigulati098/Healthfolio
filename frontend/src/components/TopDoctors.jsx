
import React, { useContext } from 'react'

import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)
  return (
    <div className='flex flex-col items-center gap-6 my-20 text-gray-800 md:mx-12'>
        <h1 className='text-4xl font-semibold text-green-900'>Top Doctors to Book</h1>
        <p className='sm:w-2/5 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
        <div className='w-full  grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {doctors.slice(0,10).map((item,index)=>(
               <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}}    className='border border-primary rounded-md overflow-hidden cursor-pointer hover:translate-y-[-5px] hover:shadow-xl shadow-md transition-all duration-300'key={index}>
                <img className='bg-green-50 ' src={item.image} alt="" />
                <div className='p-4 '>
                    <div className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-500" : "text-gray-500"}`}>
                        <div className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-500"}`}></div>
                        <p>{item.available ? "Available" : "Not Available"}</p>
                    </div>
                    <p className='text-gray-900 text-md font-bold'>{item.name}</p>
                    <p className='text-gray-600 text-sm font-semibold'>{item.speciality}</p>
                </div>
               </div>
            ))}
        </div>
        <button onClick={()=>{navigate('/doctors');scrollTo(0,0)}} className='font-semibold bg-green-200 text-gray-600 px-12 py-3 rounded-md mt-10'>more</button>
    </div>
  )
}

export default TopDoctors