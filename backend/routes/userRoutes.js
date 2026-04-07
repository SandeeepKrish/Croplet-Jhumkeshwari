const express = require('express');
const User = require('../models/User');
const router = express.Router();

// =======================
// WISHLIST ROUTES
// =======================

// Get user's wishlist
router.get('/:userId/wishlist', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('wishlist');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});

// Add to wishlist
router.post('/:userId/wishlist', async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { wishlist: productId } }, // prevents duplicates
            { new: true }
        ).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to wishlist' });
    }
});

// Remove from wishlist
router.delete('/:userId/wishlist/:productId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { wishlist: req.params.productId } },
            { new: true }
        ).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
});

// =======================
// ADDRESS ROUTES
// =======================

// Get user addresses
router.get('/:userId/addresses', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.addresses || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching addresses' });
    }
});

// Add new address
router.post('/:userId/addresses', async (req, res) => {
    try {
        const newAddress = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $push: { addresses: newAddress } },
            { new: true }
        );
        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding address' });
    }
});

// Delete address
router.delete('/:userId/addresses/:addressId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { addresses: { _id: req.params.addressId } } },
            { new: true }
        );
        res.json(user.addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting address' });
    }
});

module.exports = router;
