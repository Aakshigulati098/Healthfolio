// import React, { useContext, useEffect, useState } from 'react'
// import { DoctorContext } from '../../context/DoctorContext'
// import { AppContext } from '../../context/AppContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// const DoctorProfile = () => {
//   const{dToken,profileData,setProfileData,getProfileData,backendUrl} = useContext(DoctorContext)

//   const{currency} = useContext(AppContext)
//   const[isEdit,setIsEdit] = useState(false)
//   const updateProfile = async()=>{
//     try {
//        const updateData = {
//         address:profileData.address,
//         fees:profileData.fees,
//         available : profileData.available
//        }

//        const {data} = await axios.post(backendUrl+'/api/doctor/update-profile',updateData,{headers:{dToken}})

//        if(data.success){
//         toast.success(data.message)
//         setIsEdit(false)
//         getProfileData()
//        }
//        else {
//         toast.error(data.message)
//        }
//     } catch (error) {
//       console.log(error)
//       toast.error(error.message)
//     }
//   }
//   useEffect(()=>{
//     if(dToken)getProfileData()
//   },[dToken])
//   return profileData && (
//     <div>
//         <div className='flex flex-col gap-4 m-5'>
//           <div>
//             <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
//           </div>
//           <div className='flex-1 border border-stone-100 p-8 py-7 bg-white'>
//             {/* doc infor name degree exp */}
//             <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
//             <div className='flex items-center gap-2 mt-1 text-gray-600'>
//             <p>{profileData.degree}-{profileData.speciality}</p>
//             <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
//             </div>
//             {/* doctor about */}
//             <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
//             <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
//               {profileData.about}
//             </p>
          

//           <p className='text-gray-600 font-medium mt-4'>
//             Appointment Fee : <span className='text-gray-800'>{currency}{isEdit? <input type="number" onChange={(e)=>setProfileData(prev=>({...prev,fees:e.target.value}))} value={profileData.fees}/>:profileData.fees}</span>
//           </p>

//           <div className='flex gap-2 py-2'>
//             <p>Address</p>
//             <p className='text-sm'>
//               {isEdit ? <input type="text" onChange={(e)=>setProfileData(prev => ({...prev,address:{...prev.address,line1:e.target.value}}))}
//               value={profileData.address.line1} /> :profileData.address.line1}<br/>
//               { isEdit ? <input type="text" onChange={(e)=>setProfileData(prev => ({...prev,address:{...prev.address,line2:e.target.value}}))}
//               value={profileData.address.line2} /> :profileData.address.line2}
//             </p>
//           </div>

//           <div className='flex gap-1 pt-2'>
//             <input onChange={()=>isEdit && setProfileData(prev=>({...prev,available:!prev.available}))} checked={profileData.available} type="checkbox" />
//             <label htmlFor="">Available</label>
//           </div>

//           {
//             isEdit?
//             <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
//             :
//             <button onClick={()=>setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>
//           }
          
//         </div>
//        </div>
//     </div>
//   )
// }

// export default DoctorProfile

import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [feesError, setFeesError] = useState(null); // State for fees validation error

  const updateProfile = async () => {

    if (feesError) {
      return; // Prevent update if there's a validation error
    }


    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      }

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


  const handleFeesChange = (e) => {
    const value = e.target.value;
    const newFees = Number(value); // Convert to number for validation

    // Validate fees: positive number
    setFeesError(newFees <= 0 ? 'Fees must be a positive number.' : null);
    setProfileData(prev => ({ ...prev, fees: value }));
  };

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
                      className="border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value }
                      }))}
                      value={profileData.address.line1}
                    />
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value }
                      }))}
                      value={profileData.address.line2}
                    />
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