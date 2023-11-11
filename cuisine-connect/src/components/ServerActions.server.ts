'use server'

import prismadb from "../../lib/prismadb";

type AddToFavouritesProps = {
  userId: string,
  recipeId: string,
}
export const addToFavourites = async ({userId, recipeId}: AddToFavouritesProps) => {
  try {
    const alreadyExist = await prismadb.favourite.findUnique({
      where: {
        user_recipes: {
          userId: userId,
          recipeId: recipeId
        }
      }
    })
    if (alreadyExist){
      console.error(`recipe ${recipeId} has been readded to user ${userId}`);
      return alreadyExist;
    }
    const newAddedFavourite = await prismadb.favourite.create({
      data: {
        userId: userId,
        recipeId: recipeId
      }
    });

    const updatedRecipe = await prismadb.recipe.update({
      where: {
        id: recipeId
      },
      data: {
        users: {
          push: userId
        }
      }
    });
    return newAddedFavourite;
  } catch (error) {
    console.error(error);
  }
}

export const removeFromFavourites = async ({userId, recipeId}: AddToFavouritesProps) => {
  try {
    const deletedFavourite = await prismadb.favourite.delete({
      where: {
        user_recipes: {
          userId: userId,
          recipeId: recipeId
        }
      }, include:{
        recipe: true
      }
    });
    const updatedRecipe = await prismadb.recipe.update({
      where: {
        id: recipeId
      },
      data: {
        users: deletedFavourite.recipe.users.filter(user => user != deletedFavourite.userId)
      }
    });
    return deletedFavourite;
  } catch (error) {
    console.error(error);
  }
}

export const getFavourites = async (userId: string) => {
  try {
    return await prismadb.favourite.findMany({
      where: {
        userId: userId
      },
      include: {
        recipe: true
      }
    });
  } catch (error) {
    console.error("getFavourites error: ", error);
  }
}