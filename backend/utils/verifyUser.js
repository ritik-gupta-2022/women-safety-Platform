import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = async(req,res,next)=>{
    const token = req.cookies.access_token;
    console.log(token);
    if(!token){
        next(errorHandler(401, "Unauthorized: No token found"));
    }
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
        if (err) {
            console.error('JWT Verification Error:', err); 
            return next(errorHandler(401, 'Unauthorized: Token verification failed'));
        }
        req.user = user;
        console.log('token verified')
        next();
    })
}