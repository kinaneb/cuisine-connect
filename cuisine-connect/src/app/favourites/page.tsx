
import {Grid, Stack, Typography} from "@mui/material";
import React from "react";
import { currentUser } from "@clerk/nextjs";
import {getFavourites, removeFromFavourites} from "@/components/ServerActions.server";
import FavouriteRecipe from "@/components/FavouriteRecipe";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";

export default async function Favourites() {
  const user = await currentUser();
  if(!user){
    console.log("in !user")
    throw new Error("not connected");
  }

  const favourites = await getFavourites(user.id);
  return (
    <>
      <div
        className="relative h-screen w-full bg-[url('/images/loading.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
        <Navbar />
        <Stack spacing={1}>
          <Typography variant="h4" align="center" color={'white'}>
            Vos Favoris
          </Typography>
          <Grid container spacing={2}>
            {favourites &&
              favourites.length > 0 ?
              favourites.map((favourite) => {
                return (
                  <FavouriteRecipe recipe={favourite.recipe} key={favourite.recipe.id}></FavouriteRecipe>
                )
              }) :
              (<Typography align="center" color={'white'}>
              Vous avez aucun recipe dans vos favoris...
            </Typography>)}
          </Grid>
        </Stack>
      </div>
    </>
  )
}