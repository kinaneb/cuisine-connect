export type Recipe = {
  id: string,
  name: string,
  thumbnailUrl: string,
  steps: string[],
  ingredients: string[],
  favUsers: string[],
  rateUsers: string[],
  favourites: Favourite[],
  rating: Rating[],
  ratingSum: number,
  ratingCount: number,
  averageRating: number,
}

export type Favourite = {
  id: string,
  userId: string,
  recipe: Recipe,
  recipeId: string,
}

export type Rating = {
  id: string,
  userId: string,
  score: number,
  recipeId: string,
  recipe: Recipe,
}


