import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { aToken, doctors, appointments, getAllDoctors, getAllAppointments } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
      getAllAppointments()
    }
  }, [aToken])

  // Calculate statistics
  const totalEarnings = appointments.reduce((sum, app) => sum + Number(app.amount), 0)
  const completedAppointments = appointments.filter(app => app.isCompleted).length
  const upcomingAppointments = appointments.filter(app => !app.cancelled && !app.isCompleted).length
  const cancelledAppointments = appointments.filter(app => app.cancelled).length

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-full mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
          <p className="opacity-90">Here's what's happening with your clinic today.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Doctors */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <Link to="/doctor-list" className="text-blue-500 hover:text-blue-600 text-sm font-medium">View All</Link>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{doctors.length}</h3>
            <p className="text-gray-500 text-sm">Total Doctors</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-emerald-500 text-sm font-medium">+2.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">₹{totalEarnings}</h3>
            <p className="text-gray-500 text-sm">Total Earnings</p>
          </div>

          {/* Total Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <Link to="/all-appointments" className="text-purple-500 hover:text-purple-600 text-sm font-medium">View All</Link>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{appointments.length}</h3>
            <p className="text-gray-500 text-sm">Total Appointments</p>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-amber-500 text-sm font-medium">+5.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {appointments.length ? Math.round((completedAppointments / appointments.length) * 100) : 0}%
            </h3>
            <p className="text-gray-500 text-sm">Success Rate</p>
          </div>
        </div>

        {/* Appointments Overview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Appointments Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-600 font-medium">Completed</span>
                  <span className="text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg text-sm">
                    {completedAppointments}
                  </span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{width: `${(completedAppointments/appointments.length) * 100}%`}}
                  ></div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 font-medium">Upcoming</span>
                  <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-lg text-sm">
                    {upcomingAppointments}
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{width: `${(upcomingAppointments/appointments.length) * 100}%`}}
                  ></div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-600 font-medium">Cancelled</span>
                  <span className="text-red-600 bg-red-100 px-2 py-1 rounded-lg text-sm">
                    {cancelledAppointments}
                  </span>
                </div>
                <div className="w-full bg-red-100 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{width: `${(cancelledAppointments/appointments.length) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link 
                to="/add-doctor" 
                className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Add New Doctor</h3>
                  <p className="text-sm text-gray-500">Register a new doctor to the system</p>
                </div>
              </Link>

              <Link 
                to="/all-appointments" 
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">View Appointments</h3>
                  <p className="text-sm text-gray-500">Check all appointment details</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
