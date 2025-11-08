// backend/routes/api/profile.js

import express from 'express'; // FIX: Change require('express') to import
import Profile from '../models/Profile.js'; // FIX: Change require, add .js extension
import User from '../models/User.js'; // FIX: Change require, add .js extension
import auth from '../middleware/auth.js'; // FIX: Change require to import, correct path to '../middleware/auth.js'

const router = express.Router();

// @route   GET api/profile/me
// @desc    Get current user's profile (Private)
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // Find the profile linked to the user ID provided by the 'auth' middleware
        let profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'email']);

        // If no profile exists, create a basic one (this handles first-time login)
        if (!profile) {
            // Create a new basic profile
            const profileFields = { user: req.user.id, bio: 'No bio set yet.', location: 'Earth' };
            profile = new Profile(profileFields);
            await profile.save();
            
            // Re-fetch the profile to populate the user details
            profile = await Profile.findOne({ user: req.user.id })
                .populate('user', ['name', 'email']);
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- CRITICAL FIX: The export must be 'export default' to match your server.js import ---
export default router;