const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

router
  .route('/')
  .get(getProperties)
  .post(
    protect, 
    authorize('agent', 'admin'), 
    upload.array('media', 12), 
    createProperty
  );

router
  .route('/:id')
  .get(getPropertyById)
  .put(
    protect, 
    authorize('agent', 'admin'), 
    upload.array('media', 12), // <-- FIX: Added multer here so req.body gets populated
    updateProperty
  )
  .delete(
    protect, 
    authorize('agent', 'admin'), 
    deleteProperty
  );

module.exports = router;