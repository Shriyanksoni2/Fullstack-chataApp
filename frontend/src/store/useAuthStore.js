import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import {io} from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ?  'http://localhost:5001/api' : "/api";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  socket: null,
  isCheckingAuth: true,
  onlineUsers:[],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/check");
      set({ authUser: res.data?.user});
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (req) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", req);
      set({ authUser: resp.data?.user });
      toast.success("Account Created Successfully");
      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data?.user });
      toast.success("Logged in successfully");
      get().connectSocket()
      //   get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
      get().disconnectSocket();

    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/updateProfile", data, {
  headers: { 'Content-Type': 'multipart/form-data' }},);
      set({ authUser: res.data?.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket : async ()=>{
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL,{
      query: { userId: authUser._id}
    })
    socket.connect();
    set({socket: socket})

    socket.on('getOnlineUsers', (userIds)=>{
      set({onlineUsers: userIds})
    })
  },

  disconnectSocket : async ()=>{
    if(get().socket?.connected){
      get().socket.disconnect()
    }
  }
}));
