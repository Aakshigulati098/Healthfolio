
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Doctors = () => {

    const { speciality }= useParams();
    const [filterDoc, setFilterDoc]=useState([]);
    const [showFilter, setShowFilter]=useState(false);
    const navigate=useNavigate();
    const{doctors}= useContext(AppContext)

    const appltFiler=()=>{
        if(speciality){
            setFilterDoc(doctors.filter(doc=> doc.speciality===speciality))
        } else{
            setFilterDoc(doctors)
        }
    }

    useEffect(()=>{
        appltFiler()

    }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600 text-lg font-semibold'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
      <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter?'bg-primary text-white' :''}`} onClick={()=>setShowFilter(prev=>!prev)}>Filters</button>
        <div className={`flex-col gap-3 text-sm text-gray-600 ${showFilter? 'flex':'hidden sm:flex'}`}>
            <p onClick={()=> speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="General physician" ? "bg-green-50 border border-primary" : "" }`}>General physician</p>
            <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Gynecologist" ? "bg-green-50 border border-primary" : "" }`}>Gynecologist</p>
            <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Dermatologist" ? "bg-green-50 border border-primary" : "" }`}>Dermatologist</p>
            <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Pediatricians" ? "bg-green-50 border border-primary" : "" }`}>Pediatricians</p>
            <p onClick={()=> speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Neurologist" ? "bg-green-50 border border-primary" : "" }`}>Neurologist</p>
            <p onClick={()=> speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="Gastroenterologist " ? "bg-green-50 border border-primary" : "" }`}>Gastroenterologist</p>
        </div>

        <div className='w-full grid grid-cols-auto gap-4 gap-y-6  '>
            {
                filterDoc.map((item,index)=>(
            <div onClick={()=>navigate(`/appointment/${item._id}`)} className='border border-primary rounded-md overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300' key={index}> 
              <img className='bg-green-50' src={item.image}/>
                <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-500" : "text-gray-500"}`}>
                        <div className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-red-500"}`}></div>
                        <p>{item.available ? "Available" : "Not Available"}</p>
                    </div>
                    <p className='text-gray-900 text-md font-bold'>{item.name}</p>
                    <p className='text-gray-600 text-sm font-semibold'>{item.speciality}</p>
                </div>
            </div>
        ))

            }
        </div>
      </div>
    </div>
  )
}

export default Doctors