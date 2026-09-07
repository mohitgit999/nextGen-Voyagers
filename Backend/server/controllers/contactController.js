// server/controllers/contactController.js
const ContactMessage = require('../models/ContactMessage');

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
