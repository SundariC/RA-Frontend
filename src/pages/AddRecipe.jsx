import React, { useState } from "react";
// axios thookiyaachu, api.js-la irunthu createRecipeAPI matum import pannirukaen
import { createRecipeAPI } from "../services/api"; 
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Utensils, Image, Type, ListOrdered, Save, Youtube, FileText } from "lucide-react";
import toast from "react-hot-toast";

const AddRecipe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    ingredients: "", 
    instructions: "", 
    category: "Veg", 
    userOwner: user?.userID,
  });
  
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user?.userID) {
        toast.error("Please login to add a recipe");
        return;
    }
    
    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("description", recipe.description);
    formData.append("youtubeUrl", recipe.youtubeUrl);
    formData.append("category", recipe.category);
    formData.append("userOwner", user.userID);
    formData.append("ingredients", recipe.ingredients); 
    formData.append("instructions", recipe.instructions);
    
    if (image) formData.append("image", image);

    try {
      // Axios-ku bathila namma API function
      await createRecipeAPI(formData);
      toast.success("Recipe shared successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving recipe");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#FF4500] to-orange-500 p-8 text-white">
          <h1 className="text-3xl font-black">Create New Recipe</h1>
          <p className="opacity-90">Fill in the details to add your dish to ChefCloud.</p>
        </div>

        <form onSubmit={onSubmit} className="p-10 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider italic"><Type size={16}/> Recipe Title *</label>
              <input type="text" name="title" onChange={handleChange} placeholder="e.g. Traditional Biryani" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider italic">Category *</label>
              <select name="category" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#FF4500] outline-none">
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>
          </div>

          {/* Section 2: Media & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider italic"><Image size={16}/> Upload Image</label>
              <input type="file" onChange={handleImageChange} className="w-full p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider italic"><Youtube size={16}/> YouTube URL</label>
              <input type="text" name="youtubeUrl" onChange={handleChange} placeholder="https://youtube.com/watch?v=..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#FF4500] outline-none" />
            </div>
          </div>

          {/* Section 3: Details */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 italic flex items-center gap-2 uppercase tracking-wider"><FileText size={16}/> Short Description</label>
            <textarea name="description" onChange={handleChange} rows="2" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#FF4500] outline-none" placeholder="A brief about your dish..."></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider italic"><ListOrdered size={16}/> Ingredients (Separate with commas)</label>
            <textarea name="ingredients" onChange={handleChange} rows="3" placeholder="Onion, Tomato, Garlic, Ginger..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#FF4500] outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider italic">Step-by-Step Instructions (Separate with commas)</label>
            <textarea name="instructions" onChange={handleChange} rows="5" placeholder="Boil water, Add salt, Cook for 10 mins..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#FF4500] outline-none" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => navigate("/dashboard")} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Discard</button>
            <button type="submit" className="flex-[2] py-4 bg-[#FF4500] text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-[#e63e00] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <Save size={20} /> Publish Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;