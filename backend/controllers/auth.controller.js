import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/error.js";

export const userSignUp = async(req,res,next)=>{
    const {username, name , password, email, phoneNo, address} = req.body;

    if(!username|| !name || !email || !password || !email || !phoneNo || !address || username === '' || name==='' || email === '' || password === '' || address==='' || phoneNo===''){
        next(errorHandler(400, 'All fields are required'));
    }
    const hashedPass = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        name,
        email,
        phoneNo,
        address,
        password:hashedPass,
    })

    try{
        await newUser.save();
        res.status(201).json({ message: "Sign-Up Successful" });
    }
    catch(err){
        next(err);
    }
}

export const userSignin = async(req,res,next)=>{
    const {username, password} = req.body;

    if(!username || !password || username === ''|| password === ''){
        next(errorHandler(400, 'All fields are required'));
    }

    try{
        const user  = await User.findOne({username});

        if(!user){
            return next(errorHandler(404, 'User not found'));
        } 

        const validPassword = bcryptjs.compareSync(password, user.password);

        if(!validPassword){
            return next(errorHandler(400, 'Invalid password'));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY,);

        const { password :pass, ...rest} = user._doc

        res.status(200).cookie('access_token', token, {
            httpOnly: false,
        })
        .json(rest);
        
    }
    catch(err){
        next(err);
    }
}

export const updateDetails = async (req,res,next) =>{
    const {username, name , email, phoneNo, address} = req.body;
    const userId = req.user.id;

    if(!username|| !name || !email || !email || !phoneNo || !address || username === '' || name==='' || email === '' || address==='' || phoneNo===''){
        next(errorHandler(400, 'All fields are required'));
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
              $set: {
                username,
                name,
                email,
                phoneNo,
                address
              },
            },
            { new: true }  // new:true sends the updated info to db
          );
        //   const { password, ...rest } = updatedUser._doc;
          res.status(200).json(updatedUser);
    }
    catch(err){
        next(err);
    }
}

// export const logout = async(req,res,next)=>{
//     try{
//         if(req.cookies.access_token)
//         res.clearCookie('access_token');
      
//           return res.status(200).json({
//             success: true,
//             message: "Successfully logged out.",
//           });
//     }
//     catch(err){
//         next(err);
//     }
// }
export const logout = async (req, res, next) => {
    try {
      // Check if cookies are present
      if (!req.cookies || Object.keys(req.cookies).length === 0) {
        return res.status(200).json({
          success: true,
          message: "No cookies found. You are already logged out.",
        });
      }
  
      // Clear cookies
      res.clearCookie('access_token'); // Replace "cookie_name" with the name of the cookie you want to clear
  
      return res.status(200).json({
        success: true,
        message: "Successfully logged out.",
      });
    } catch (err) {
        console.log(err);
      next(err);
    }
  };