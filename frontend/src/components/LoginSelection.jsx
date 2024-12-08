import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginSelection = () => {
  const navigate = useNavigate()

  const handleRoleSelection = (role) => {
    navigate(`/${role}-login`)  // Navigates to the respective login page
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-semibold text-center mb-6'>Select Your Role</h1>
        <div className='flex flex-col gap-4'>
          <button
            className='bg-green-500 text-white py-2 rounded-md'
            onClick={() => handleRoleSelection('patient')}
          >
            Login as Patient
          </button>
          <button
            className='bg-blue-500 text-white py-2 rounded-md'
            onClick={() => handleRoleSelection('doctor')}
          >
            Login as Doctor
          </button>
          <button
            className='bg-purple-500 text-white py-2 rounded-md'
            onClick={() => handleRoleSelection('admin')}
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginSelection
