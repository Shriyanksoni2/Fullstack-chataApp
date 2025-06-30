import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import { io } from "../lib/socket.js";

export const getUserForSideBar = async(req,res)=>{
    try {
        const userId = req.user._id;
        console.log(userId)
        const filteredUsers = await User.find({_id:{$ne: userId}}).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUserForSideBar controller", error.message)
        res.status(500).json({message:'Internal Server Error'})
    }
}

export const getMessages = async (req,res)=>{
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderId:senderId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: senderId}
            ]
        });
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages Controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async (req,res)=>{
    try {
       const {text, image} = req.body;
       const {id: receiverId} = req.params;
       const senderId = req.user._id;
       
       let imageUrl;
       if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url
       }
       const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl
       })
       await newMessage.save();

       const receiverSocketId = getReceiverSocketId(receiverId);
       io.to(receiverSocketId).emit("newMessage", newMessage)
       console.log('reciver socket id ',receiverSocketId);

       res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage Controller", error.message);
        res.status(500).json('Internal Server Error')
    }
}