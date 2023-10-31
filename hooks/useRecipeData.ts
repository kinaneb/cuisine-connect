import {useEffect, useState} from "react";

export function useRecipeData() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch(`/api/recipes`)
            .then((response) => response.json())
            .then((data) => setRecipes(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return recipes;
}