"use client"
import {Button, Card, CardActions, CardMedia, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useUser} from "@clerk/nextjs";
import {removeFromFavourites} from "@/components/ServerActions.server";

type Recipe = {
  id: string,
  name: string,
  thumbnailUrl: string,
  steps: string[],
  users: string[]
  ingredients: string[],
}

type Favourite = {
  id: string,
  userId: string,
  recipe: Recipe
};

type PropsFavouriteRecipe = {
  favourite: Favourite
}


export default function FavouriteRecipe({favourite}: PropsFavouriteRecipe) {
  return (
    <Grid key={favourite.id} item xs={4}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="194"
          image={favourite.recipe.thumbnailUrl}
          alt="Paella dish"
        />
        <CardActions>
          <div>
            <Typography>{favourite.recipe.name}</Typography>
            <Button variant={'contained'}  color={'inherit'} href={`/recipes/${favourite.recipe.id}`}>Voir le détail</Button>
          </div>
        </CardActions>
      </Card>
    </Grid>
  )
}