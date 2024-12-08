import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PatientLogin = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({}); // State for validation errors
  const [showPassword, setShowPassword] = useState(false);

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces
    return regex.test(name) ? "" : "Name must contain only letters and spaces."; // Set specific error message
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email) ? "" : "Invalid email format."; // Set specific error message
  };

  const validatePassword = (password) => {
   
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/; 
    if (!regex.test(password)) {
      return "Password must be at least 8 characters and include lowercase, uppercase, number, and special character.";
    }

    return "";
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    setErrors({}); // Clear previous errors before validation

    if (state === "Sign Up") {
      const nameError = validateName(name);
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      if (nameError || emailError || passwordError) {
        setErrors({
          name: nameError,
          email: emailError,
          password: passwordError,
        });
        return; // Prevent form submission if there are errors
      }
    }

    try {
      const { data } = await axios.post(
        backendUrl +
          (state === "Sign Up" ? "/api/user/register" : "/api/user/login"),
        { name, password, email }
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        navigate("/"); // Redirect to home page on successful login/signup
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center bg-white">
      <div className="flex flex-col gap-4 m-auto items-start p-10 min-w-[340px] sm:min-w-96 
        border bg-white rounded-2xl text-zinc-700 text-sm shadow-xl
        transition-all duration-300 hover:shadow-2xl">
        <p className="text-3xl font-bold text-gray-800 mb-2">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-500 mb-4"> 
          Please {state === "Sign Up" ? "sign up" : "log in"} to book appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p className="font-medium mb-1">Full Name</p>
            <input
              className={`border border-zinc-300 rounded-lg w-full p-3 mt-1
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 
                focus:border-primary ${errors.name ? "border-red-500" : "hover:border-gray-400"}`}
              type="text"
              onChange={(e) => {
                // Only allow letters and spaces
                const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                setName(value);
              }}
              value={name}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
        )}

        <div className="w-full">
          <p className="font-medium mb-1">Email</p>
          <input
            className={`border border-zinc-300 rounded-lg w-full p-3 mt-1
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 
              focus:border-primary ${errors.email ? "border-red-500" : "hover:border-gray-400"}`}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="w-full">
          <p className="font-medium mb-1">Password</p>
          <div className="relative">
            <input
              className={`border border-zinc-300 rounded-lg w-full p-3 mt-1
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 
                focus:border-primary ${errors.password ? "border-red-500" : "hover:border-gray-400"}`}
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <span
              className="absolute right-3 top-[calc(50%-8px)] cursor-pointer text-gray-500 
                hover:text-gray-700 text-sm transition-colors duration-200"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-3 rounded-lg text-base font-medium
            transition-all duration-200 hover:bg-primary/90 active:scale-[0.99]
            shadow-md hover:shadow-lg mt-2"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <p className="text-center w-full text-gray-600">
          {state === "Sign Up" ? "Already have an account? " : "Create a new account "}
          <span
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
            className="text-primary font-medium underline cursor-pointer 
              hover:text-primary/80 transition-colors duration-200"
          >
            {state === "Sign Up" ? "Login here" : "Click here"}
          </span>
        </p>
      </div>
    </form>
  );
};

export default PatientLogin;
