import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Replace with your actual logo path

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setDToken, backendUrl } = useContext(DoctorContext);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });
      if (data.success) {
        localStorage.setItem('dToken', data.token);
        setDToken(data.token);
        navigate('/doctor-dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <form onSubmit={onSubmitHandler} className="w-full max-w-md p-8 sm:p-12 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 space-y-6">
        {/* Logo Section */}
        <div className="w-full text-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mx-auto mb-4" />
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Doctor Login</h1>
          <p className="text-gray-600">Welcome back! Please enter your details.</p>
        </div>

        {/* Email Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full p-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              type="email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full p-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                type={showPassword ? 'text' : 'password'}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 text-sm hover:text-green-800 transition-all"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all active:scale-95 focus:outline-none"
        >
          Sign In
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate('/login-selection')}
          className="absolute top-4 left-4 text-green-600 hover:text-green-800 flex items-center gap-2 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </form>
    </div>
  );
};

export default DoctorLogin;
