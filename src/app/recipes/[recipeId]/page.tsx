'use client';
import {useRouter} from "next/navigation";
import {useRecipe} from "../../../../hooks/useRecipe";
import {Divider, ListItemButton, ListItemIcon, ListItemText, Stack, Typography} from "@mui/material";
import Navbar from "@/components/Navbar";
import ListItem from "@mui/material/ListItem";
import { ArrowCircleRight, SoupKitchen} from "@mui/icons-material";
import React from "react";
import List from "@mui/material/List";

export default function Recipe({params}: {params: {recipeId: string}}) {
    const recipe = useRecipe(params.recipeId);

    return(
        <>
            <div className="relative h-screen w-full bg-[url('/images/bg-kitchen-2.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
                <Navbar/>
                <div className={'mx-3 my-3'}>
                    <Stack spacing={4}>
                        <Typography variant={'h2'} >{recipe?.name}</Typography>
                        <Divider/>
                        <div className={'flex justify-evenly'}>
                            <div className="bg-white bg-opacity-70 px-16 py-8 items-center self-center mt-2 lg:w-2/5 lg:max-w-5xl rounded-md w-full my-auto">
                                <Typography variant={'h4'} color={'white'}>Ingrédients</Typography>
                                <List>
                                    {recipe.ingredients.map(ingredient => (
                                        <ListItem key={ingredient}>
                                            <ListItemIcon>
                                                <SoupKitchen/>
                                            </ListItemIcon>
                                            <ListItemButton>
                                                <ListItemText primary={ingredient}/>
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                            <div className="bg-white bg-opacity-70 px-16 py-8 items-center self-center mt-2 lg:w-2/5 lg:max-w-5xl rounded-md w-full my-auto">
                                <Typography variant={'h4'} color={'white'}>Préparation</Typography>
                                <List>
                                    {recipe.steps.map(step => (
                                        <ListItem key={step}>
                                            <ListItemIcon>
                                                <ArrowCircleRight/>
                                            </ListItemIcon>
                                            <ListItemButton>
                                                <ListItemText primary={step}/>
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </div>
                    </Stack>
                </div>
            </div>
        </>
    )
}