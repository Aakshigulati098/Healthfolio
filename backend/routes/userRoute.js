import express from 'express'
import  appointmentModel from '../models/appointmentModel.js'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, registerUser, updateProfile } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()
userRouter.post('/register', registerUser)

userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)

userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)

userRouter.post('/book-appointment',authUser,bookAppointment)
//authuser for userid
userRouter.get('/appointments',authUser,listAppointment)

userRouter.post('/cancel-appointment',authUser,cancelAppointment)

userRouter.post('/make-payment', async (req, res) => {
    const { appointmentId } = req.body;
  
    // Validate that appointmentId exists
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }
  
    try {
      // Ensure the appointmentId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ success: false, message: 'Invalid appointment ID' });
      }
  
      // Find and update the payment status in the database
      const appointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { payment: true },
        { new: true }
      );
  
      // Handle case if no appointment was found for that ID
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Payment successful',
        appointment: {
          id: appointment._id,
          paymentStatus: appointment.payment,
        },
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      res.status(500).json({ success: false, message: 'Payment failed', error });
    }
  });
  
export default userRouter
