import {Admin} from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
const createToken = (id) => {
    return jwt.sign({ id }, "mysecretcode", { expiresIn: '3d' });
}

export const loginAdminUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const currentUser = await Admin.login(email, password)
        const token = createToken(currentUser._id);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const signupAdminUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const createdUser = await Admin.signup(email, password);
        await Admin.findByIdAndUpdate(createdUser._id, {name})

        const token = createToken(createdUser._id);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


export const getAllUsersPageVisits = async (req, res) => {
    try {
      // Check if the request user is an admin
  
      // Fetch all users with their page visit data
      const users = await User.find({}, 'name  email password services aboutUs nutritionStrategy ayurveda protien diet'); // Select specific fields to return
      res.json(users);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Error fetching user data', error });
    }
  };
  
// // Controller method to save image for a user
// export const saveImageForUser = async (req, res) => {
//     try {

//         const user = await Admin.findById(req.params.userId); // Find the user by ID
//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }
//         const {photo}=req.body;
//         // console.log(photo);
//         const newImage= new Images(
//             {
//                 Data : photo
//             });
            
//             const savedImage = await newImage.save();
//         await Admin.findByIdAndUpdate(req.params.userId, {
//              $push: { images: savedImage._id } 
//             }); 
//             res.status(201).send({ savedImage });
        
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// };


// // Controller method to get all images for a user
// export const getAllImagesForUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId); // Find the user by ID
//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }
  
//         res.send({
//              images: user.images
//             });
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// };


// export const getImageData = async (req, res) => {

//     try {
//         // Fetch image data from the database
//         const image = await Images.findById(req.params.imageId);
//         const imageData = image.Data;
//         if (!imageData) {
//             return res.status(404).json({ error: error.message});
//         }

//         res.status(200).send({ image });
//     } catch (error) {
//         console.error('Error fetching image data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// const deleteAllImages = async (req, res) => {
//     try {
//         // Step 1: Delete all documents from the Images collection
//         await Images.deleteMany({});

//         // Step 2 (Optional): Clear the images array in all User documents
//         // This step is necessary if you want to maintain referential integrity
//         await User.updateMany({}, { $set: { images: [] } });

//         res.send({ message: 'All images have been deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting images:', error);
//         res.status(500).send({ message: 'Error deleting images' });
//     }
// };

// export default deleteAllImages;
