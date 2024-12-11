
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointments = () => {

  const {docId}= useParams();
  const {doctors, currencySymbol, backendUrl, token, getDoctorData} = useContext(AppContext)
  const daysOFWeek=['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate= useNavigate();

  const[docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots]=useState([])
  const [slotIndex, setSlotIndex]= useState(0)
  const [slotTime, setSlotTime]=useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id ===docId)
    setDocInfo(docInfo)
    
  }

  const getAvailableSlots= async () =>{
     setDocSlots([])
    //getting current date

    let today=new Date()
    for(let i=0;i<7;i++){
      let currentDate= new Date(today)
      currentDate.setDate(today.getDate()+i)

      //setting end time of the date with index
      let endTime= new Date()
      endTime.setDate(today.getDate() +i)
      endTime.setHours(21,0,0,0)

      if(today.getDate()===currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>10 ? currentDate.getHours()+1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots=[]

      while(currentDate<endTime){
        let formattedTime=currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit' })


        let day=currentDate.getDate()
        let month=currentDate.getMonth()+1
        let year=currentDate.getFullYear()

        const slotDate=day+"_"+month+"_"+year
        const slotTime=formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if(isSlotAvailable){
          //add time to slots
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        }

        

        // Increment current time by 30 min
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }


  const bookAppointment=async()=>{
    if(!token){
      toast.warn('Login to Book Appointment');
      return navigate('/patient-login')
       
    }

    try {
      const date=docSlots[slotIndex][0].datetime

      let day=date.getDate()
      let month=date.getMonth()+1
      let year=date.getFullYear()

      const slotDate=day+"_"+month+"_"+year

      const {data}=await axios.post(backendUrl+'/api/user/book-appointment', {docId, slotDate, slotTime}, {headers: {token}})
      if(data.success){
        toast.success(data.message)
        getDoctorData()
        navigate('/my-appointments')
      } else{
        toast.error(data.message)
      }
      

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    fetchDocInfo()
  }, [doctors, docId])
  
  useEffect(()=>{
    if(docInfo)getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    // console.log( docSlots);
  },[docSlots ])

  return docInfo && (
    <div>
      {/*-----Doctor Details*/}
      <div className='flex flex-col sm:flex-row gap-4'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div >
          <img className='bg-green-50 border border-green-150 w-full sm:max-w-72 rounded-md' src={docInfo.image}></img>
        </div>

        <div className='flex-1 border border-gray-400 rounded-md p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/*------ Doc Info: name, degree, exper ------ */}
          <p className='flex items-center gap-2 text-2xl font-bold text-gray-900'>{docInfo.name}
           <img className='w-5' src={assets.verified_icon}></img>
           </p>
          <div className='flex items-center gap-2 text-sm mt-1 font-semibold text-green-700'>
            <p>{docInfo.degree} - {docInfo.speciality} </p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          {/*-----Doctor About----- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon}></img></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>
      </div>

      {/*----- Booking slot-----*/}
      {docSlots.length > 0 && docSlots.some(slot => slot.length > 0) && (
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docSlots.map((item, index)=>(
                item.length > 0 && (
                  <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                    <p>{daysOFWeek[item[0].datetime.getDay()]}</p>
                    <p>{item[0].datetime.getDate()}</p>
                  </div>
                )
              ))
            }
          </div>

          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlots[slotIndex].map((item,index)=>(
              <p onClick={()=> setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? 'bg-primary text-white' : ' text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          
          <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-md my-6'>Book an Appointment</button>
        </div>
      )}

      {/*----Related Doctors ----*/}
      <RelatedDoctors docID={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointments
