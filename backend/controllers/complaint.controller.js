import Complaint from "../models/complaint.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


export const registerComplaint = async(req,res,next)=>{
    const userId = req.user.id;
    const { description , location} = req.body;

    if(!userId){
        return next(errorHandler(401, "Unauthorized: You are not allowed to register a complaint"));
    }

    if(!description || description==="" || !location || location===""){
        return next(errorHandler(403, "All Fields are required"));
    }

    try{
      
        const complaint = new Complaint({ userId, description,location });
        await complaint.save();

        res.status(201).json( complaint );
    }
    catch(err){
        next(err);
    }
}

export const getAllComplaints = async(req,res,next) =>{
    const userId = req.user.id;

    if(!userId){
        return next(errorHandler(401, "Unauthorized: You are not allowed"));
    }

    try{
        const user = await User.findById(userId);

        //Only Admin remaining
        if(!user){
            return next(errorHandler(401, "Unauthorized: You are not allowed"));
        }

        // Fetch all complaints and populate the 'userId' field with user details
        const complaints = await Complaint.find({  }).populate('userId', 'username email phoneNo address');
        
        res.status(200).json(complaints);
    }
    catch(err){
        next(err);
    }
}

export const getComplaintsByUser = async (req,res,next) =>{
    const userId = req.user.id;

    if(!userId){
        return next(errorHandler(401, "Unauthorized: You are not allowed to register a complaint"));
    }

    try{
        const userComplaints = await Complaint.find({ userId });

        if (userComplaints.length === 0) {
            return res.status(404).json({ message: 'No complaints found for this user' });
        }

        res.status(200).json(userComplaints);
    } 
    catch(err){
        next(err);
    }
}

export const deleteComplaint = async(req,res,next)=>{
    const userId = req.user.id;
    const {complaintId} = req.params;

    if(!userId){
        return next(errorHandler(401, "Unauthorized: You are not allowed to delete this complaint"));
    }
    if(!complaintId){
        return next(errorHandler(404, "Not Found: No Complaint Found"));
    }

    try{
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return next(errorHandler(404, "Complaint not found"));
        }

        // console.log(complaint.userId);
        // console.log(userId);

        if(userId != complaint.userId){
            return next(errorHandler(401, "Unauthorized: You are not allowed to delete this complaint"));
        }

        await Complaint.findByIdAndDelete(complaintId);
        res.status(200).json(complaint);
    } 
    catch(err){
        next(err);
    }
}

export const anonymousComplaint = async(req,res,next) =>{
    const userId = req.user.id;
    const { description , location} = req.body;

    if(!userId){
        return next(errorHandler(401, "Unauthorized: You are not allowed to register a complaint"));
    }

    if(!description || description==="" || !location || location===""){
        return next(errorHandler(403, "All Fields are required"));
    }

    try{
      
        const complaint = new Complaint({ userId, description,location, isAnonymous:true });
        await complaint.save();

        res.status(201).json( complaint );
    }
    catch(err){
        next(err);
    }
}

export const getAllAnonymousComplaints = async(req,res,next) =>{
    const userId = req.user.id;

    if(!userId){
        return next(errorHandler(401, "Unauthorized: You are not allowed"));
    }

    try{
        const user = await User.findById(userId);

        //Only Admin remaining
        if(!user){
            return next(errorHandler(401, "Unauthorized: You are not allowed"));
        }

        // Fetch all complaints and populate the 'userId' field with user details
        const complaints = await Complaint.find({ isAnonymous: true }).populate('userId', 'username email phoneNo address');
        
        res.status(200).json(complaints);
    }
    catch(err){
        next(err);
    }
}

export const updateComplaintStatus = async(req,res,next)=>{
    const user = req.user;
    const {status} = req.body;
    const {complaintId} = req.params;
    // if(!user.role || user.role !== "admin"){
    //     return next(errorHandler(401, "Unauthorized: You are not allowed"));
    // }

    try{
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return next(errorHandler(404, "Complaint not found"));
        }
        complaint.status = status;
        await complaint.save();
        res.status(200).json(complaint);
    }
    catch(err){
        next(err);
    }
}