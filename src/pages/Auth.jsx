import React, { useState } from "react";
// import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Default-ah Login form
  const [isForgot, setIsForgot] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!isLogin && !isForgot && val.length > 0 && !passwordRegex.test(val)) {
      setPasswordError(
        "Password Must be Min 8 chars, 1 number & 1 special character required.",
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isForgot
      ? "forgot-password"
      : isLogin
        ? "login"
        : "register";
    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/${endpoint}`,
        {
          username: !isLogin && !isForgot ? username : undefined,
          email,
          password: !isForgot ? password : undefined,
        },
      );

      if (isForgot) {
        toast.success("Reset link sent to your email! Check your email");
        setIsForgot(false);
      } else if (isLogin) {
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);
        window.localStorage.setItem("username", response.data.username);
        const userEmail = response.data.email || "chef.user@example.com";
    window.localStorage.setItem("email", userEmail);

        setUser({
        token: response.data.token,
        userID: response.data.userID,
        username: response.data.username,
        email: userEmail,
      });
        toast.success("Welcome Back!");
        navigate("/");
        // window.location.reload();
      } else {
        toast.success("Registration Successful! Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4 pt-20">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        {/* Left Side: Branding */}
        <div className="md:w-1/2 bg-[#FF4500] p-12 text-white flex flex-col justify-center transition-all duration-500">
          <h2 className="text-4xl font-bold mb-6 italic tracking-tight">
            {isForgot
              ? "Don't Worry."
              : isLogin
                ? "Bite into something new."
                : "Cook. Share. Repeat."}
          </h2>
          <p className="text-orange-100 mb-8 font-light leading-relaxed">
            {isForgot
              ? "Well help you get back into your kitchen in no time."
              : isLogin
                ? "Access your personal dashboard and saved recipes."
                : "Create an account to start sharing your culinary magic with us."}
          </p>
          {!isForgot && (
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setPasswordError(""); // Form switch panna error-ah clear panrom
              }}
              className="border-2 border-white/50 hover:border-white hover:bg-white hover:text-[#FF4500] px-8 py-3 rounded-full font-semibold transition-all w-fit"
            >
              {isLogin ? "Sign Up Now" : "Back to Login"}
            </button>
          )}
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              {isForgot && (
                <ArrowLeft
                  className="w-6 h-6 cursor-pointer text-gray-400 hover:text-[#FF4500]"
                  onClick={() => setIsForgot(false)}
                />
              )}
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {isForgot ? "Reset Password" : isLogin ? "Login" : "Register"}
              </h3>
            </div>
            {/* Username - Only for Register */}
            {!isLogin && !isForgot && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FF4500] transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#FF4500] transition-all"
              />
            </div>

            {/* Password */}
            {!isForgot && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-xl outline-none transition-all 
                  ${passwordError ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-[#FF4500]"}`}
                />
                <div
                  className="absolute right-4 top-3.5 cursor-pointer text-gray-400 hover:text-[#FF4500]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1 ml-1 font-semibold italic">
                    {passwordError}
                  </p>
                )}
              </div>
            )}
            {/* Forgot Password Link - Only for Login */}
            {isLogin && !isForgot && (
              <div className="flex justify-end mt-[-10px]">
                <button
                  type="button"
                  onClick={() => setIsForgot(true)}
                  className="text-xs font-bold text-gray-500 hover:text-[#FF4500] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={passwordError !== ""}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 group 
                ${passwordError ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-[#FF4500] text-white hover:bg-[#e63e00] shadow-orange-200"}`}
            >
              {isForgot
                ? "Send Reset Link"
                : isLogin
                  ? "Login"
                  : "Create Account"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
