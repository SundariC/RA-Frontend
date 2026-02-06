import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, Edit, Loader2, ChefHat, XCircle, Eye } from "lucide-react";
import { getMyRecipes, deleteRecipeAPI } from "../services/api"; 
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
        const res = await getMyRecipes(user.userID);
        setMyRecipes(res.data);
      } catch (err) {
        console.log("Fetch Error Details:", err.response);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [user?.userID]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      // Axios delete-ku bathila namma API method
      await deleteRecipeAPI(deleteId);
      toast.success("Recipe deleted successfully!");
      setMyRecipes(myRecipes.filter((r) => r._id !== deleteId));
      setDeleteId(null); 
    } catch (err) {
      toast.error("Error deleting recipe");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#FF4500] to-orange-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ChefHat size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Chef {user?.username}</h1>
              <p className="text-slate-500 font-medium tracking-tight">You have {myRecipes.length} recipes in your collection</p>
            </div>
          </div>
          <Link to="/add-recipe" className="mt-4 md:mt-0 px-6 py-3 bg-[#FF4500] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center gap-2">
             <Plus size={20}/> New Recipe
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#FF4500]" size={40} /></div>
        ) : myRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myRecipes.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group flex flex-col h-full">
                <div className="h-52 relative overflow-hidden">
                  <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* Quick Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => openDeleteModal(recipe._id)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-slate-800 mb-2 truncate">{recipe.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 italic mb-6">
                    {recipe.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => navigate(`/recipes/get-recipes/${recipe._id}`)} 
                      className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-50 hover:text-[#FF4500] transition-all border border-transparent hover:border-orange-100"
                    >
                      <Eye size={18} /> View Recipe
                    </button>
                  </div>
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

      {/* CUSTOM DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
               <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">Are you sure?</h3>
            <p className="text-slate-500 mb-8 text-center text-sm font-medium">This recipe will be permanently removed from your collection.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;