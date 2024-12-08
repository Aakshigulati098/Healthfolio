import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const {doctors, aToken, getAllDoctors, changeAvailability} = useContext(AdminContext)
  
  useEffect(()=>{
    if(aToken) {
      getAllDoctors()
    }
  },[aToken])
  
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Doctors Directory</h1>
          <p className='text-gray-600 mt-2'>Manage and view all registered doctors</p>
        </div>

        {/* Doctors Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {doctors.map((doctor, index) => (
            <div 
              key={index}
              className='bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300'
            >
              {/* Doctor Image */}
              <div className='relative h-48 overflow-hidden'>
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                />
                <div className='absolute top-4 right-4'>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doctor.available 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className='p-5'>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>{doctor.name}</h3>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='inline-block bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full'>
                    {doctor.speciality}
                  </span>
                </div>

                {/* Additional Info */}
                <div className='space-y-2'>
                  <div className='flex items-center text-gray-600'>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className='text-sm'>Experience: {doctor.experience}</span>
                  </div>
                  <div className='flex items-center text-gray-600'>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className='text-sm'>Fee: ₹{doctor.fees}</span>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className='mt-4 flex items-center justify-between'>
                  <label className='flex items-center cursor-pointer'>
                    <div className='relative'>
                      <input
                        type='checkbox'
                        className='sr-only'
                        checked={doctor.available}
                        onChange={() => changeAvailability(doctor._id)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${
                        doctor.available ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                        doctor.available ? 'transform translate-x-4' : ''
                      }`}></div>
                    </div>
                    <span className='ml-3 text-sm font-medium text-gray-700'>
                      Toggle Availability
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900'>No doctors found</h3>
            <p className='text-gray-500 mt-2'>Start by adding some doctors to your directory.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsList