// server/controllers/contactController.js
const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../utils/emailService');

// @desc    Submit a contact message / support inquiry
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message.'
      });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    // 1. Send email notification to the Admin
    try {
      await sendEmail({
        to: process.env.EMAIL_FROM_ADDRESS,
        subject: `New Contact Request: ${subject}`,
        text: `You have received a new message from ${name} (${email}).\n\nMessage:\n${message}`,
        html: `<h3>New Contact Request</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Subject:</strong> ${subject}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`
      });

      // 2. Send auto-reply confirmation to the User
      await sendEmail({
        to: email,
        subject: `We received your message: ${subject}`,
        text: `Hi ${name},\n\nThank you for reaching out to NextGen Voyagers. We have received your message and our team will get back to you shortly.\n\nBest Regards,\nThe NextGen Voyagers Team`,
        html: `<h3>Hi ${name},</h3>
               <p>Thank you for reaching out to NextGen Voyagers.</p>
               <p>We have received your message regarding "<strong>${subject}</strong>" and our team will get back to you shortly.</p>
               <br>
               <p>Best Regards,</p>
               <p><strong>The NextGen Voyagers Team</strong></p>`
      });
    } catch (emailError) {
      console.error('Failed to send notification emails:', emailError);
      // We don't return an error here because the message was successfully saved to the database.
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting NextGen Voyagers! Our travel safety support team has received your message and will respond shortly.',
      data: newMessage
    });
  } catch (error) {
    console.error(`Error saving contact message: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message. Please try again or reach our emergency hotline directly.',
      error: error.message
    });
  }
};

// @desc    Get all contact messages (internal/admin)
// @route   GET /api/contact
// @access  Public / Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error(`Error fetching contact messages: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving contact messages',
      error: error.message
    });
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages
};
