import React, { useEffect, useState } from "react";
import { Search, Plus, XCircle } from "lucide-react"; // XCircle added for No Results
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState(""); // Search state
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/recipes/get-all-recipes');
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

    // Fix for Desserts and Search
    const handleFilter = (category) => {
        setActiveTab(category);
        setSearchQuery(""); // Filter click panna search clear aagum
        
        if (category === 'All') {
            setFilteredRecipes(recipes);
        } else {
            // "Desserts" filter click panna "Dessert" (singular) database value-vum check pannum
            const filtered = recipes.filter(r => 
                r.category === category || (category === 'Desserts' && r.category === 'Dessert')
            );
            setFilteredRecipes(filtered);
        }
    };

    // NEW: Search Functionality
    const handleSearch = () => {
        const searchFiltered = recipes.filter((r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRecipes(searchFiltered);
        setActiveTab('All'); // Search pannumbothu tab switch aagum
    };

    return (
        <div className="w-full">
            <section className="relative h-[80vh] flex items-center justify-center bg-[#1A1A1A]">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
                        alt="Hero Food"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 mt-20 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Cooking Made <span className="text-[#FF4500]">Simple.</span>
                    </h1>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-white p-2 rounded-2xl md:rounded-full shadow-2xl max-w-3xl mx-auto">
                        <div className="flex items-center flex-1 px-4 w-full">
                            <Search className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search for recipes (e.g. Masala Dosa..)"
                                className="w-full py-3 outline-none text-gray-700 bg-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                // Optional: Type panna panna filter aaga
                                onKeyUp={(e) => { if(e.key === 'Enter') handleSearch(); }}
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="bg-[#FF4500] hover:bg-[#e63e00] text-white px-8 py-3 rounded-xl md:rounded-full font-semibold transition w-full md:w-auto"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#F9F9F9] px-6">
                <div className="container mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1A1A1A]">Trending Recipes</h2>
                            <div className="w-20 h-1 bg-[#FF4500] mt-2"></div>
                        </div>
                        <div className="flex gap-4">
                            {['All', 'Veg', 'Non-Veg', 'Desserts'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleFilter(type)}
                                    className={`text-sm font-bold transition-all ${activeTab === type ? 'text-[#FF4500] border-b-2 border-[#FF4500]' : 'text-gray-400 hover:text-gray-600'}`}
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
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 text-xl font-medium">No Recipes Found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <button
                    onClick={handleAddRecipeClick}
                    className="fixed bottom-10 right-10 w-16 h-16 bg-[#FF4500] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
                >
                    <Plus size={32} />
                    <span className="absolute right-24 bg-slate-900 text-white text-[10px] font-black py-3 px-6 rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap uppercase tracking-widest">
                        Share Your Recipe
                    </span>
                </button>
            </section>
        </div>
    );
};

export default Home;