import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Utensils, Trash2, Edit, Loader2, ChefHat, XCircle } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user?.userID) return;
      try {
        // Double check your backend index.js: if it's app.use("/api/recipes", ...) 
        // then this URL is correct.
        const res = await axios.get(`http://localhost:3000/api/recipes/user/${user.userID}`);
        setMyRecipes(res.data);
      } catch (err) {
        console.log("Fetch Error Details:", err.response);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [user?.userID]);

  const handleDelete = async (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        // Matches your route: router.delete("/delete-recipe/:id")
        await axios.delete(`http://localhost:3000/api/recipes/delete-recipe/${recipeId}`);
        toast.success("Recipe deleted!");
        setMyRecipes(myRecipes.filter((r) => r._id !== recipeId));
      } catch (err) {
        toast.error("Failed to delete recipe",err);
      }
    }
  };

  const confirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:3000/api/recipes/delete-recipe/${deleteId}`);
    toast.success("Recipe deleted successfully!");
    setMyRecipes(myRecipes.filter((r) => r._id !== deleteId));
    setDeleteId(null); // Modal-ah close pannum
  } catch (err) {
    toast.error("Error deleting recipe",err);
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#FF4500] to-orange-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ChefHat size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight tracking-tight uppercase">Chef {user?.username}</h1>
              <p className="text-slate-500 font-medium tracking-tight">You have {myRecipes.length} recipes in your collection</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#FF4500]" size={40} /></div>
        ) : myRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myRecipes.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group">
                <div className="h-52 relative">
                  {/* Schema uses 'image' (URL from Cloudinary) */}
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(recipe._id)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* CHANGED FROM recipe.name TO recipe.title */}
                  <h3 className="font-bold text-lg text-slate-800 mb-2 truncate">{recipe.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 italic">
                    {Array.isArray(recipe.instructions) ? recipe.instructions[0] : recipe.instructions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 py-24 text-center">
            <XCircle className="mx-auto text-slate-200 mb-4" size={60} />
            <h3 className="text-xl font-bold text-slate-700">No Recipes Found</h3>
            <p className="text-slate-400 mb-8 font-medium italic">Start adding your signature dishes!</p>
          </div>
        )}
      </div>

      {deleteId && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Recipe?</h3>
      <p className="text-slate-500 mb-6 text-sm">Are you sure? This action cannot be undone.</p>
      <div className="flex gap-4">
        <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
        <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100">Delete</button>
      </div>
    </div>
  </div>
)}

      <Link to="/add-recipe" className="fixed bottom-10 right-10 w-16 h-16 bg-[#FF4500] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <Plus size={32} />
        <span className="absolute right-20 bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
          Add New Recipe
        </span>
      </Link>
    </div>
  );
};

export default Dashboard;