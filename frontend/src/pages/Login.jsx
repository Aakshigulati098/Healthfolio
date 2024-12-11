import React, { useState, useContext, useEffect } from 'react';
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

  // State for errors and live feedback
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [liveFeedback, setLiveFeedback] = useState('');

  // Debounce timeout reference
  let debounceTimeout;

  // Validation functions
  const validateEmail = (email) => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password.length > 50) {
      return 'Password cannot exceed 50 characters';
    }
    return '';
  };

  // Real-time validation effect
  useEffect(() => {
    if (!email || !password) {
      setLiveFeedback('');
      return;
    }

    // Clear any existing timeout
    clearTimeout(debounceTimeout);

    // Set up debounce
    debounceTimeout = setTimeout(async () => {
      try {
        const endpoint = backendUrl +
          (state === 'Admin' ? '/api/admin/validate' : state === 'Doctor' ? '/api/doctor/validate' : '/api/user/validate');

        const { data } = await axios.post(endpoint, { email, password });
        if (data.success) {
          setLiveFeedback('Credentials look good!');
        } else {
          setLiveFeedback('Invalid credentials. Please check your input.');
        }
      } catch (error) {
        setLiveFeedback('Error validating credentials. Please try again.');
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(debounceTimeout);
  }, [email, password, state, backendUrl]);

  // Login handler
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    if (emailError || passwordError) {
      return;
    }

    let endpoint = '';
    let role = '';

    if (state === 'Admin') {
      endpoint = '/api/admin/login';
      role = 'Admin';
    } else if (state === 'Doctor') {
      endpoint = '/api/doctor/login';
      role = 'Doctor';
    } else {
      endpoint = '/api/user/login';
      role = 'User';
    }

    try {
      const { data } = await axios.post(backendUrl + endpoint, { email, password });

      if (data.success) {
        if (role === 'Admin') {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          navigate('/admin-dashboard');
        } else if (role === 'Doctor') {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          navigate('/doctor-dashboard');
        } else {
          localStorage.setItem('uToken', data.token);
          navigate('/user-dashboard');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              setErrors((prev) => ({
                ...prev,
                email: validateEmail(value)
              }));
            }}
            value={email}
            className={`border ${errors.email ? 'border-red-400' : 'border-[#DADADA]'} 
              rounded-lg w-full p-4 mt-2 text-base focus:outline-none focus:ring-2 
              ${errors.email ? 'focus:ring-red-400' : 'focus:ring-[#16a34a]'} transition`}
            type="email"
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="password" className="text-sm font-medium text-[#333]">Password</label>
          <div className="relative">
            <input
              id="password"
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setErrors((prev) => ({
                  ...prev,
                  password: validatePassword(value)
                }));
              }}
              value={password}
              className={`border ${errors.password ? 'border-red-400' : 'border-[#DADADA]'} 
                rounded-lg w-full p-4 mt-2 text-base focus:outline-none focus:ring-2 
                ${errors.password ? 'focus:ring-red-400' : 'focus:ring-[#16a34a]'} transition`}
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
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {liveFeedback && (
          <p className={`text-sm mt-2 ${liveFeedback.includes('good') ? 'text-green-500' : 'text-red-500'}`}>
            {liveFeedback}
          </p>
        )}

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

export default Login;
