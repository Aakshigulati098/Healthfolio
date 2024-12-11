import express from 'express';
import Stripe from 'stripe';
import appointmentModel from '../models/appointmentModel.js';
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, registerUser, updateProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const stripe = new Stripe('sk_test_51QTMljJvzaatIdYD91sPJC3Ni7mj7BWqDgUS0EoVxRAbAJ3JcEatGrRrVJH3DqE4b5WhkUT5290HoUUFECLMXBhH00Xd4iTk9T', {
  apiVersion: '2020-08-27',
});

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);



userRouter.get('/payment-success', authUser, async (req, res) => {
  try {
    const { userId } = req.user; // Get the logged-in user's ID from `authUser`

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Payment was successful',
    });
  } catch (error) {
    console.error('Error during payment success:', error);
    res.status(500).json({ success: false, message: 'Payment success handling failed' });
  }
});

export default userRouter;
