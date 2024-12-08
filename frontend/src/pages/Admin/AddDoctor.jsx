
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

  // Name validation function
  const validateName = (value) => {
    const nameRegex = /^[A-Za-z.\s]+$/;
    const minLength = 3;
    const maxLength = 50;
    
    if (!value.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (!nameRegex.test(value)) {
      setNameError("Name should contain only alphabets and spaces");
      return false;
    }
    if (value.length < minLength) {
      setNameError(`Name should be at least ${minLength} characters long`);
      return false;
    }
    if (value.length > maxLength) {
      setNameError(`Name should not exceed ${maxLength} characters`);
      return false;
    }
    if (!/^[A-Z]/.test(value)) {
      setNameError("Name should start with a capital letter");
      return false;
    }
    setNameError("");
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
    setName(value);
    validateName(value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAboutChange = (e) => {
    const value = e.target.value;
    setAbout(value);
    validateAbout(value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Validate image
      if (!docImg) {
        return toast.error("Image not Selected");
      }

      // Validate fees (positive number and reasonable amount)
      if (fee <= 0) {
        return toast.error("Fees must be greater than 0");
      }
      if (fee > 10000) { // Adjust max limit as needed
        return toast.error("Fees seems unreasonably high. Please check the amount");
      }

      // Validate degree
      if (!validDegrees.includes(degree.toUpperCase())) {
        return toast.error(`Invalid degree. Valid degrees are: ${validDegrees.join(', ')}`);
      }

      // Validate all fields before submission
      const isNameValid = validateName(name);
      const isAboutValid = validateAbout(about);

      if (!isNameValid || !isAboutValid) {
        toast.error("Please fix all validation errors before submitting");
        return;
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
                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
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
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                      type="email"
                      placeholder="doctor@example.com"
                      required
                    />
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
                        onChange={(e) => setFee(e.target.value)}
                        value={fee}
                        className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                        type="number"
                        placeholder="Enter consultation fee"
                        required
                      />
                    </div>
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
                      onChange={(e) => setAddress1(e.target.value)}
                      value={address1}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                      type="text"
                      placeholder="Address Line 1"
                      required
                    />
                    <input
                      onChange={(e) => setAddress2(e.target.value)}
                      value={address2}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                      type="text"
                      placeholder="Address Line 2"
                      required
                    />
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