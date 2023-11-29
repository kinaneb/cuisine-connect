"use client"
import {Button, Card, CardActions, CardMedia, Grid, Typography} from "@mui/material";

type Recipe = {
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


type PropsFavouriteRecipe = {
  recipe: Recipe
}


export default function FavouriteRecipe({recipe}: PropsFavouriteRecipe) {
  return (
    <Grid key={recipe.id} item xs={4}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="194"
          image={recipe.thumbnailUrl}
          alt="Paella dish"
        />
        <CardActions>
          <div>
            <Typography>{recipe.name}</Typography>
            <Button variant={'contained'}  color={'inherit'} href={`/recipes/${recipe.id}`}>Voir le détail</Button>
          </div>
        </CardActions>
      </Card>
    </Grid>
  )
}