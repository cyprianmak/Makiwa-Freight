const express = require('express');
const { User, Load, Message, AccessControl } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin rights required.'
    });
  }
  next();
};

// Apply admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// Get access control settings
router.get('/access-control', async (req, res) => {
  try {
    const accessControl = await AccessControl.get();
    
    res.json({
      success: true,
      data: accessControl
    });
  } catch (error) {
    console.error('Get access control error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update access control settings
router.put('/access-control', async (req, res) => {
  try {
    const { post_loads_enabled, banners, pages, user_access } = req.body;
    
    const updatedAccessControl = await AccessControl.update({
      post_loads_enabled,
      banners,
      pages,
      user_access
    });
    
    res.json({
      success: true,
      message: 'Access control updated successfully',
      data: updatedAccessControl
    });
  } catch (error) {
    console.error('Update access control error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get banners
router.get('/banners', async (req, res) => {
  try {
    const accessControl = await AccessControl.get();
    
    res.json({
      success: true,
      data: {
        banners: accessControl.banners || {}
      }
    });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update banners
router.post('/banners', async (req, res) => {
  try {
    const { index, dashboard } = req.body;
    
    const accessControl = await AccessControl.get();
    const updatedBanners = { ...accessControl.banners };
    
    if (index !== undefined) updatedBanners.index = index;
    if (dashboard !== undefined) updatedBanners.dashboard = dashboard;
    
    await AccessControl.update({
      ...accessControl,
      banners: updatedBanners
    });
    
    res.json({
      success: true,
      message: 'Banners updated successfully',
      data: {
        banners: updatedBanners
      }
    });
  } catch (error) {
    console.error('Update banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Reset user password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update password
    await User.update(user.id, { password });
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
