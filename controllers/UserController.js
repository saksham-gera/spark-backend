import {User} from '../models/User.js';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, "mysecretcode", { expiresIn: '3d' });
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const currentUser = await User.login(email, password)
        const token = createToken(currentUser._id);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name);
    console.log(email);
    console.log(password);
    try {
        const createdUser = await User.signup(email, password);
        await User.findByIdAndUpdate(createdUser._id, {name})

        const token = createToken(createdUser._id);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
 // Ensure correct path

export const updateUserPageVisits = async (req, res) => {
    const { userId, pageVisited } = req.body;

    if (!userId || !pageVisited) {
        return res.status(400).json({ message: 'Invalid request format' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Iterate over each page in the pageVisits object and update the counters
        Object.entries(pageVisited).forEach(([pageName, incrementBy]) => {
            if (typeof user[pageName] === 'number') { // Check if the field exists and is a number
                user[pageName] += incrementBy;
            }
        });

        await user.save();

        return res.status(200).json({ message: 'Page visits updated successfully', user });
    } catch (error) {
        console.log(error)
        console.error('Error updating page visits:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const deleteAllSelectedEntries = async (req, res) => {
    try {
        console.log(req.body);
        await User.deleteMany({_id: { $in: req.body}});
        res.send({ message: 'Selected Users have been deleted successfully' });
    } catch (error) {
        console.error('Error deleting images:', error);
        res.status(500).send({ message: 'Error deleting Selected Users' });
    }
};
