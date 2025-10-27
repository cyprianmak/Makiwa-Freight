const express = require('express');
const { Load } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all loads
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { origin, destination, shipper_id } = req.query;
    const filters = {};
    
    if (origin) filters.origin = origin;
    if (destination) filters.destination = destination;
    if (shipper_id) filters.shipper_id = shipper_id;
    
    const loads = await Load.getAll(filters);
    
    res.json({
      success: true,
      data: {
        loads
      }
    });
  } catch (error) {
    console.error('Get loads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create a new load
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { origin, destination, date, cargo_type, weight, notes } = req.body;
    
    const load = await Load.create({
      origin,
      destination,
      date,
      cargo_type,
      weight,
      notes,
      shipper_id: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Load posted successfully',
      data: {
        load
      }
    });
  } catch (error) {
    console.error('Create load error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update a load
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { origin, destination, date, cargo_type, weight, notes } = req.body;
    
    // Check if load exists and belongs to user or user is admin
    const existingLoad = await Load.findById(id);
    if (!existingLoad) {
      return res.status(404).json({
        success: false,
        message: 'Load not found'
      });
    }
    
    if (existingLoad.shipper_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only edit your own loads.'
      });
    }
    
    const updatedLoad = await Load.update(id, {
      origin,
      destination,
      date,
      cargo_type,
      weight,
      notes
    });
    
    res.json({
      success: true,
      message: 'Load updated successfully',
      data: {
        load: updatedLoad
      }
    });
  } catch (error) {
    console.error('Update load error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete a load
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if load exists and belongs to user or user is admin
    const existingLoad = await Load.findById(id);
    if (!existingLoad) {
      return res.status(404).json({
        success: false,
        message: 'Load not found'
      });
    }
    
    if (existingLoad.shipper_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own loads.'
      });
    }
    
    const deleted = await Load.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Load not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Load deleted successfully'
    });
  } catch (error) {
    console.error('Delete load error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
