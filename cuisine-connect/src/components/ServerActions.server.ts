'use server'

import prismadb from "../../lib/prismadb";

type AddToFavouritesProps = {
  userId: string,
  recipeId: string,
}

export type AddOrUpdateProps = {
  userId: string,
  recipeId: string,
  newScore: number,
  ratingSum?: number,
  ratingCount?: number,
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
        favUsers: {
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
        favUsers: deletedFavourite.recipe.favUsers.filter(user => user != deletedFavourite.userId)
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
export async function addOrUpdateRating({userId, recipeId, newScore, ratingSum, ratingCount}: AddOrUpdateProps) {
  const existingRating = await prismadb.rating.findUnique({
    where: {
      user_recipe_rating: { userId, recipeId }
    }
  });

  if (existingRating) {
    console.error(`recipe ${recipeId} has been re rated by user ${userId}`);
    return (ratingCount == 0 ? 0 : (ratingSum ?? 0)/(ratingCount ?? 1));
  } else {
    await prismadb.rating.create({
      data: {
        userId,
        recipeId,
        score: newScore
      }
    });

    const newRatingSum = (ratingSum ?? 0) + newScore;
    const newRatingCount = (ratingCount ?? 0) + 1;
    const newAverageRating = newRatingSum/newRatingCount;
    await prismadb.recipe.update({
      where: {
        id: recipeId
      }, data: {
        rateUsers: {push: userId},
        ratingSum: newRatingSum,
        ratingCount: newRatingCount,
        averageRating: newAverageRating,
      }
    });
    return newAverageRating;
  }
}