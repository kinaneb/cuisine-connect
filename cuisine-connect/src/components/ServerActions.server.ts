'use server'

import prismadb from "../../lib/prismadb";
import {OpenAI} from "openai";
import {currentUser} from "@clerk/nextjs";

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

type ChatBotProps = {
  message: string
}

const chatBotBrief = "Je suis un chef étoilé au guide Michelin, avec plus de 15 ans d'expérience dans le métier de la gastronomie française. J'ai remporté plusieurs concours culinaires internationaux, ce qui témoigne de ma passion et de mon expertise en cuisine. Ma spécialité est la fusion des saveurs traditionnelles françaises avec des influences modernes. Posez-moi des questions sur la cuisine, les recettes, les techniques culinaires, ou même des conseils pour améliorer vos compétences en cuisine. Je suis ici pour partager mon savoir-faire et ma passion pour la gastronomie."
export async function getChatBotResponse({message}: ChatBotProps) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      const user = await currentUser();
      if(!user) {
        console.error("not connected");
        return '';
      }
      const aiCompletions = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: chatBotBrief,
          },
          {
            role: "user",
            content: message
          }
        ]
      });

      const chatBotResponse = aiCompletions.choices[0].message.content?.trim();
      console.log("chatBotResponse: ", chatBotResponse);
      // Store the message and response in the database
      await prismadb.chatMessage.create({
        data: {
          userId: user.id,
          message: message,
          response: chatBotResponse
        },
      });
      return (chatBotResponse ?? '');
    } catch (error) {
       return 'Error processing chat message' ;
    }

}
