import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext)
  const{calculateAge, slotDateFormat, currency} = useContext(AppContext)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(()=>{
    if(aToken) getAllAppointments()
  },[aToken])

  const filteredAppointments = appointments.filter(app => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'completed') return app.isCompleted;
    if (filterStatus === 'cancelled') return app.cancelled;
    if (filterStatus === 'upcoming') return !app.cancelled && !app.isCompleted;
    return true;
  });

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-emerald-50 to-teal-50 p-8'>
      <div className='w-full'>
        {/* Header Section with Stats */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-6'>Appointments Overview</h1>
          
          {/* Stats Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <div className='text-emerald-500 mb-2'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className='text-sm text-gray-600'>Total Appointments</p>
              <h3 className='text-2xl font-bold text-gray-800'>{appointments.length}</h3>
            </div>
            
            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <div className='text-emerald-500 mb-2'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className='text-sm text-gray-600'>Completed</p>
              <h3 className='text-2xl font-bold text-gray-800'>
                {appointments.filter(app => app.isCompleted).length}
              </h3>
            </div>

            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <div className='text-emerald-500 mb-2'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className='text-sm text-gray-600'>Upcoming</p>
              <h3 className='text-2xl font-bold text-gray-800'>
                {appointments.filter(app => !app.cancelled && !app.isCompleted).length}
              </h3>
            </div>

            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <div className='text-emerald-500 mb-2'>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className='text-sm text-gray-600'>Cancelled</p>
              <h3 className='text-2xl font-bold text-gray-800'>
                {appointments.filter(app => app.cancelled).length}
              </h3>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className='flex flex-wrap gap-2 mb-6'>
            {['all', 'upcoming', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors
                  ${filterStatus === status 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-emerald-50'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {filteredAppointments.map((item, index) => (
            <div key={index} className='bg-white rounded-2xl shadow-sm overflow-hidden'>
              {/* Appointment Status Banner */}
              <div className={`px-6 py-3 ${
                item.cancelled 
                  ? 'bg-red-50 text-red-700' 
                  : item.isCompleted 
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-blue-50 text-blue-700'
              }`}>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'}
                  </span>
                  <span className='text-sm'>#{index + 1}</span>
                </div>
              </div>

              <div className='p-6'>
                {/* Date & Time */}
                <div className='flex items-center gap-2 mb-4'>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{slotDateFormat(item.slotDate)}</p>
                    <p className='text-xs text-emerald-600'>{item.slotTime}</p>
                  </div>
                </div>

                {/* Patient Info */}
                <div className='flex items-center gap-4 mb-4 pb-4 border-b border-gray-100'>
                  <img 
                    src={item.userData.image} 
                    alt={item.userData.name}
                    className='w-12 h-12 rounded-full object-cover border-2 border-emerald-100'
                  />
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{item.userData.name}</p>
                    <p className='text-xs text-gray-500'>Age: {calculateAge(item.userData.dob)}</p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className='flex items-center gap-4 mb-4'>
                  <img 
                    src={item.docData.image} 
                    alt={item.docData.name}
                    className='w-12 h-12 rounded-full object-cover border-2 border-emerald-100'
                  />
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{item.docData.name}</p>
                    <p className='text-xs text-gray-500'>{item.docData.speciality}</p>
                  </div>
                </div>

                {/* Fee & Action */}
                <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
                  <div className='text-sm font-medium text-gray-800'>
                    Fee: <span className='text-emerald-600'>{currency}{item.amount}</span>
                  </div>
                  
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors'
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className='bg-white rounded-2xl shadow-sm p-8 text-center'>
            <div className='w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center'>
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900'>No appointments found</h3>
            <p className='text-gray-500 mt-2'>No appointments match your current filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllAppointments