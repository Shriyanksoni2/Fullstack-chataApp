import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req,res, next)=>{
try {
    
    const token = req.cookies.jwt;
    if(!token){
      return  res.status(401).json({message: "Unauthroized - No token Found"})
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if(!decode){
        return res.status(401).json({message: 'Unauthroized - Token is invalid.'});
    }

    const user = await User.findById(decode.id).select('-password');
    if(!user){
        return res.status(400).json({message: "User Not Found"});
    }
    // console.log('User Found', user)
    req.user = user;
    next();
} catch (error) {
    console.log("Error occured at protectRoute", error);
    res.status(500).json({message: 'Internal Server Error.'})
}
}