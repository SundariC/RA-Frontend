import React, {useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";

const Home = () => { 
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/recipes/get-all-recipes');
                setRecipes(res.data);
                setFilteredRecipes(res.data)
            } catch (err) {
                console.error("Error feting recipes", err)
            }
        };
        fetchRecipes();   
    }, []);

    const handleFilter = (category) => {
        setActiveTab(category);
        if (category === 'All') {
            setFilteredRecipes(recipes);
        } else {
           const filtered = recipes.filter(r =>r.category === category);
           setFilteredRecipes(filtered)
        }
    };
  return (
    <div className="w-full">
      <section className="relative h-[80vh] flex item-center justify-center bg-[#1A1A1A]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
            alt="Hero Food"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset=0 bg-gradient-to-b from-black/60 to-transparent"></div>
        </div>

        <div className= "relative z-10 text-center px-4 mt-20 max-w-4xl">
          <h1 className= "text-5xl md:text7xl font-bold text-white mb-6 tracking-tight">
            Cooking Made <span className= "text-[#FF4500]">Simple.</span>
          </h1>
          <div className= "flex flex-col md:flex-row items-center justify-center gap-4 bg-white p-2 rounded-2xl md:rounded-full shadow-2xl max-w-3xl mx-auto">
            <div className= "flex items-center flex-1 px-4 w-full">
               <Search className= "text-gray-400 mr-2" />
               <input 
               type= "text"
               placeholder="Search for recipes (e.g. Masala Dosa..)"
               className= "w-full py-3 outline-none text-gray-700 bg-transparent" />
            </div>
              <button className= "bg-[#FF4500] hover:bg-[#e63e00] text-white px-8 py-3 rounded-xl md:rounded-full font-semibold transition w-full md:w-auto">
                Search
              </button>
          </div>

          <div className="mt-8 flex-wrap justify-center gap-5">
            {[ 'Veg', 'Non-Veg', 'Desserts'].map((cat) => (
                <span key={cat} className= "bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1 rounded-full text-sm cursor-pointer hover:bg-[#FF4500] hover:border-[#FF4500] transition-all">
                    {cat}
                </span>
            ))}
          </div>
        </div>
      </section>
    {/* RECIPE GRID SECTION */}
      <section className= "py-16 bg-[#F9F9F9] PX-6">
        <div className= "container mx-auto">
            <div className="flex justify-between items-end mb-10">
               <div>
                <h2 className= "text-3xl font-bol text-[#1A1A1A]">Trending Recipes</h2>
                <div className= "w-20 h-1 bg-[#FF4500] mt-2"></div>
               </div>
               <div className= "flex gap-4">
                {['All', 'Veg', 'Non-Veg','Desserts'].map((type) => (
                    <button 
                    key={type}
                    onClick={() => handleFilter(type)}
                    className={`text-sm font-bold transition-all ${activeTab === type ? 'text-[#FF4500] border-b-2 border-[#FF4500]' : 'text-gray-400 hover:text-gray-600'}`}
                    > {type}
                    </button>
                ))}
               </div>
            </div>
            <div className= "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((item) => (
                        <RecipeCard key={item._id} recipe={item} />
                    ))
                ) : (
                    <p className="text-center col-span-full py-10 text-gray-400">Loading Delicious Recipes...</p>
                )}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
