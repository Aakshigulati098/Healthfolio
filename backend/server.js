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

app.post("/api/user/make-payment", async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Fetch appointment details
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Ensure the fee is defined and valid
    if (!appointment.amount || typeof appointment.amount !== "number") {
      return res.status(400).json({ success: false, message: "Invalid appointment fee" });
    }

    // Create Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Consultation with ${appointment.docData.name}`,
            },
            unit_amount: Math.round(appointment.amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:4000/api/payment-success",
      cancel_url: "http://localhost:4000/api/payment-cancel",
    });

    res.status(200).json({ success: true, id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
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