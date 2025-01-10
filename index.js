import express from 'express';
import UserRoutes from './routes/UserRoutes.js'
import AdminRoutes from './routes/AdminRoutes.js'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
dotenv.config();
const app = express();
// MongoDB connection URI
const mongoURI = process.env.MONGO_URL;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

// Connect to MongoDB
mongoose.connect(mongoURI, {

}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.log('Error connecting to MongoDB Atlas:', err.message);
});

const port = 2001;
// const corsOptions = {
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200
// }
// Use the routes
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/users',UserRoutes);
app.use('/admin',AdminRoutes);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});