import express from 'express';
const router = express.Router({mergeParams: true});
import {getAllUsersPageVisits, loginAdminUser,signupAdminUser} from '../controllers/AdminController.js';
import jwt from 'jsonwebtoken';
import  {Admin}  from '../models/Admin.js';


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, 'mysecretcode', (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
};

// Route to handle user login
router.post('/login', (req, res) => {
    loginAdminUser(req, res);
});

router.get('/login', verifyToken , async (req, res) => {
    const currUser = await Admin.findById(req.user.id);
    res.json({name: currUser.name, email: currUser.email});
});
router.get('/allUsersInfo',getAllUsersPageVisits);
// Route to handle user signup
router.post('/signup', (req, res) => {
    signupAdminUser(req, res);
});

// // Route to save an image for a user
// router.put('/:userId/images', saveImageForUser);

// // Route to get all images for a user
// router.get('/:userId/images', getAllImagesForUser);
// router.get('/:imageId', getImageData);
// router.delete('/deleteImage',deleteAllImages);

export default router;
