import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                name: user.name,
            },
        };

        // Sign and return token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' }, 
            (err, token) => {
                if (err) throw err;
                // FIX: Now returning user.id
                res.json({ token, name: user.name, id: user.id }); 
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                name: user.name,
            },
        };

        // Sign and return token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' }, 
            (err, token) => {
                if (err) throw err;
                // FIX: Now returning user.id
                res.json({ token, name: user.name, id: user.id }); 
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
