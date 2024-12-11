import express from 'express'
import cors from'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import feedbackRouter from './routes/feedbackRoute.js'
import Stripe from 'stripe';
import appointmentModel from './models/appointmentModel.js'
import authUser from './middlewares/authUser.js'
const stripe = new Stripe("sk_test_51QTMljJvzaatIdYD3fLfj8rFLXSTPsanjoBXmNSSEoMxbH77k6miokIVIEfgOOPWAglAmzHExCWTTlWchH6z0TFf00DEna4mg9");

//app config
const app = express()
const port=process.env.port || 4000
connectDB()
connectCloudinary()
//middlewares
app.use(express.json())
app.use(cors())

//api endpoint
app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.post("/api/user/make-payment", authUser, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    console.log("Creating payment session for appointment:", appointmentId);

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.cancelled) {
      return res.status(404).json({ success: false, message: "Appointment cancelled or not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Consultation with ${appointment.docData.name}`,
            },
            unit_amount: Math.round(appointment.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/my-appointments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:4000/api/payment-cancel",
      metadata: {
        appointmentId: appointmentId.toString() // Ensure it's a string
      },
    });

    console.log("Created Stripe session:", {
      id: session.id,
      metadata: session.metadata
    });

    res.status(200).json({ success: true, id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
});


app.post("/api/user/verify-payment", authUser, async (req, res) => {
  try {
    const { session_id } = req.body; // Extract session_id from the request

    console.log("Received session_id:", session_id);

    // Fetch Stripe session data
    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log("Retrieved session data:", session);

    if (session.payment_status === "paid") {
      const appointmentId = session.metadata.appointmentId;// Extract the appointmentId
      // console.log("Found appointmentId to verify:", appointmentId);
      if (!appointmentId) {
        return res.status(400).json({ success: false, message: "Appointment ID is missing in session metadata" });
      }
      // Update database only if the Stripe payment is successful
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { payment: true },
        { new: true }
      );

      console.log("Updated appointment record:", updatedAppointment);

      if (updatedAppointment) {
        return res.status(200).json({ success: true, message: "Payment successful, database updated" });
      } else {
        return res.status(404).json({ success: false, message: "Appointment ID not found or already processed" });
      }
    } else {
      console.log("Payment not successful.");
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    return res.status(500).json({ success: false, message: "Error verifying payment" });
  }
});


app.get("/api/payment-success", (req, res) => {
  res.send("Payment successful!");

});

app.get("/api/payment-cancel", (req, res) => {
  res.send("Payment cancelled.");
});

app.use('/api/admin',adminRouter)
//localhost:4000/api/admin/add-doctor
app.use('/api/doctor',doctorRouter)

app.use('/api/user',userRouter)
app.use('/api/feedback', feedbackRouter)

app.listen(port,()=>{
    console.log("Server Started",port)
})
