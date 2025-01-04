import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { mail } from "../utils/mail.js";
import createMessage, { createCall } from "../utils/sms.js";
import fetch from 'node-fetch';

export const getNews = async(req,res,next)=>{

    const topics = [
        'crime against women in India',
        'domestic violence',
        'women empowerment',
        'self-defense for women',
        'women rights in India'
    ];
    const query = topics[Math.floor(Math.random() * topics.length)];
    const sortBy = 'date'
    const url = `https://google-news13.p.rapidapi.com/search?keyword=${encodeURIComponent(query)}&lr=en-US&sort_by=${sortBy}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'google-news13.p.rapidapi.com'
        }
    };

    try{
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        res.status(200).json(result);
    }
    catch(err) {
        next(err);
    }
}

export const sendAlert = async (req,res,next) =>{
    const userId = req.user.id;
    const {lon, lat} = req.body;

    try{
        const user = await User.findById(userId);
        const contacts = user.emergencyContacts;

        if(!user){
            return next(errorHandler(401 , "Unauthorized: You do not have access"));
        }
        console.log(lon, lat);
        const locationUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
        console.log(locationUrl);

        createMessage(locationUrl);
        
        res.status(200).json("Message sent successfully");
    }
    catch(err){
        console.error(err);
        next(err);
    }
}

export const fakeCall = async (req,res) => {
    const userId = req.user.id;

    try{
        const user = await User.findById(userId);
        const contacts = user.emergencyContacts;

        if(!user){
            return next(errorHandler(401 , "Unauthorized: You do not have access"));
        }

        createCall();
        
        res.status(200).json("Call made successfully");
    }
    catch(err){
        console.error(err);
        next(err);
    }
}

export const getTutorials = async (req, res, next) => {
    const keywords = [
        "Women safety tutorials and techniques",
        "Self-defense tutorials for women",
        "Women's safety survival skills",
        "Self-defense training",
        "Safety techniques for women"
    ];

    const query = keywords[Math.floor(Math.random() * keywords.length)];

    const orderOptions = ["date", "relevance", "viewCount", "rating"];
    const order = orderOptions[Math.floor(Math.random() * orderOptions.length)];
    
    const url = `https://youtube-v31.p.rapidapi.com/search?q=${encodeURIComponent(query)}&part=snippet%2Cid&regionCode=US&maxResults=50&order=${order}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'youtube-v31.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);        

        res.status(200).json({
            videos: result.items,
        });
    } catch (err) {
        next(err);
    }
};

export const sendMail = async (req, res, next) => {
    const userId = req.user?.id;
    const { lon, lat } = req.body;

    if (!userId) {
        return next(errorHandler(401, 'Unauthorized: You do not have access'));
    }

    if (!lon || !lat) {
        return next(errorHandler(400, 'Longitude and Latitude are required.'));
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next(errorHandler(401, 'Unauthorized: You do not have access'));
        }

        const contacts = user.emergencyContacts;
        if (!contacts || contacts.length === 0) {
            return next(errorHandler(400, 'No emergency contacts found.'));
        }

        const locationUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
        const username = user.name;

        // Send Emails to All Contacts
        await Promise.all(contacts.map((contact) => mail(username, contact, locationUrl)));

        next();
    } catch (err) {
        console.error('Error in sendMail:', err);
        return next(errorHandler(500, 'Internal Server Error'));
    }
};