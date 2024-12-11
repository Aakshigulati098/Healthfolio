import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fee, setFee] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [nameError, setNameError] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [feeError, setFeeError] = useState("");
  const [addressError, setAddressError] = useState({ line1: "", line2: "" });
  const [imageError, setImageError] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  // Add valid degrees list
  const validDegrees = [
    'MBBS',
    'MD',
    'MS',
    'DNB',
    'DM',
    'MCh',
    'BDS',
    'MDS'
  ];

  // Validation functions
  const validateName = (value) => {
    if (!value) {
      setNameError("Name is required");
      return false;
    }

    // Remove leading and trailing spaces
    const trimmedValue = value.trim();
    
    // Check if original value had leading/trailing spaces
    if (trimmedValue !== value) {
      setNameError("Name should not contain leading or trailing spaces");
      return false;
    }

    // Check for multiple consecutive spaces
    if (/\s\s+/.test(value)) {
      setNameError("Name should not contain multiple consecutive spaces");
      return false;
    }

    // Check for capital first letter and single space between words
    const nameRegex = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)*$/;
    if (!nameRegex.test(value)) {
      setNameError("Each word must start with a capital letter and have single spaces between words");
      return false;
    }

    if (value.length < 3 || value.length > 50) {
      setNameError("Name must be between 3 and 50 characters");
      return false;
    }

    setNameError("");
    return true;
  };

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }

    // Check for any spaces
    if (/\s/.test(value)) {
      setEmailError("Email cannot contain any spaces");
      return false;
    }

    // Check maximum length
    if (value.length > 254) {
      setEmailError("Email is too long (maximum 254 characters)");
      return false;
    }

    // Check local part length (before @)
    const localPart = value.split('@')[0];
    if (localPart.length > 64) {
      setEmailError("Local part of email is too long (maximum 64 characters)");
      return false;
    }

    // Gmail format check - no spaces allowed anywhere
    const gmailRegex = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@gmail\.com$/;

    if (!gmailRegex.test(value)) {
      // Specific error messages for different cases
      if (!value.includes('@')) {
        setEmailError("Email must contain '@' symbol");
        return false;
      }
      
      if (!value.endsWith('@gmail.com')) {
        setEmailError("Only Gmail addresses are allowed");
        return false;
      }

      if (/[^a-zA-Z0-9._@-]/.test(value)) {
        setEmailError("Email can only contain letters, numbers, dots, underscores, and hyphens");
        return false;
      }

      if (/\.{2,}/.test(value)) {
        setEmailError("Email cannot contain consecutive dots");
        return false;
      }

      if (/^[._-]/.test(localPart)) {
        setEmailError("Email cannot start with a special character");
        return false;
      }

      if (/[._-]$/.test(localPart)) {
        setEmailError("Email cannot end with a special character");
        return false;
      }

      setEmailError("Please enter a valid Gmail address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError("Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateFee = (value) => {
    const fee = parseInt(value);
    if (!Number.isInteger(fee) || fee <= 0) {
      setFeeError("Fee must be a positive whole number");
      return false;
    }
    setFeeError("");
    return true;
  };

  const validateAddress = (value, line) => {
    if (!value) {
      setAddressError(prev => ({...prev, [line]: "Address is required"}));
      return false;
    }

    // Remove leading and trailing spaces
    const trimmedValue = value.trim();
    
    // Check if original value had leading/trailing spaces
    if (trimmedValue !== value) {
      setAddressError(prev => ({...prev, [line]: "Address should not contain leading or trailing spaces"}));
      return false;
    }

    // Check for multiple consecutive spaces
    if (/\s\s+/.test(value)) {
      setAddressError(prev => ({...prev, [line]: "Address should not contain multiple consecutive spaces"}));
      return false;
    }

    // Updated regex to allow common address formats
    // Allows: letters, numbers, spaces, #, -, ,, /, and periods
    // Must start and end with alphanumeric character
    const addressRegex = /^[a-zA-Z0-9#][a-zA-Z0-9\s#,\-/.]*[a-zA-Z0-9]$/;
    
    if (!addressRegex.test(value)) {
      setAddressError(prev => ({
        ...prev, 
        [line]: "Address must start and end with alphanumeric character and can contain letters, numbers, #, spaces, commas, hyphens, periods"
      }));
      return false;
    }

    // Check minimum and maximum length
    if (value.length < 5 || value.length > 100) {
      setAddressError(prev => ({
        ...prev,
        [line]: "Address must be between 5 and 100 characters"
      }));
      return false;
    }

    setAddressError(prev => ({...prev, [line]: ""}));
    return true;
  };

  const validateImage = (file) => {
    if (!file) {
      setImageError("Image is required");
      return false;
    }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setImageError("Only JPG, JPEG or PNG files are allowed");
      return false;
    }
    setImageError("");
    return true;
  };

  // About text validation function
  const validateAbout = (value) => {
    const minWords = 10;
    const maxWords = 100;
    const words = value.trim().split(/\s+/);
    
    if (!value.trim()) {
      setAboutError("About section is required");
      return false;
    }
    if (words.length < minWords) {
      setAboutError(`Please write at least ${minWords} words`);
      return false;
    }
    if (words.length > maxWords) {
      setAboutError(`Please keep it under ${maxWords} words`);
      return false;
    }
    if (!/[.!?]$/.test(value.trim())) {
      setAboutError("Please end with proper punctuation");
      return false;
    }
    setAboutError("");
    return true;
  };

  // Input change handlers
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Prevent multiple consecutive spaces while typing
    if (!/\s\s+/.test(value)) {
      setName(value);
      validateName(value);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.replace(/\s/g, ''); // Remove any spaces immediately
    // Only allow valid email characters (no spaces)
    if (!/[^\w@.-]/.test(value)) {
      setEmail(value.toLowerCase());
      validateEmail(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleFeeChange = (e) => {
    const value = e.target.value;
    setFee(value);
    validateFee(value);
  };

  const handleAddressChange = (e, line) => {
    const value = e.target.value;
    // Prevent multiple consecutive spaces while typing
    if (!/\s\s+/.test(value)) {
      if (line === 'line1') setAddress1(value);
      else setAddress2(value);
      validateAddress(value, line);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setDocImg(file);
    } else {
      e.target.value = '';
    }
  };

  const handleAboutChange = (e) => {
    const value = e.target.value;
    setAbout(value);
    validateAbout(value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Validate all fields
      const isImageValid = validateImage(docImg);
      const isNameValid = validateName(name);
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      const isFeeValid = validateFee(fee);
      const isAddress1Valid = validateAddress(address1, 'line1');
      const isAddress2Valid = validateAddress(address2, 'line2');
      const isAboutValid = validateAbout(about);

      if (!isImageValid || !isNameValid || !isEmailValid || !isPasswordValid || 
          !isFeeValid || !isAddress1Valid || !isAddress2Valid || !isAboutValid) {
        toast.error("Please fix all validation errors before submitting");
        return;
      }

      // Validate degree
      if (!validDegrees.includes(degree.toUpperCase())) {
        return toast.error(`Invalid degree. Valid degrees are: ${validDegrees.join(', ')}`);
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fee));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree.toUpperCase()); // Standardize degree format
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );

      //console.log("Server response:", response.data);

      if(response.data.success){
        toast.success(response.data.message)
        setDocImg(false);
        setName('')
        setEmail('')
        setPassword('')
        setFee('')
        setAbout('')
        setDegree('')
        setAddress1('')
        setAddress2('')
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Error submitting form. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 w-full py-8">
      <div className="container mx-auto px-4">
        <form onSubmit={onSubmitHandler} className="w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Add New Doctor</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Image Section */}
            <div className="bg-emerald-50 px-8 py-6 border-b border-emerald-100">
              <div className="flex items-center gap-6">
                <label htmlFor="doc-img" className="cursor-pointer group relative">
                  <img
                    className="w-32 h-32 object-cover rounded-2xl border-2 border-emerald-500 transition-all duration-300 group-hover:opacity-75"
                    src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                    alt=""
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm">Change Photo</span>
                  </div>
                </label>
                <input onChange={handleImageChange} type="file" accept=".jpg,.jpeg,.png" id="doc-img" hidden />
                {imageError && <p className="mt-1 text-sm text-red-500">{imageError}</p>}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">Doctor's Profile Picture</h2>
                  <p className="text-gray-600">Upload a professional photo</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">
                      Doctor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handleNameChange}
                      value={name}
                      className={`w-full border ${
                        nameError ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors`}
                      type="text"
                      placeholder="Enter doctor's full name"
                      required
                    />
                    {nameError && (
                      <p className="mt-1 text-sm text-red-500">{nameError}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      onChange={handleEmailChange}
                      value={email}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                      type="email"
                      placeholder="doctor@example.com"
                      required
                    />
                    {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
                  </div>

                  <div className="form-group mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      onChange={handlePasswordChange}
                      value={password}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                      type="password"
                      placeholder="Set a secure password"
                      required
                    />
                    {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
                  </div>

                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">Experience</label>
                    <select
                      onChange={(e) => setExperience(e.target.value)}
                      value={experience}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={`${i + 1} Year`}>{i + 1} Year{i !== 0 && 's'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">Consultation Fee</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        onChange={handleFeeChange}
                        value={fee}
                        className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                        type="number"
                        placeholder="Enter consultation fee"
                        required
                      />
                    </div>
                    {feeError && <p className="mt-1 text-sm text-red-500">{feeError}</p>}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">Specialization</label>
                    <select
                      onChange={(e) => setSpeciality(e.target.value)}
                      value={speciality}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                    >
                      <option value="General physician">General Physician</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatricians">Pediatrician</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">Education</label>
                    <input
                      onChange={(e) => setDegree(e.target.value)}
                      value={degree}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                      type="text"
                      placeholder="Medical degree (e.g., MBBS, MD)"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-gray-700 font-medium mb-2">Clinic Address</label>
                    <input
                      onChange={(e) => handleAddressChange(e, 'line1')}
                      value={address1}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                      type="text"
                      placeholder="Address Line 1"
                      required
                    />
                    {addressError.line1 && <p className="mt-1 text-sm text-red-500">{addressError.line1}</p>}
                    <input
                      onChange={(e) => handleAddressChange(e, 'line2')}
                      value={address2}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                      type="text"
                      placeholder="Address Line 2"
                      required
                    />
                    {addressError.line2 && <p className="mt-1 text-sm text-red-500">{addressError.line2}</p>}
                  </div>

                  <div className="form-group mt-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      About <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      onChange={handleAboutChange}
                      value={about}
                      className={`w-full border ${
                        aboutError ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors`}
                      placeholder="Write a detailed description about the doctor's expertise and experience (minimum 10 words)"
                      rows={4}
                      required
                    />
                    {aboutError && (
                      <p className="mt-1 text-sm text-red-500">{aboutError}</p>
                    )}
                    {/* Word count indicator */}
                    <p className="mt-1 text-sm text-gray-500">
                      {about.trim() ? about.trim().split(/\s+/).length : 0} words
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors font-medium flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Doctor
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
