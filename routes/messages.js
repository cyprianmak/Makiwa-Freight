const express = require('express');
const { Message, User } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all messages for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.getAll();
    
    res.json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Send a message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { recipient, body } = req.body;
    
    // Find recipient by email
    const recipientUser = await User.findByEmail(recipient);
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }
    
    const message = await Message.create({
      sender_id: req.user.id,
      recipient_id: recipientUser.id,
      sender_email: req.user.email,
      body
    });
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete a message
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Message.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
