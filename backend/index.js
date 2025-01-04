import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';  // package for extracting cokie from browser
import authRoutes from './routes/auth.route.js';
import contactRoutes from './routes/emergencyContacts.route.js';
import featureRoutes from './routes/features.route.js';
import complaintRoutes from './routes/complaint.route.js';

// This line loads environment variables from the .env file into process.env
dotenv.config()


// mongo url
mongoose.connect(process.env.MONGO)
.then(()=>console.log("mongoDB connected"))
.catch((err)=>console.log(err))

const app = express();

app.listen(3000,()=>{
    console.log("server connected at port 3000");
});
const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow credentials like cookies if needed
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); 

// app.use(cors());
// for converting json data to object sent by server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('hello world');
    console.log("hii");
})
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feature", featureRoutes);
app.use("/api/complaint", complaintRoutes);

//this middleware will be called when an error is tackled , this is to increase code reusability, global error handler

app.use((err, req, res, next)=>{
    const statusCode = err.StatusCode || 500;
    const message = err.message || 'Internal Server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})