import React, { useContext } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginSelection from './components/LoginSelection'
import PatientLogin from './pages/PatientLogin'
import DoctorLogin from './pages/DoctorLogin'
import AdminLogin from './pages/AdminLogin'
import NavbarCommon from './components/NavbarCommon'
import Sidebar from './components/Sidebar'
import AllAppointments from './pages/Admin/AllAppointments'
import Dashboard from './pages/Admin/Dashboard'
import DoctorsList from './pages/Admin/DoctorsList'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointment from './pages/Doctor/DoctorAppointment'
import DoctorProfile from './pages/Doctor/DoctorProfile'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const location = useLocation()

  // Check if we're on any of the login pages where Navbar and Footer should not be displayed
  const isLoginPage = ['/login-selection', '/patient-login', '/doctor-login', '/admin-login'].includes(location.pathname)

  return aToken || dToken ? (
    // Admin or Doctor Logged In
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <NavbarCommon />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />

          {/* Doctor routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointment />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    // Not Logged In
    <div className="max-4 sm:mx-[10%]">
      <ToastContainer />
      {!isLoginPage && <Navbar />} {/* Only render Navbar if it's not a login page */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
      {!isLoginPage && <Footer />} {/* Only render Footer if it's not a login page */}
    </div>
  )
}

export default App
