import Feedback from '../models/feedbackModel.js'
export const submitFeedback = async (req, res) => {
 try {
   const { name, email, message, rating } = req.body
   
   if (!name || !email || !message || !rating) {
     return res.status(400).json({
       success: false,
       message: 'All fields are required'
     })
   }
    const feedback = new Feedback({
     name,
     email,
     message,
     rating
   })
    await feedback.save()
    res.status(201).json({
     success: true,
     message: 'Feedback submitted successfully',
     data: feedback
   })
 } catch (error) {
   console.error('Feedback submission error:', error)
   res.status(500).json({
     success: false,
     message: 'Failed to submit feedback',
     error: error.message
   })
 }
}