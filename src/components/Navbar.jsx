import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LayoutDashboard, PlusCircle, LogOut, MessageSquare, ChevronDown, Send, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth(); // Make sure your user object has 'email'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/auth");
  };

  const handleSendFeedback = async () => {
    if (!feedbackMsg.trim()) return toast.error("Please enter a message");

    setIsSending(true);
    try {
      await axios.post("http://localhost:3000/api/user/send-feedback", {
        // user.email illana localstorage la irunthu eduthukalam
        email: user?.email || localStorage.getItem("userEmail"), 
        message: feedbackMsg,
      });
      toast.success("Feedback sent!");
      setFeedbackMsg("");
      setShowFeedbackInput(false);
    } catch (err) {
      toast.error("Failed to send feedback",err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-[1000] px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-[#FF4500] italic tracking-tighter">
          ChefCloud
        </Link>

        {!user ? (
          <Link to="/auth" className="bg-[#FF4500] text-white px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all">
            Login
          </Link>
        ) : (
          <div className="relative">
            {/* Profile Button */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-gray-50 p-1 pr-3 rounded-full border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-[#FF4500] to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700 hidden md:block">{user.username}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => {setIsDropdownOpen(false); setShowFeedbackInput(false);}}></div>
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 z-20 overflow-hidden py-2 animate-in fade-in zoom-in duration-150">
                  
                  {/* Header: User Email Fix */}
                  <div className="px-5 py-4 border-b border-gray-50 flex flex-col items-center">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#FF4500] mb-2 font-bold text-lg">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-gray-800 tracking-tight text-lg leading-tight uppercase">Chef {user.username}</p>
                    {/* Yengala email varalana localstorage backup use pannum */}
                    <p className="text-[11px] text-gray-400 truncate w-full text-center italic mt-1 px-2">
                        {user.email || localStorage.getItem("email") || "Email not found"}
                    </p>
                  </div>

                  {/* Nav Links */}
                  <div className="p-2 space-y-1">
                    <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-[#FF4500] rounded-2xl transition-all font-semibold text-sm">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    
                    <Link to="/add-recipe" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-[#FF4500] rounded-2xl transition-all font-semibold text-sm">
                      <PlusCircle size={18} /> Add New Recipe
                    </Link>

                    {/* Integrated Feedback Box */}
                    <div className="px-2 pt-1">
                        <button 
                            onClick={() => setShowFeedbackInput(!showFeedbackInput)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm ${showFeedbackInput ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
                        >
                            <MessageSquare size={18} /> Send Feedback
                        </button>

                        {showFeedbackInput && (
                            <div className="mt-2 p-2 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2 duration-200">
                                <textarea 
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-400 h-24 resize-none"
                                    placeholder="Tell the owner something..."
                                    value={feedbackMsg}
                                    onChange={(e) => setFeedbackMsg(e.target.value)}
                                />
                                <button 
                                    onClick={handleSendFeedback}
                                    disabled={isSending}
                                    className="w-full mt-2 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSending ? <Loader2 size={14} className="animate-spin"/> : <><Send size={14}/> Send to Owner</>}
                                </button>
                            </div>
                        )}
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="p-2 mt-1 border-t border-gray-50">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm">
                      <LogOut size={18} /> Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;