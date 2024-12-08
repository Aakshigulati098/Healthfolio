import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // State to track current login type (User, Admin, Doctor)
  const [state, setState] = useState('User');
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // Context to manage auth tokens for Admin and Doctor
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  // Login handler
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Define API endpoint based on user role
    let endpoint = '';
    let role = '';

    if (state === 'Admin') {
      endpoint = '/api/admin/login';
      role = 'Admin';
    } else if (state === 'Doctor') {
      endpoint = '/api/doctor/login';
      role = 'Doctor';
    } else {
      // Add logic for User login if needed
      endpoint = '/api/user/login';
      role = 'User';
    }

    try {
      // Send login request
      const { data } = await axios.post(backendUrl + endpoint, { email, password });
      
      if (data.success) {
        // Store token and navigate based on role
        if (role === 'Admin') {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          navigate('/admin-dashboard');
        } else if (role === 'Doctor') {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          navigate('/doctor-dashboard');
        } else {
          // User login logic here, e.g., for a patient
          localStorage.setItem('uToken', data.token);
          navigate('/user-dashboard');  // Redirect to user dashboard
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7fafc] to-[#e2e8f0]">
      <div className="flex flex-col gap-6 items-start p-8 sm:p-12 min-w-[340px] sm:min-w-[400px] border border-[#e2e8f0] rounded-xl bg-white text-[#4A4A4A] shadow-lg">
        <p className="text-3xl font-semibold text-center text-[#16a34a]">
          {state} Login
        </p>

        <div className="w-full">
          <label htmlFor="email" className="text-sm font-medium text-[#333]">Email</label>
          <input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded-lg w-full p-4 mt-2 text-base focus:outline-none focus:ring-2 focus:ring-[#16a34a] transition"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <label htmlFor="password" className="text-sm font-medium text-[#333]">Password</label>
          <div className="relative">
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#DADADA] rounded-lg w-full p-4 mt-2 text-base focus:outline-none focus:ring-2 focus:ring-[#16a34a] transition"
              type={showPassword ? 'text' : 'password'}
              required
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#16a34a] text-sm"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#16a34a] text-white w-full py-3 rounded-lg text-lg font-semibold transition transform hover:bg-[#15803d] hover:scale-105 focus:outline-none"
        >
          Login
        </button>

        {/* <div className="text-center">
          {state === 'Admin' ? (
            <p>
              Doctor Login?{' '}
              <span
                className="text-[#16a34a] underline cursor-pointer"
                onClick={() => setState('Doctor')}
              >
                Click here
              </span>
            </p>
          ) : state === 'Doctor' ? (
            <p>
              Admin Login?{' '}
              <span
                className="text-[#16a34a] underline cursor-pointer"
                onClick={() => setState('Admin')}
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Admin or Doctor Login?{' '}
              <span
                className="text-[#16a34a] underline cursor-pointer"
                onClick={() => setState('Admin')}
              >
                Click here for Admin
              </span>{' '}
              |{' '}
              <span
                className="text-[#16a34a] underline cursor-pointer"
                onClick={() => setState('Doctor')}
              >
                Click here for Doctor
              </span>
            </p>
          )}
        </div> */}
      </div>
    </form>
  );
};

export default Login;
