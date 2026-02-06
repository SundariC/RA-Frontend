import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// axios thookiyaachu, namma central api methods import panniyaachu
import { fetchRecipeById, updateRecipeAPI } from "../services/api"; 
import { Utensils, Image as ImageIcon, Youtube, Send, ArrowLeft, Loader2, AlignLeft } from "lucide-react";
import toast from "react-hot-toast";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Breakfast",
    ingredients: "",
    instructions: "",
    youtubeUrl: "",
    image: null,
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Central API method use pannidalaam
        const res = await fetchRecipeById(id);
        
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
          category: res.data.category || "Breakfast",
          ingredients: Array.isArray(res.data.ingredients) ? res.data.ingredients.join(", ") : res.data.ingredients || "",
          instructions: res.data.instructions || "",
          youtubeUrl: res.data.youtubeUrl || "",
          image: null, 
        });
      } catch (err) {
        toast.error("Failed to load recipe details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("ingredients", formData.ingredients);
    data.append("instructions", formData.instructions);
    data.append("youtubeUrl", formData.youtubeUrl);
    
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      // Central update API method
      const response = await updateRecipeAPI(id, data);

      if (response.status === 200 || response.status === 204) {
        toast.success("Recipe updated successfully! ✨");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Update failed!");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-orange-600 mb-8 font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Cancel Edit
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-orange-50 overflow-hidden">
          <div className="bg-slate-900 p-10">
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
              Edit <span className="text-orange-500">Recipe</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
                <Utensils size={14} className="text-orange-500"/> Recipe Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white p-5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Category</label>
              <select
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white p-5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
                <option value="Dessert">Dessert</option>
              </select>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
                <AlignLeft size={14} className="text-orange-500"/> Short Description
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white p-5 rounded-2xl outline-none font-bold text-slate-700 transition-all"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Ingredients</label>
              <textarea
                required
                rows="3"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 p-5 rounded-3xl outline-none font-bold text-slate-700 transition-all"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Instructions</label>
              <textarea
                required
                rows="6"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 p-5 rounded-[2.5rem] outline-none font-bold text-slate-700 transition-all"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
                <ImageIcon size={14} className="text-orange-500"/> Update Image
              </label>
              <input 
                type="file" 
                className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200" 
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} 
              />
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
                <Youtube size={14} className="text-red-600"/> Video URL
              </label>
              <input 
                type="url" 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 p-5 rounded-2xl outline-none font-bold text-slate-700 transition-all" 
                value={formData.youtubeUrl} 
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })} 
              />
            </div>

            <button 
              type="submit" 
              disabled={isUpdating} 
              className="col-span-2 bg-slate-900 hover:bg-orange-600 text-white p-6 rounded-[2rem] font-black italic uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;