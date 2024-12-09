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
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Validation functions
  const validateName = (name) => {
    const spaceCount = (name.match(/\s/g) || []).length;
    const regex = /^[A-Za-z]+([A-Za-z\s]*[A-Za-z]+)?$/; // Letters with optional single spaces
    if (!regex.test(name.trim())) {
      return "Name must only contain letters and single spaces between words.";
    }
    if (name.length < 2 || name.length > 50) {
      return "Name must be between 2 and 50 characters long.";
    }
    if (spaceCount > 2) {
      return "Name must not contain more than two spaces.";
    }
    return ""; // No error
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Only valid Gmail addresses
    if (!regex.test(email.trim())) {
      return "Please enter a valid Gmail address.";
    }
    return ""; // No error
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$#!%?&])[A-Za-z\d@$#!%?&]{8,}$/;
    return regex.test(password)
      ? ""
      : "Password must be at least 8 characters long and include lowercase, uppercase, number, and special character.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    // Validate inputs
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
        return;
      }
    }

    try {
      const endpoint =
        state === "Sign Up" ? "/api/user/register" : "/api/user/login";
      const { data } = await axios.post(${backendUrl}${endpoint}, {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(${state} successful! Redirecting...);
        navigate("/");
      } else {
        toast.error(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
              onChange={(e) =>
                setName(
                  e.target.value
                    .replace(/[^a-zA-Z\s]/g, "")
                    .replace(/\s{2,}/g, " ")
                )
              } // Prevent more than 2 consecutive spaces
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
            className={`border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500" : "hover:border-gray-400"
            }`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())} // Automatically trims spaces
            required
          />

          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="w-full">
          <p className="font-medium mb-1">Password</p>
          <div className="relative">
            <input
              className={`border rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "hover:border-gray-400"
              }`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[calc(50%-8px)] cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
