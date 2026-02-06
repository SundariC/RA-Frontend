import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, Utensils, ArrowLeft, Youtube, CheckCircle2, Play, Flame } from "lucide-react";
import toast from "react-hot-toast";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        // Using Port 3000 as per your server setup
        const res = await axios.get(`http://localhost:3000/api/recipes/get-recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Recipe details load aagala!");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF4500] rounded-full animate-spin"></div>
        <p className="font-black italic text-[#FF4500] animate-pulse uppercase tracking-widest">Chef is Preparing...</p>
      </div>
    </div>
  );

  if (!recipe) return <div className="pt-32 text-center font-bold text-gray-500 uppercase tracking-widest">Recipe not found!</div>;

  const ingredientsList = Array.isArray(recipe.ingredients) ? recipe.ingredients : recipe.ingredients?.split(",").filter(x => x.trim() !== "") || [];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-[#FF4500] mb-8 transition-all font-bold tracking-widest text-xs uppercase">
          <ArrowLeft size={16} /> Go Back
        </button>

        {/* Header: Image & Title */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl h-[400px] border-4 border-white">
            <img 
              // Combined Logic: Backend-la irunthu vara path-a full URL-a mathuroam
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            //   onError={(e) => { e.target.src = "https://via.placeholder.com/500?text=No+Image+Found"; }}
            />
            <div className="absolute top-4 left-4 bg-[#FF4500] text-white px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg italic">
              {recipe.category}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight italic tracking-tighter mb-6 uppercase underline decoration-orange-100">
              {recipe.title}
            </h1>
            
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8 border-l-4 border-orange-200 pl-4 italic">
              {recipe.description || "Traditional flavor meets modern cooking."}
            </p>

            <div className="flex gap-10">
              <div className="flex items-center gap-3">
                <Clock className="text-[#FF4500]" size={20} />
                <span className="font-black text-slate-800 tracking-tighter uppercase">30 Mins</span>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="text-[#FF4500]" size={20} />
                <span className="font-black text-slate-800 tracking-tighter uppercase">Medium Heat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Compact Ingredients Checklist */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-100 border border-slate-50">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 italic text-slate-900 uppercase tracking-tighter">
              <Utensils size={20} className="text-[#FF4500]" /> Ingredients
            </h3>
            <div className="space-y-3">
              {ingredientsList.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setCheckedIngredients(prev => ({...prev, [index]: !prev[index]}))}
                  className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${checkedIngredients[index] ? 'bg-slate-50 border-transparent opacity-40' : 'bg-white border-slate-100 hover:border-orange-200'}`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${checkedIngredients[index] ? 'bg-green-500 border-green-500' : 'border-slate-200'}`}>
                    {checkedIngredients[index] && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`font-bold text-sm ${checkedIngredients[index] ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions as Paragraph (Enter-space format) */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-black text-slate-900 mb-8 italic border-b-4 border-orange-100 inline-block uppercase tracking-tighter">
              The Method
            </h3>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 min-h-[300px]">
              {/* whitespace-pre-line is the MAGIC here */}
              <p className="text-slate-600 text-lg leading-[1.8] font-semibold whitespace-pre-line italic">
                {recipe.instructions}
              </p>
            </div>
          </div>
        </div>

        {/* YouTube Section */}
        {recipe.youtubeUrl && (
          <div className="mt-20 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <Play className="fill-red-600 text-red-600" size={28} />
              <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter underline decoration-red-100">Video Masterclass</h3>
            </div>
            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white ring-1 ring-slate-100">
              <iframe className="w-full h-full" src={getEmbedUrl(recipe.youtubeUrl)} title="YouTube Player" frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;