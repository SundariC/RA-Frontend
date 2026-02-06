import React, { useEffect, useState } from "react";
import { Plus, Utensils, Users, Flame } from "lucide-react"; 
import RecipeCard from "../components/RecipeCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAllRecipes } from "../services/api";

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // Central API call
                const res = await fetchAllRecipes();
                setRecipes(res.data);
                setFilteredRecipes(res.data);
            } catch (err) {
                console.error("Error fetching recipes", err);
            }
        };
        fetchRecipes();
    }, []);

    const handleAddRecipeClick = () => {
        if (user) {
            navigate("/add-recipe");
        } else {
            toast.error("Please login to add your own recipe!");
            navigate("/auth");
        }
    };

    const handleFilter = (category) => {
        setActiveTab(category);
        if (category === 'All') {
            setFilteredRecipes(recipes);
        } else {
            const filtered = recipes.filter(r => 
                r.category === category || (category === 'Desserts' && r.category === 'Dessert')
            );
            setFilteredRecipes(filtered);
        }
    };

    return (
        <div className="w-full">
            {/* HERO SECTION - Search Thookiyaachi! */}
            <section className="relative h-[70vh] flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
                        alt="Hero Food"
                        className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/60"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic">
                        Taste the <span className="text-[#FF4500]">Magic.</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        Explore authentic recipes from around the world. From traditional classics to modern delights, find your next favorite meal here.
                    </p>
                    
                    {/* Professional Stats - Search-ku bathila idhu sethu irukken */}
                    <div className="flex flex-wrap items-center justify-center gap-8 text-white/90 border-t border-white/10 pt-8">
                        <div className="flex items-center gap-2">
                            <Utensils className="text-[#FF4500]" size={20} />
                            <span className="font-bold">500+ Recipes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="text-[#FF4500]" size={20} />
                            <span className="font-bold">10k+ Cooks</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Flame className="text-[#FF4500]" size={20} />
                            <span className="font-bold">Easy Steps</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="py-16 bg-[#F9F9F9] px-6 min-h-screen">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Trending Recipes</h2>
                            <div className="w-16 h-1.5 bg-[#FF4500] mt-3 rounded-full"></div>
                        </div>
                        
                        {/* Filters are enough! */}
                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
                            {['All', 'Veg', 'Non-Veg', 'Desserts'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleFilter(type)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
                                        activeTab === type 
                                        ? 'bg-[#FF4500] text-white shadow-lg' 
                                        : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map((item) => (
                                <RecipeCard key={item._id} recipe={item} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] shadow-inner border border-dashed border-slate-200">
                                <p className="text-slate-400 text-xl font-bold italic">No Recipes found in this category yet!</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Floating Action Button */}
                <button
                    onClick={handleAddRecipeClick}
                    className="fixed bottom-10 right-10 w-16 h-16 bg-[#FF4500] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
                >
                    <Plus size={32} />
                    <span className="absolute right-24 bg-slate-900 text-white text-[10px] font-black py-3 px-6 rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap uppercase tracking-widest shadow-xl">
                        Share Your Recipe
                    </span>
                </button>
            </section>
        </div>
    );
};

export default Home;