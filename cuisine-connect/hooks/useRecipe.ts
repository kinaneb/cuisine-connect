import {useEffect, useState} from "react";

export function useRecipe(recipeId: string) {
    const [recipe, setRecipe] = useState({
        id: '',
        name: '',
        ingredients: [""],
        steps: [""],
        favUsers: [""],
        rateUsers: [""],
        favourites: [""],
        rating: [""],
        ratingSum: 0,
        ratingCount: 0,
        averageRating: 0,
    });

    useEffect(() => {
        (async () => {
            await fetch(`/api/recipes/${recipeId}`)
                .then((response) => response.json())
                .then((data) => setRecipe(data.recipe))
        })();
    }, [recipeId])

    return recipe;
}
