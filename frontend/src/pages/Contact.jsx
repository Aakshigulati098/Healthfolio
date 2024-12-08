
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const Contact = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5,
  });
  const { backendUrl, token } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/feedback', feedback, { headers: { token } });
      if (data.success) {
        toast.success('Thank you for your feedback!');
        setFeedback({ name: '', email: '', message: '', rating: 5 }); // Reset form
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="border border-primary max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Section - Contact Details */}
          <div className="bg-gradient-to-br from-green-800 to-green-600 text-white p-6 md:w-1/3">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="mb-4 text-sm text-gray-200">We'd love to hear from you! Reach out with your feedback or inquiries.</p>
            <div className="space-y-4 text-gray-100 text-sm">
              <p>
                <strong>Address:</strong> Chitkara University, Rajpura, Patiala, India
              </p>
              <p>
                <strong>Phone:</strong> +91-78888-80XXX
              </p>
              <p>
                <strong>Email:</strong> admin@healthpholio.com
              </p>
            </div>
          </div>

          {/* Right Section - Feedback Form */}
          <div className="p-8 md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={feedback.name}
                  onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={feedback.email}
                  onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>

              {/* Rating Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate Us</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedback({ ...feedback, rating: star })}
                      className={`text-3xl ${
                        star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                      } transition duration-300`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  required
                  rows="4"
                  value={feedback.message}
                  onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                  placeholder="Tell us about your experience..."
                  className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-800 transition duration-300"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;