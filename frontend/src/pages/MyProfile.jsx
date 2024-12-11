import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import {toast} from 'react-toastify'
const MyProfile = () => {
  const {userData,setUserData,token,backendUrl,loadUserProfileData} = useContext(AppContext)
  const [isEdit,setIsEdit]=useState(false)

  const[image,setImage]=useState(false)
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const [addressErrors, setAddressErrors] = useState({
    line1: '',
    line2: ''
  });
  const [imageError, setImageError] = useState('');

  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check for invalid patterns
    if (digitsOnly.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    
    // Check for all zeros
    if (/^0+$/.test(digitsOnly)) {
      return 'Phone number cannot be all zeros';
    }
    
    // Check for repeated digits (like 1111111111)
    if (/^(\d)\1{9}$/.test(digitsOnly)) {
      return 'Phone number cannot be all same digits';
    }

    return '';
  };

  const validateDob = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    
    if (dobDate >= today) {
      return 'Date of birth must be in the past';
    }

    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age > 100) {
      return 'Age cannot be more than 100 years';
    }

    return '';
  };

  const validateAddress = (address, line) => {
    // Check for starting or ending spaces
    if (address !== address.trim()) {
      return 'Address cannot start or end with spaces';
    }
    
    // Remove extra spaces for other validations
    const trimmedAddress = address.trim();
    
    // Check if empty
    if (!trimmedAddress) {
      return line === 'line1' ? 'Address Line 1 is required' : '';
    }

    // Check first character
    if (!/^[a-zA-Z#]/.test(trimmedAddress)) {
      return 'Address must start with a letter or # symbol';
    }

    // Check minimum length
    if (trimmedAddress.length < 5) {
      return 'Address must be at least 5 characters long';
    }

    // Check maximum length
    if (trimmedAddress.length > 100) {
      return 'Address cannot exceed 100 characters';
    }

    // Check for valid characters
    if (!/^[a-zA-Z0-9\s,.-/#()]+$/.test(trimmedAddress)) {
      return 'Address can only contain: letters (a-z, A-Z), numbers (0-9), spaces, and special characters (,.-/#())';
    }

    // Check for common spam patterns
    if (/(.)\1{4,}/.test(trimmedAddress)) {
      return 'Address contains too many repeated characters';
    }

    // Check for minimum word count for line1
    if (line === 'line1' && trimmedAddress.split(/\s+/).length < 2) {
      return 'Address Line 1 must contain at least 2 words';
    }

    return '';
  };

  const validateInputs = () => {
    const phoneValidation = validatePhone(userData.phone);
    const dobValidation = validateDob(userData.dob);
    const address1Validation = validateAddress(userData.address.line1, 'line1');
    const address2Validation = validateAddress(userData.address.line2, 'line2');

    setPhoneError(phoneValidation);
    setDobError(dobValidation);
    setAddressErrors({
      line1: address1Validation,
      line2: address2Validation
    });

    return !phoneValidation && !dobValidation && !address1Validation && !address2Validation;
  };

  const validateImageType = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!file) return '';
    if (!validTypes.includes(file.type)) {
      return 'Only JPG, JPEG and PNG files are allowed';
    }
    return '';
  };

  const updateUserProfileData = async()=>{
     try {
      if (!validateInputs()) {
        return;
      }

      const formData= new FormData()
      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)
       image && formData.append('image',image)

       const{data} = await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}})

       if(data.success){
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
        setImageError('')
       }else{
        toast.error(data.message)
       }
     } catch (error) {
        console.log(error)
        toast.error(error.message)
     }
  }
  return userData && (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <div className='flex flex-col gap-4'>
        {/* Profile Image Section */}
        <div className='flex justify-center mb-4'>
          {isEdit ? (
            <label htmlFor="image" className='group'>
              <div className='inline-block relative cursor-pointer hover:opacity-90 transition-all'>
                <img 
                  className='w-40 h-40 rounded-full object-cover border-4 border-primary/20' 
                  src={image ? URL.createObjectURL(image) : userData.image} 
                  alt="Profile" 
                />
                <div className='absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <img className='w-12' src={image ? "" : assets.upload_icon} alt="Upload" />
                </div>
              </div>
              <input 
                onChange={(e) => {
                  const file = e.target.files[0];
                  const error = validateImageType(file);
                  setImageError(error);
                  if (!error) {
                    setImage(file);
                  } else {
                    e.target.value = '';
                    toast.error(error);
                  }
                }} 
                type="file" 
                accept=".jpg,.jpeg,.png" 
                id="image" 
                hidden 
              />
            </label>
          ) : (
            <img 
              className='w-40 h-40 rounded-full object-cover border-4 border-primary/20' 
              src={userData.image} 
              alt="Profile" 
            />
          )}
          {imageError && (
            <p className='text-sm text-red-500 text-center mt-2'>{imageError}</p>
          )}
        </div>

        {/* Name Section */}
        {isEdit ? (
          <input 
            className='text-4xl font-semibold text-center bg-gray-50 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/50' 
            type="text" 
            value={userData.name} 
            onChange={e=>setUserData(prev => ({...prev,name:e.target.value}))}
          />
        ) : (
          <h1 className='text-4xl font-semibold text-center text-neutral-800'>{userData.name}</h1>
        )}

        <div className='space-y-8 mt-6'>
          {/* Contact Information Section */}
          <div className='bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-lg font-semibold text-primary mb-4'>Contact Information</h2>
            <div className='grid gap-4'>
              <div className='grid grid-cols-[120px_1fr] items-center'>
                <span className='text-neutral-600 font-medium'>Email:</span>
                <span className='text-primary'>{userData.email}</span>
              </div>

              <div className='grid grid-cols-[120px_1fr] items-center'>
                <span className='text-neutral-600 font-medium'>Phone:</span>
                <div>
                  {isEdit ? (
                    <>
                      <input 
                        className='bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50'
                        type="tel" 
                        value={userData.phone} 
                        onChange={e => {
                          const value = e.target.value.replace(/\D/g, '');
                          setUserData(prev => ({...prev, phone: value}));
                          setPhoneError(validatePhone(value));
                        }}
                        placeholder="Enter 10-digit number"
                      />
                      {phoneError && (
                        <p className='text-sm text-red-500 mt-1'>{phoneError}</p>
                      )}
                    </>
                  ) : (
                    <span className='text-primary'>{userData.phone}</span>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-[120px_1fr] items-start'>
                <span className='text-neutral-600 font-medium'>Address:</span>
                {isEdit ? (
                  <div className='space-y-2'>
                    <div>
                      <input 
                        className={`w-full bg-white border ${addressErrors.line1 ? 'border-red-400' : 'border-gray-200'} 
                          rounded px-3 py-2 focus:outline-none focus:ring-2 
                          ${addressErrors.line1 ? 'focus:ring-red-400' : 'focus:ring-primary/50'}`}
                        placeholder="Address Line 1"
                        value={userData.address.line1}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: value },
                          }));
                          setAddressErrors(prev => ({
                            ...prev,
                            line1: validateAddress(value, 'line1')
                          }));
                        }}
                      />
                      {addressErrors.line1 && (
                        <p className='text-sm text-red-500 mt-1'>{addressErrors.line1}</p>
                      )}
                    </div>
                    <div>
                      <input 
                        className={`w-full bg-white border ${addressErrors.line2 ? 'border-red-400' : 'border-gray-200'} 
                          rounded px-3 py-2 focus:outline-none focus:ring-2 
                          ${addressErrors.line2 ? 'focus:ring-red-400' : 'focus:ring-primary/50'}`}
                        placeholder="Address Line 2 (Optional)"
                        value={userData.address.line2}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: value },
                          }));
                          setAddressErrors(prev => ({
                            ...prev,
                            line2: validateAddress(value, 'line2')
                          }));
                        }}
                      />
                      {addressErrors.line2 && (
                        <p className='text-sm text-red-500 mt-1'>{addressErrors.line2}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='text-neutral-600'>
                    <p>{userData.address.line1}</p>
                    <p>{userData.address.line2}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className='bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-lg font-semibold text-primary mb-4'>Basic Information</h2>
            <div className='grid gap-4'>
              <div className='grid grid-cols-[120px_1fr] items-center'>
                <span className='text-neutral-600 font-medium'>Gender:</span>
                {isEdit ? (
                  <select 
                    className='bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50'
                    value={userData.gender}
                    onChange={(e)=>setUserData(prev=>({...prev,gender:e.target.value}))}
                  >
                    <option value="Select Gender"> Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <span className='text-neutral-600'>{userData.gender}</span>
                )}
              </div>

              <div className='grid grid-cols-[120px_1fr] items-center'>
                <span className='text-neutral-600 font-medium'>Birthday:</span>
                <div>
                  {isEdit ? (
                    <>
                      <input 
                        className='bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50'
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        value={userData.dob}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUserData(prev => ({...prev, dob: value}));
                          setDobError(validateDob(value));
                        }}
                      />
                      {dobError && (
                        <p className='text-sm text-red-500 mt-1'>{dobError}</p>
                      )}
                    </>
                  ) : (
                    <span className='text-neutral-600'>{userData.dob}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className='flex justify-center mt-8'>
          {isEdit ? (
            <button 
              className='px-8 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium'
              onClick={updateUserProfileData}
            >
              Save Changes
            </button>
          ) : (
            <button 
              className='px-8 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors font-medium'
              onClick={() => {
                setIsEdit(true)
                setImageError('')
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProfile

