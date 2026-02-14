const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register',
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty(),
    async (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name,email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email exist' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name,email,password: hashedPassword });
        res.status(201).json({ message: 'User registered', id: user._id, email: user.email });
    }
)

// Login
router.post('/login',
    body('email').isEmail(),
    body('password').notEmpty().exists(),
    async (req,res,next) => {
        const { email,password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
)

module.exports = router;