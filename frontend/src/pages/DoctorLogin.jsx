import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7fafc] to-[#e2e8f0]">
      <div className="flex flex-col gap-6 items-start p-8 sm:p-12 min-w-[340px] sm:min-w-[400px] border border-[#e2e8f0] rounded-xl bg-white text-[#4A4A4A] shadow-lg">
        <p className="text-3xl font-semibold text-center text-[#16a34a]">Doctor Login</p>

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
      </div>
    </form>
  );
};

export default DoctorLogin;
