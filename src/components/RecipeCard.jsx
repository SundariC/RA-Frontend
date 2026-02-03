import React from 'react';
import { Clock, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    return (
        <div className= "bg-white rounded-2xl overflow-hidden shadow-lf hover:shadow-2xl transition -all duration-300 group border border-gray-100">
            <div className= "relative h-56 overflow-hidden">
                <img 
                src= {recipe.image}
                alt= {recipe.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className= {`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${recipe.category === 'Veg' ? 'bg-[#10B981]' : recipe.category === 'Non-Veg' ? 'bg-[#EF4444]' : 'bg-[#A855F7]'}`}>
                    {recipe.category}
                </div>
            </div>

            {/* Recipe Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text[#1A1A1A] mb-2 truncate group-hover:text-[#FF4500] transition-colors">
                {recipe.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                 {recipe.description}
              </p>
            {/* Footer Info */}
            <div className= "flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-gray-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 30 min
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils className="w-4 h-4" /> Medium
                  </span>
                </div>
               <Link to={`/recipe/${recipe._id}`} className="text-[#FF4500] font-bold text-sm hover:underline"> 
                 View Recipe
               </Link>
            </div>     
           </div>
        </div>
    );
};

export default RecipeCard;