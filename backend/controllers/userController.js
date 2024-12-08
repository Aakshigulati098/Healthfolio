import validator from 'validator';
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'
//api to register user
const registerUser= async(req,res)=>{
    try{
     const {name,email,password}=req.body;
     if(!name || !email || !password){
        res.json({success:false,message:"Missing details"})
     }
     if(!validator.isEmail(email)){
          res.json({success:false,message:"Invalid email"})
     }
     if(password.length<8){
        res.json({success:false,message:"Enter a strong password"})
     }
      
     //hash password
     const salt =await bcrypt.genSalt(10);
     const hashedPassword =await bcrypt.hash(password,salt);

     const userData = {
        name,
        email,
        password : hashedPassword
     }
     const newUser = new userModel(userData)
     const user = await newUser.save()
     //_id create token 
     
     const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
     res.json({success:true,token})
    }catch(error){
      console.log(error)
      res.json({success:false,message:error.message})
    }
}

// api for user login
const loginUser = async(req,res)=>{
   try {
      const {email,password} = req.body
      const user = await userModel.findOne({email})
      if(!user){
         return res.json({success:false,message:"User Doesnt Exist"})
      }
      const isMatch = await bcrypt.compare(password,user.password)

      if(isMatch){
         const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
         res.json({success:true,token})
      }else{
         res.json({success:false,message:"Invalid Credentials"})
      }

   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
   }
}
//api to get user profile data
const getProfile = async(req,res)=>{
   try {
      const {userId} = req.body
      const userData = await userModel.findById(userId).select('-password')

      res.json({success:true,userData})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
   }
}

//update prfile
const updateProfile=async(req,res)=>{
     try {
      const {userId,name,phone,address,dob,gender} = req.body
      const imageFile = req.file
      if (!name || !phone || !dob || !gender) {
         return res.json({success:false,message:"Missing data"})
      }

      await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
      if(imageFile){
         //upload image to cloudinary
         const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})

         const imageUrl =imageUpload.secure_url

         await userModel.findByIdAndUpdate(userId,{image:imageUrl})
      }
      res.json({success:true,message:"Profile updated"})
      
     } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
     }
}

// book appointment
const bookAppointment = async (req, res) => {
   try {
      const {userId,docId,slotDate,slotTime}=req.body

      const docData = await doctorModel.findById(docId).select('-password')

      if(!docData.available){
         return res.json({success:false,message:"Doctor is not available for this slot"})
      }

      let slots_booked = docData.slots_booked
      //check for slot avalablility
      if(slots_booked[slotDate]){
         if(slots_booked[slotDate].includes(slotTime)){
            return res.json({success:false,message:"Slot not available"})
         }else{
            // we can book 
            slots_booked[slotDate].push(slotTime)
         }
      }
      //nobody booked
      else{
         slots_booked[slotDate]=[]
         slots_booked[slotDate].push(slotTime)
      }

      const userData = await userModel.findById(userId).select("-password")
      // deleting bcz we have to save docdata in appointment data to avoid unneccesary data
      delete docData.slots_booked

      const appointmentData = {
         userId,
         docId,
         userData,
         docData,
         amount:docData.fees,
         slotTime,
         slotDate,
         date:Date.now()
      }
      const newAppointment = new appointmentModel(appointmentData)
      await newAppointment.save()

      //save new slots data in doctors data
      await doctorModel.findByIdAndUpdate(docId, {slots_booked}, {new:true})

      res.json({success:true,message:"Appointment booked"})

   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
   }
}

// api to get user appointments for drontend my-appointments page

const listAppointment = async(req,res)=>{
   try {
      const {userId} = req.body
      const appointments = await appointmentModel.find({userId})
      res.json({success:true,appointments})
   } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
   }
}

// api to cancel appointment

const cancelAppointment = async(req,res)=>{
    try {
       const {appointmentId,userId} = req.body
       const appointmentData = await appointmentModel.findById(appointmentId)
      // verify appointment user
       if(appointmentData.userId !== userId){
         return res.json({success:false,message:"Unauthorized action"})
       }
       await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
       // releasing doctors slot
       const {docId,slotDate,slotTime} = appointmentData
       const doctorData = await doctorModel.findById(docId)

       let slots_booked = doctorData.slots_booked
       slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e !== slotTime)
       await doctorModel.findByIdAndUpdate(docId, {slots_booked})

       res.json({success:true,message:'Appointment cancelled'})

    } catch (error) {
      console.log(error)
      res.json({success:false,message:error.message})
    }
}

// api to  make payment using razorpay
// const razorpayInstance = new razorpay({
//    key_id: 'YOUR_KEY_ID',
//    key_secret: 'YOUR_KEY_SECRET',
// })
// const paymentRazorpay = async(req,res)=>{
   
// }
export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment}