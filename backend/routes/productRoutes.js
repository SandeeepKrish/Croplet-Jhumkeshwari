const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const adminController = require('../controllers/adminController');
const { adminProtect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Public route to get products
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);

// Admin routes to manage products
router.post('/', adminProtect, upload.single('image'), adminController.createProduct);
router.delete('/:id', adminProtect, adminController.deleteProduct);

module.exports = router;
