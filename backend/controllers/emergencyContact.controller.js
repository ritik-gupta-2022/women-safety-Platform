import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { v4 as uuidv4 } from 'uuid';

export const addEmergencyContact = async(req,res,next) =>{
    const {phoneNo, name, email, relationship} = req.body;
    // console.log(req.body);
    if(!phoneNo || !name || !email || !relationship || phoneNo==="" || name==="" || email==="" || relationship===""){
        next(errorHandler(400, 'All fields are required'));
    }

    try{

        const userId = req.user.id;
        const user = await User.findById(userId);    

        const contactDetails = {
            id:uuidv4(),
            name,
            email,
            phoneNo, 
            relationship
        }

        user.emergencyContacts.push(contactDetails);

        await user.save();
        res.status(201).json(user);
    }
    catch(err){
        next(err);
    }
}

export const getEmergencyContacts = async(req,res,next) =>{

    const userId =req.user.id;

    if(!userId){
        return next(errorHandler(401 , "Unauthorized: You do not have access"));
    }
    try{

        const user = await User.findById(userId);
        
        if(!user){
            return next(errorHandler(401 , "Unauthorized: You do not have access"));
        }
        
        const contacts = user.emergencyContacts;

        res.status(200).json(contacts);
    }
    catch(err){
        next(err);
    }
}

export const deleteContact = async(req,res,next) =>{
    const {userId, contactId} = req.params;

    if(userId != req.user.id ){
        return next(errorHandler(403, 'You are not allowed to delete this post'));
    }

    try{
        const user = await User.findById(userId);
        // const contacts =user.emergencyContacts;
        // const foundContact=contacts.find(user => user.id === userIdToFind);
        user.emergencyContacts = user.emergencyContacts.filter(
            contact => contact.id !== contactId
        );

        await user.save();

        return res.status(200).json(user);
    }
    catch(err){
        next(err);
    }
}