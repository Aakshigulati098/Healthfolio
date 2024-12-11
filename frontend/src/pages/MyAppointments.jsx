import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe
const stripePromise = loadStripe('pk_test_51QTMljJvzaatIdYD91sPJC3Ni7mj7BWqDgUS0EoVxRAbAJ3JcEatGrRrVJH3DqE4b5WhkUT5290HoUUFECLMXBhH00Xd4iTk9T');

const MyAppointments = () => {
  const { backendUrl, token, getDoctorData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State to manage payment UI changes
  const navigate = useNavigate();
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Cancel appointment logic
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const makePayment = async (appointmentId) => {
    try {
      const stripe = await stripePromise;
  
      const response = await axios.post(
        `${backendUrl}/api/user/make-payment`,
        { appointmentId },
        { headers: { token } }
      );
  
      const session = response.data;
  
      if (session?.id) {
        console.log("Stripe sessionId:", session.id);
  
        // Redirect user to Stripe's hosted payment page
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
  
        if (result.error) {
          toast.error("Stripe Checkout Error: " + result.error.message);
        }
      }
    } catch (error) {
      console.error('Payment initiation failed', error);
      toast.error('Payment initiation failed');
    }
  };
  
  
   
  useEffect(() => {
    const checkPaymentSuccess = async () => {
      if (window.location.href.includes('/payment-success')) {
        try {
          toast.success("Payment Successful!");
          navigate('/my-appointments');
        } catch (error) {
          console.error('Error during navigation to appointments:', error);
        }
      }
    };
  
    checkPaymentSuccess();
  }, [navigate]);


  
  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (sessionId) {
        try {
          console.log("Verifying payment with sessionId:", sessionId);
          
          const response = await axios.post(
            `${backendUrl}/api/user/verify-payment`,
            { session_id: sessionId },
            { headers: { token } }
          );

          console.log("Payment verification response:", response.data);

          if (response.data.success) {
            toast.success("Payment successful!");
            await getUserAppointments(); // Make sure to await this
            window.history.replaceState({}, document.title, "/my-appointments");
          } else {
            toast.error(response.data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error(error.response?.data?.message || "Error verifying payment");
        }
      }
    };

    verifyPayment();
  }, [backendUrl, token]);
  
  
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="pb-3 mt-8 text-xl font-medium text-zinc-700 border-b">My Appointments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {appointments.map((item, index) => (
          <div key={index} className="bg-white rounded-md shadow-md overflow-hidden border border-green-200">
            {/* Card Header with Image */}
            <div className="relative h-48 overflow-hidden flex justify-center items-center">
              <img 
                className="w-1/2 h-full object-cover"
                src={item.docData.image}
                alt={item.docData.name}
              />
            </div>

            {/* Card Content */}
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-neutral-800">{item.docData.name}</h3>
              <p className="text-primary font-medium">{item.docData.speciality}</p>

              <div className="mt-3">
                <p className="text-zinc-700 font-semibold text-sm">Address:</p>
                <p className="text-xs text-zinc-600">{item.docData.address.line1}</p>
                <p className="text-xs text-zinc-600">{item.docData.address.line2}</p>
              </div>

              <div className="mt-3">
                <p className="text-zinc-700 font-semibold text-sm">Date & Time:</p>
                <p className="text-xs text-zinc-600">
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              {/* Card Actions */}
              <div className="mt-4 space-y-2">
                {!item.cancelled && (
                  <>
                    {item.payment ? (
                      <div className="w-full text-sm text-green-600 py-2 border rounded bg-green-100">
                        Payment Paid
                      </div>
                    ) : (
                      <button
                        onClick={() => makePayment(item._id)}
                        className="w-full text-sm text-stone-500 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        Pay Online
                      </button>
                    )}
                    {!item.payment && (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="w-full text-sm text-stone-500 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </>
                )}
                {item.cancelled && (
                  <button className="w-full py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
