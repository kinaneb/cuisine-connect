import {useEffect, useState} from "react";

export function useRecipe(recipeId: string) {
    const [recipe, setRecipe] = useState({id: '', name: '', ingredients: [], steps: []});

    useEffect(() => {
        (async () => {
            await fetch(`/api/recipes/${recipeId}`)
                .then((response) => response.json())
                .then((data) => setRecipe(data.recipe))
        })();
    }, [recipeId])

    return recipe;
}
