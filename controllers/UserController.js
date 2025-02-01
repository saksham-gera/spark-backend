import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { createOTPExpiry, generateOTP } from '../utils/otpUtil.js';
import { sendOTPEmail } from '../utils/mail.js';
import bcrypt from 'bcryptjs';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email } );
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = createOTPExpiry();
        await user.save();

        try {
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            return res.status(500).json({ error: 'Failed to send OTP email' });
        }

        res.json({ message: 'OTP sent successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

export const signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email: email.toLowerCase(), password: hashedPassword, role: 'citizen' });
        const token = createToken(newUser.id);

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findById(userId);
        console.log(user);
        if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }
        console.log(user.otp);
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = createToken(user.id);
        res.json({ role: user.role, message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};