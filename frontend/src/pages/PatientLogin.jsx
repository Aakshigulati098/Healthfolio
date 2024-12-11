import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const PatientLogin = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [liveFeedback, setLiveFeedback] = useState({ email: "" });

  // Validation functions
  const validateName = (name) => {
    if (!name) {
      return "Name is required";
    }
    const spaceCount = (name.match(/\s/g) || []).length;
    const regex = /^[A-Za-z]+([A-Za-z\s]*[A-Za-z]+)?$/; // Letters with optional single spaces
    
    if (!regex.test(name.trim())) {
      return "Name must only contain letters and single spaces between words";
    }
    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (name.length > 50) {
      return "Name cannot exceed 50 characters";
    }
    if (spaceCount > 2) {
      return "Name must not contain more than two spaces";
    }
    if (/\s\s/.test(name)) {
      return "Name must not contain consecutive spaces";
    }
    if (/^\s|\s$/.test(name)) {
      return "Name must not start or end with a space";
    }
    return ""; // No error
  };

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    }
    if (/\s/.test(email)) {
      return "Email cannot contain spaces";
    }
    if (email.length > 50) {
      return "Email cannot exceed 50 characters";
    }
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regex.test(email.trim())) {
      return "Please enter a valid Gmail address";
    }
    if (email.startsWith('.') || email.startsWith('-') || email.startsWith('_')) {
      return "Email cannot start with a special character";
    }
    if (email.includes('..') || email.includes('--') || email.includes('__')) {
      return "Email cannot contain consecutive special characters";
    }
    return ""; // No error
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password.length > 50) {
      return "Password cannot exceed 50 characters";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[@$#!%*?&])/.test(password)) {
      return "Password must contain at least one special character (@$#!%*?&)";
    }
    if (/\s/.test(password)) {
      return "Password must not contain spaces";
    }
    return ""; // No error
  };

  const validateConfirmPassword = (confirmPass, pass = password) => {
    if (!confirmPass) {
      return "Please confirm your password";
    }
    if (confirmPass !== pass) {
      return "Passwords do not match";
    }
    return ""; // No error
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    // Validate inputs
    if (state === "Sign Up") {
      const nameError = validateName(name);
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);
      const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

      if (nameError || emailError || passwordError || confirmPasswordError) {
        setErrors({
          name: nameError,
          email: emailError,
          password: passwordError,
          confirmPassword: confirmPasswordError,
        });
        return;
      }
    }

    try {
      const endpoint =
        state === "Sign Up" ? "/api/user/register" : "/api/user/login";
      const { data } = await axios.post(`${backendUrl}${endpoint}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(`${state} successful! Redirecting...`);
        navigate("/");
      } else {
        toast.error(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/\s{2,}/g, " ");
    setName(value);
    
    // Real-time validation checks
    if (!value) {
      setLiveFeedback(prev => ({ ...prev, name: "Name is required" }));
    } else if (value.length < 2) {
      setLiveFeedback(prev => ({ ...prev, name: "Name must be at least 2 characters long" }));
    } else if (value.length > 50) {
      setLiveFeedback(prev => ({ ...prev, name: "Name cannot exceed 50 characters" }));
    } else if (!/^[A-Za-z]+([A-Za-z\s]*[A-Za-z]+)?$/.test(value.trim())) {
      setLiveFeedback(prev => ({ ...prev, name: "Name must only contain letters and spaces" }));
    } else if ((value.match(/\s/g) || []).length > 2) {
      setLiveFeedback(prev => ({ ...prev, name: "Name must not contain more than two spaces" }));
    } else if (/\s\s/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, name: "Name must not contain consecutive spaces" }));
    } else if (/^\s|\s$/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, name: "Name must not start or end with a space" }));
    } else {
      setLiveFeedback(prev => ({ ...prev, name: "" }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Regex to block any leading, trailing, or internal spaces.
    const noSpacesRegex = /^[^\s]+@gmail\.com$/; 
    
    // Check for any spaces first
    if (/\s/.test(value)) {
      setLiveFeedback(prev => ({ 
        ...prev, 
        email: "Email cannot contain any spaces (leading, trailing, or in between)" 
      }));
      return;
    }
    
    // Rest of the validation
    if (!value) {
      setLiveFeedback(prev => ({ ...prev, email: "Email is required" }));
    } else if (value.length > 100) {
      setLiveFeedback(prev => ({ ...prev, email: "Email cannot exceed 100 characters" }));
    } else if (value.length < 5) {
      setLiveFeedback(prev => ({ ...prev, email: "Email is too short" }));
    } else if (!value.includes('@')) {
      setLiveFeedback(prev => ({ ...prev, email: "Email must contain @ symbol" }));
    } else if (!value.endsWith('@gmail.com')) {
      setLiveFeedback(prev => ({ ...prev, email: "Only Gmail addresses are allowed" }));
    } else if (value.length <= '@gmail.com'.length) {
      setLiveFeedback(prev => ({ ...prev, email: "Please enter a username before @gmail.com" }));
    } else if (/[A-Z]/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, email: "Email must be in lowercase" }));
    } else if (!noSpacesRegex.test(value)) {
      setLiveFeedback(prev => ({ ...prev, email: "Invalid email format - no spaces allowed" }));
    } else if (value.startsWith('.') || value.startsWith('-') || value.startsWith('_')) {
      setLiveFeedback(prev => ({ ...prev, email: "Email cannot start with a special character" }));
    } else if (value.includes('..') || value.includes('--') || value.includes('__')) {
      setLiveFeedback(prev => ({ ...prev, email: "Email cannot contain consecutive special characters" }));
    } else if (!/^[a-z0-9]/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, email: "Email must start with a letter or number" }));
    } else if (value.split('@')[0].length < 3) {
      setLiveFeedback(prev => ({ ...prev, email: "Username must be at least 3 characters long" }));
    } else if (value.split('@')[0].length > 64) {
      setLiveFeedback(prev => ({ ...prev, email: "Username cannot exceed 64 characters" }));
    } else if (/[!#$%^&*()+=\[\]{};':"\\|,<>\/?]/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, email: "Email contains invalid special characters" }));
    } else {
      setLiveFeedback(prev => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Real-time validation checks
    if (!value) {
      setLiveFeedback(prev => ({ ...prev, password: "Password is required" }));
    } else if (value.length < 8) {
      setLiveFeedback(prev => ({ ...prev, password: "Password must be at least 8 characters long" }));
    } else if (value.length > 50) {
      setLiveFeedback(prev => ({ ...prev, password: "Password cannot exceed 50 characters" }));
    } else if (!/(?=.*[a-z])/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, password: "Password must contain at least one lowercase letter" }));
    } else if (!/(?=.*[A-Z])/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, password: "Password must contain at least one uppercase letter" }));
    } else if (!/(?=.*\d)/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, password: "Password must contain at least one number" }));
    } else if (!/(?=.*[@$#!%*?&])/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, password: "Password must contain at least one special character (@$#!%*?&)" }));
    } else if (/\s/.test(value)) {
      setLiveFeedback(prev => ({ ...prev, password: "Password must not contain spaces" }));
    } else {
      setLiveFeedback(prev => ({ ...prev, password: "" }));
    }
    
    // Update confirm password validation if it exists
    if (confirmPassword) {
      if (confirmPassword !== value) {
        setLiveFeedback(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setLiveFeedback(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    // Real-time validation checks
    if (!value) {
      setLiveFeedback(prev => ({ ...prev, confirmPassword: "Please confirm your password" }));
    } else if (value !== password) {
      setLiveFeedback(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setLiveFeedback(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Add password requirements display
  const PasswordRequirements = ({ password }) => {
    return (
      <div className="text-xs mt-1">
        <p className={password.length >= 8 ? "text-green-500" : "text-gray-400"}>
          ✓ At least 8 characters
        </p>
        <p className={/[a-z]/.test(password) ? "text-green-500" : "text-gray-400"}>
          ✓ One lowercase letter
        </p>
        <p className={/[A-Z]/.test(password) ? "text-green-500" : "text-gray-400"}>
          ✓ One uppercase letter
        </p>
        <p className={/\d/.test(password) ? "text-green-500" : "text-gray-400"}>
          ✓ One number
        </p>
        <p className={/[@$#!%*?&]/.test(password) ? "text-green-500" : "text-gray-400"}>
          ✓ One special character (@$#!%*?&)
        </p>
      </div>
    );
  };

  // Update the EmailRequirements component to be more explicit about spaces
  const EmailRequirements = ({ email }) => {
    const username = email.includes('@') ? email.split('@')[0] : "";
    
    // Regex to block any leading, trailing, or internal spaces.
    const noSpacesRegex = /^[^\s]+@gmail\.com$/; 
  
    return (
      <div className="text-xs mt-1">
        {/* Must be a valid Gmail address */}
        <p className={noSpacesRegex.test(email) ? "text-green-500" : "text-gray-400"}>
          ✓ Must be a Gmail address (@gmail.com)
        </p>
  
        {/* Username should have at least 3 characters */}
        <p className={username.length >= 3 ? "text-green-500" : "text-gray-400"}>
          ✓ Username must have at least 3 characters
        </p>
        
        {/* Must start with letter or number */}
        <p className={/^[a-z0-9]/.test(email) ? "text-green-500" : "text-gray-400"}>
          ✓ Starts with a letter or number
        </p>
        
        {/* Ensure only lowercase letters are used */}
        <p className={!/[A-Z]/.test(email) ? "text-green-500" : "text-gray-400"}>
          ✓ No uppercase letters allowed
        </p>
        
        {/* Ensure invalid special characters are excluded */}
        <p className={!/[!#$%^&*()+=\[\]{};':"\\|,<>\/?]/.test(email) ? "text-green-500" : "text-gray-400"}>
          ✓ No invalid special characters
        </p>
        
        {/* Disallow spaces entirely */}
        <p className={noSpacesRegex.test(email) ? "text-green-500" : "text-gray-400"}>
          ✓ No leading, trailing, or internal spaces allowed
        </p>
      </div>
    );
  };

  // Update the input field to prevent pasting of emails with spaces
  const handleEmailPaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (/\s/.test(pastedText)) {
      e.preventDefault();
      setLiveFeedback(prev => ({ 
        ...prev, 
        email: "Pasted email cannot contain any spaces" 
      }));
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen w-full flex items-center justify-center"
    >
      <div
        className="flex flex-col gap-4 m-auto items-start p-10 min-w-[340px] sm:min-w-96 
        border bg-white rounded-2xl text-zinc-700 text-sm shadow-xl
        transition-all duration-300 hover:shadow-2xl"
      >
        <button
          onClick={() => navigate("/")}
          type="button"
          className="text-green-600 hover:text-green-800 flex items-center gap-2 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        <div className="w-full text-center">
          <img src={logo} alt="Logo" className="h-16 mx-auto" />
        </div>

        <p className="text-3xl font-bold text-gray-800 mb-2">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-500 mb-4">
          Please {state === "Sign Up" ? "sign up" : "log in"} to book an
          appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p className="font-medium mb-1">Full Name</p>
            <input
              className={`border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500" : "hover:border-gray-400"
              }`}
              type="text"
              value={name}
              onChange={handleNameChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
        )}

        <div className="w-full">
          <p className="font-medium mb-1">Email</p>
          <input
            className={`border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 
              ${liveFeedback.email ? 'border-red-500' : email ? 'border-green-500' : 'hover:border-gray-400'}`}
            type="email"
            value={email}
            onChange={handleEmailChange}
            onPaste={handleEmailPaste}
            placeholder="example@gmail.com"
            required
          />
          {liveFeedback.email && (
            <p className="text-red-500 text-xs mt-1">{liveFeedback.email}</p>
          )}
          {/* Show email requirements when input is focused or has value */}
          {email && <EmailRequirements email={email} />}
        </div>

        <div className="w-full">
          <p className="font-medium mb-1">Password</p>
          <div className="relative">
            <input
              className={`border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 
                ${liveFeedback.password ? 'border-red-500' : password ? 'border-green-500' : 'hover:border-gray-400'}`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[calc(50%-8px)] cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {liveFeedback.password && (
            <p className="text-red-500 text-xs mt-1">{liveFeedback.password}</p>
          )}
          {/* Show password requirements when input is focused or has value */}
          {password && <PasswordRequirements password={password} />}
        </div>

        <div className="w-full">
          <p className="font-medium mb-1">Confirm Password</p>
          <div className="relative">
            <input
              className={`border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 ${
                errors.confirmPassword ? "border-red-500" : "hover:border-gray-400"
              }`}
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[calc(50%-8px)] cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-3 rounded-lg font-medium shadow-md hover:shadow-lg mt-2"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <p className="text-center w-full text-gray-600">
          {state === "Sign Up"
            ? "Already have an account? "
            : "Create a new account "}
          <span
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
            className="text-primary font-medium underline cursor-pointer hover:text-primary/80"
          >
            {state === "Sign Up" ? "Login here" : "Click here"}
          </span>
        </p>
      </div>
    </form>
  );
};

export default PatientLogin;



