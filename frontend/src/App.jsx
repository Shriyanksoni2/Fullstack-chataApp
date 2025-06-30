import React, { useEffect } from "react";
import { Route, Router, Routes,Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Homepage from "./pages/Homepage";
import SettingPage from "./pages/SettingPage";
import Profile from "./pages/Profile";
import SignupPage from "./pages/SignupPage";
import Login from "./pages/Login";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);
  console.log({onlineUsers})

  if(isCheckingAuth && !authUser ){
    return(
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"></Loader>
      </div>
    )
  }
  return (
    <div data-theme={theme}>
      <NavBar />
      <Routes>
        <Route path="/" element={authUser ? <Homepage/> : <Navigate to='/login'/>} />
        <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to='/'/>} />
        <Route path="/login" element={!authUser ?<Login/>: <Navigate to='/'/>} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<SettingPage/>} />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
