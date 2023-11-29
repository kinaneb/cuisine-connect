'use server'

import prismadb from "../../lib/prismadb";
import {OpenAI} from "openai";
import {currentUser} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {z} from "zod";

type Favourite = {
  recipe:
    {
      id: string,
      name: string,
      thumbnailUrl: string,
      steps: string[],
      ingredients: string[],
      favUsers: string[],
      rateUsers: string[],
      ratingSum: number,
      ratingCount: number,
      averageRating: number
    }
};


type Rating =  {
  score: number,
  recipe:
    {
      id: string,
      name: string,
      thumbnailUrl: string,
      steps: string[],
      ingredients: string[],
      favUsers: string[],
      rateUsers: string[],
      ratingSum: number,
      ratingCount: number,
      averageRating: number
    }
}

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

const generatedRecipeSchema = z.object({
  name: z.string(),
  thumbnailUrl: z.string().url(),
  steps: z.string().array(),
  ingredients: z.string().array(),
});

type generatedRecipe = z.infer<typeof generatedRecipeSchema>;

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
    const updatedFavUsers: string[] = deletedFavourite.recipe.favUsers.filter((user:string) => user != deletedFavourite.userId);
    const updatedRecipe = await prismadb.recipe.update({
      where: {
        id: recipeId
      },
      data: {
        favUsers: updatedFavUsers
      }
    });
    return deletedFavourite;
  } catch (error) {
    console.error(error);
  }
}

export async function getFavourites(userId: string):Promise <Favourite[]> {
  const favourites = await prismadb.favourite.findMany({
    where: {
      userId: userId
    },
    include: {
      recipe: true
    }
  });
  return favourites;
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

const chatBotBrief = "t'es un chef étoilé au guide Michelin, avec plus de 15 ans d'expérience dans le métier de la gastronomie française. t'as remporté plusieurs concours culinaires internationaux, ce qui témoigne de ma passion et de mon expertise en cuisine. Ton spécialité est la fusion des saveurs traditionnelles françaises avec des influences modernes. Les client peuvent te poser des questions sur la cuisine, les recettes, les techniques culinaires, ou même des conseils pour améliorer vos compétences en cuisine. t'es ici pour partager ton savoir-faire et ma passion pour la gastronomie. Avant de donner un conseil, te demande au client s'il a une allergie alimentaire et  t'évitez ces éléments, te ne faite pas d'opinion personnelle, et t`évite toute question qui n'est pas liée à l'alimentation et à la cuisine."
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
    // console.log("chatBotResponse: ", chatBotResponse);
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

export async function getUserProfileDetails(userId: string) {
  // const userFavourites =


  return `ce client ajoute cette liste de recettes à ses favoris: ${await getUserFavouritesRecipes(userId)} et évalue ces recettes comme dans cette liste ${await getUserRatingRecipes(userId)}, tu doit prendre cette information en compte dans tes proposition`

}

async function getUserFavouritesRecipes(userId: string) {
  const userFavourites = await prismadb.favourite.findMany({
    where: {
      userId: userId
    },
    include: {
      recipe: true
    }
  });
  return userFavourites.map((favorite : Favourite) => favorite.recipe.name);
}

async function getUserRatingRecipes(userId: string) {
  const userRating = await prismadb.rating.findMany({
    where: {
      userId: userId
    },
    include: {
      recipe: true
    }
  });
  return userRating.map((rating: Rating) => `recipe: ${rating.recipe.name}, rate score: ${rating.score}`)
}

async function addNewRecipe(recipe: generatedRecipe) {
  const isRecipeExist = await prismadb.recipe.findUnique({
    where: {
      name: recipe.name
    }
  });
  if (isRecipeExist) {
    console.error(`recipe ${recipe.name} already exist`);
    return isRecipeExist;
  }

  const newRecipe = await prismadb.recipe.create({
    data: {
      name: recipe.name,
      thumbnailUrl: 'https://images.unsplash.com/photo-1591985666643-1ecc67616216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2487&q=80',
      steps: recipe.steps,
      ingredients: recipe.ingredients,
      favUsers: [],
      rateUsers: [],
      ratingSum: 0,
      ratingCount: 0,
      averageRating: 0
    }
  });
  // console.log("newAddedRecipe: ", newRecipe);
  return newRecipe;
}

export async function generateRecipe(recipeName: string) {
  const brief = `Vous êtes un chef cuisinier qui dans l'indication des détails de la recette. En fonction du texte de recherche qui contient un nom de recette, vous devrez suggérer ce détail :
name: en tant que chaîne de caractères e nom de cette recette sous forme de chaîne de caractères,
thumbnailUrl: en tant que chaîne de caractères un lien fonctionnelle vers une thumbnail de cette recette,
steps : en tant que liste de chaîne de caractères les étapes de la préparation de cette recette,
ingredients : en tant que liste chaîne de caractères les ingrédients de cette recette,
Vous retournerez un object JSON avec exactement le cles suivent name, thumbnailUrl, steps. Vous ne devez pas renvoyer autre chose que du JSON, pas de texte avant ou après, pas de bonjour ou autre chose que du JSON, et le tableau ne doit être inclus dans aucune propriété, juste un simple tableau de chaînes de caractères.`
  // console.log("recipeName: ", recipeName);
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: brief,
        },
        {
          role: "user",
          content: recipeName
        }
      ]
    });

    const message= completions.choices[0].message.content?.trim() ?? '';
    const generatedRecipe = JSON.parse(message);
    // console.log("generatedRecipe: ", generatedRecipe);
    const newRecipe = generatedRecipeSchema.parse(generatedRecipe);
    const newAddedRecipe = await addNewRecipe(newRecipe);
    return newAddedRecipe.id;
  } catch (error) {
    console.error(error);
  }
}