import express from 'express';
const router = express.Router();
import { loginUser, signupUser, verifyOTP } from '../controllers/UserController.js';
import { User } from '../models/User.js';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/verify-otp', verifyOTP);

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/login', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ userId: user.id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
