import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [feesError, setFeesError] = useState(null)
  const [addressError, setAddressError] = useState({
    line1: null,
    line2: null
  })

  const handleFeesChange = (e) => {
    const value = e.target.value
    const newFees = Number(value)

    // Validate fees: positive whole number
    if (!Number.isInteger(newFees)) {
      setFeesError('Fees must be a whole number.')
    } else if (newFees <= 0) {
      setFeesError('Fees must be greater than 0.')
    } else {
      setFeesError(null)
    }
    
    setProfileData(prev => ({ ...prev, fees: value }))
  }

  const validateAddress = (value, field) => {
    // Remove extra spaces for validation
    const trimmedValue = value.trim();
    
    // Basic required field validation
    if (!trimmedValue) {
      return field === 'line1' ? 'Address Line 1 is required.' : null;
    }

    // Length validation
    if (trimmedValue.length < 3) {
      return 'Address must be at least 3 characters long.';
    }

    if (trimmedValue.length > 100) {
      return 'Address cannot exceed 100 characters.';
    }

    // First character must be alphanumeric
    if (!/^[a-zA-Z0-9]/.test(trimmedValue)) {
      return 'Address must start with a letter or number.';
    }

    // Last character must be alphanumeric
    if (!/[a-zA-Z0-9]$/.test(trimmedValue)) {
      return 'Address must end with a letter or number.';
    }

    // Check for more than 3 consecutive same characters
    if (/(.)\1{2,}/.test(trimmedValue)) {
      return 'Address cannot contain more than 3 consecutive same characters.';
    }

    // Special characters validation
    const specialCharsRegex = /[<>{}[\]\\]/;
    if (specialCharsRegex.test(trimmedValue)) {
      return 'Address contains invalid special characters.';
    }

    // Consecutive spaces validation
    if (/\s{3,}/.test(value)) {
      return 'Address cannot contain excessive spaces.';
    }

    // Basic format validation (should contain alphanumeric characters)
    const validAddressRegex = /^[a-zA-Z0-9\s,.'#-/]+$/;
    if (!validAddressRegex.test(trimmedValue)) {
      return 'Address can only contain letters, numbers, and basic punctuation.';
    }

    // Number-only validation
    if (/^\d+$/.test(trimmedValue)) {
      return 'Address cannot contain only numbers.';
    }

    // Minimum word validation
    const wordCount = trimmedValue.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 2) {
      return 'Address should contain at least 2 words.';
    }

    return null;
  };

  const handleAddressChange = (field, value) => {
    const error = validateAddress(value, field);
    
    setAddressError(prev => ({
      ...prev,
      [field]: error
    }));

    // Sanitize input before updating state
    const sanitizedValue = value
      .replace(/\s{3,}/g, ' ') // Replace multiple spaces with single space
      .replace(/[<>{}[\]\\]/g, ''); // Remove dangerous special characters

    setProfileData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: sanitizedValue }
    }));
  };

  const updateProfile = async () => {
    // Validate both address lines before submission
    const line1Error = validateAddress(profileData.address.line1, 'line1');
    const line2Error = profileData.address.line2 ? validateAddress(profileData.address.line2, 'line2') : null;

    setAddressError({
      line1: line1Error,
      line2: line2Error
    });

    if (line1Error || line2Error || feesError) {
      toast.error('Please fix validation errors before saving.');
      return;
    }

    // Trim both address lines before submission
    const updatedAddress = {
      line1: profileData.address.line1.trim(),
      line2: profileData.address.line2 ? profileData.address.line2.trim() : ''
    };

    try {
      const updateData = {
        address: updatedAddress,
        fees: profileData.fees,
        available: profileData.available
      };

      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (dToken) getProfileData()
  }, [dToken])

  return profileData && (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-t-xl">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              src={profileData.image}
              alt=""
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{profileData.name}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-gray-600">
                <span>{profileData.degree}</span>
                <span>•</span>
                <span>{profileData.speciality}</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {profileData.experience}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{profileData.about}</p>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Fees */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium min-w-[120px]">Consultation Fee:</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">{currency}</span>
                {isEdit ? (
                  <input
                    type="number"
                    className={`border rounded-lg px-3 py-1.5 w-24 focus:outline-none focus:ring-2 ${feesError ? 'border-red-500' : 'focus:ring-primary/20'}`}
                    onChange={handleFeesChange}
                    value={profileData.fees}
                    aria-describedby="fees-error"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-800">{profileData.fees}</span>
                )}
                {feesError && <div id="fees-error" className="text-xs text-red-500">{feesError}</div>}
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <span className="text-gray-700 font-medium min-w-[120px]">Address:</span>
              <div className="flex-1">
                {isEdit ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      className={`border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 ${
                        addressError.line1 ? 'border-red-500' : 'focus:ring-primary/20'
                      }`}
                      onChange={(e) => handleAddressChange('line1', e.target.value)}
                      value={profileData.address.line1}
                    />
                    {addressError.line1 && (
                      <div className="text-xs text-red-500 mt-1">{addressError.line1}</div>
                    )}
                    <input
                      type="text"
                      className={`border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 ${
                        addressError.line2 ? 'border-red-500' : 'focus:ring-primary/20'
                      }`}
                      onChange={(e) => handleAddressChange('line2', e.target.value)}
                      value={profileData.address.line2}
                    />
                    {addressError.line2 && (
                      <div className="text-xs text-red-500 mt-1">{addressError.line2}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <p>{profileData.address.line1}</p>
                    <p>{profileData.address.line2}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium min-w-[120px]">Status:</span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  onChange={() => isEdit && setProfileData(prev => ({
                    ...prev,
                    available: !prev.available
                  }))}
                  checked={profileData.available}
                  disabled={!isEdit}
                />
                <label className="text-gray-600">Available for Appointments</label>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-end">
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
