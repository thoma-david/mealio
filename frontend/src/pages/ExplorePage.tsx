import RecipeCard from "../components/RecipeCard";
import { useState } from "react";
import React from "react";

type Recipe = {
  _id: string;
  name: string;
  estimated_price: number;
  description: string;
  time: number;
  image: string;
};

const ExplorePage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/auth/recipes");
        const data = await response.json();
        setRecipes(data.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="max-w-[500px] mx-5 h-screen gap-[2rem] flex flex-col">
      <div className="gap-4 flex flex-col">
        {recipes.length > 0
          ? recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                title={recipe.name}
                price={recipe.estimated_price}
                description={recipe.description}
                time={recipe.time}
                image={recipe.image}
              />
            ))
          : !loading && <div className="text-center py-8 text-gray-500">No recipes found</div>}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-600">Loading recipes...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
