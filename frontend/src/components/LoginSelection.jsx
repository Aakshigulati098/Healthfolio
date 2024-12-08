import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginSelection = () => {
  const navigate = useNavigate()

  // Add a class to the body when on this page
  useEffect(() => {
    document.body.classList.add('login-page')
    return () => {
      document.body.classList.remove('login-page') // Cleanup
    }
  }, [])

  const handleRoleSelection = (role) => {
    navigate(`/${role}-login`)
  }

  return (
    <div className="auth-page min-h-screen flex bg-gradient-to-br from-green-50 via-green-100 to-green-50">
      {/* Left side - Logo/Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-green-600 p-12">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Prescripto</h1>
          <p className="text-xl">Your Digital Healthcare Solution</p>
        </div>
      </div>

      {/* Right side - Role Selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-2">Welcome</h2>
              <p className="text-gray-600">Please select your role to continue</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelection('patient')}
                className="w-full flex items-center justify-between px-6 py-4 bg-white border-2 border-green-100 rounded-xl hover:border-green-500 hover:shadow-md transition duration-300 group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-4 text-lg font-medium text-gray-700">Patient</span>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection('doctor')}
                className="w-full flex items-center justify-between px-6 py-4 bg-white border-2 border-green-100 rounded-xl hover:border-green-500 hover:shadow-md transition duration-300 group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                  <span className="ml-4 text-lg font-medium text-gray-700">Doctor</span>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection('admin')}
                className="w-full flex items-center justify-between px-6 py-4 bg-white border-2 border-green-100 rounded-xl hover:border-green-500 hover:shadow-md transition duration-300 group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-4 text-lg font-medium text-gray-700">Admin</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSelection
