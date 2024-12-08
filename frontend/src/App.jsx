import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { useContext } from 'react'
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
import { AdminContext } from './context/AdminContext';
import NavbarCommon from './components/NavbarCommon';
import Sidebar from './components/Sidebar';
import AllAppointments from './pages/Admin/AllAppointments';
import Dashboard from './pages/Admin/Dashboard';
import DoctorsList from './pages/Admin/DoctorsList';
import AddDoctor from './pages/Admin/AddDoctor';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const {aToken} = useContext(AdminContext)
  const{dToken}=useContext(DoctorContext)
  
  return aToken || dToken ? 
   (
   <div className='bg-[#F8F9FD]'>
     <ToastContainer/>
     <NavbarCommon/>
     <div className='flex items-start'>
      <Sidebar/>
      <Routes>
        {/* Admin route */}
        <Route path='/' element ={<></>}></Route>
        <Route path='/admin-dashboard' element={<Dashboard/>}></Route>
        <Route path='/all-appointments' element={<AllAppointments/>}></Route>
        <Route path='/add-doctor' element={<AddDoctor/>}></Route>
        <Route path='/doctor-list' element={<DoctorsList/>}></Route>

        {/* doctor route */}
        <Route path='/doctor-dashboard' element={<DoctorDashboard/>}></Route>
        <Route path='/doctor-appointments' element={<DoctorAppointment/>}></Route>
        <Route path='/doctor-profile' element={<DoctorProfile/>}></Route>
      </Routes>
     </div>
  </div>
  ): 
  (
    <div className='max-4 sm:mx-[10%]'>
      <ToastContainer/>
    <Navbar/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/doctors' element={<Doctors/>}/>
      <Route path='/doctors/:speciality' element={<Doctors/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/my-profile' element={<MyProfile/>}/>
      <Route path='/my-appointments' element={<MyAppointments/>}/>
      <Route path='/appointment/:docId' element={<Appointment/>}/>
      </Routes>
      <Footer/> 
    </div>
  )
}

export default App

