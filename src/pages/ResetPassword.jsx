import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id, token } = useParams(); // URL-la irunthu id and token edukkum
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend URL path check pannikonga
      const res = await axios.post(`http://localhost:3000/api/user/reset-password/${id}/${token}`, { password });
      
      if (res.status === 200) {
        toast.success("Password reset successfully! Please login.");
        navigate("/auth"); // Redirect to login page
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Link expired or invalid!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-50 text-[#FF4500] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Set New Password</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Please enter your new professional password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full p-4 pl-5 pr-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-[#FF4500] text-white rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;