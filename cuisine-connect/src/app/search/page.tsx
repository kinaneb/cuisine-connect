'use client';

import React, {FormEventHandler, useCallback, useRef, useState, ChangeEventHandler} from 'react';
import {Button, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Typography} from "@mui/material";
import {useRecipes} from "../../../hooks/useRecipes";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {z} from "zod";
import {SoupKitchen} from "@mui/icons-material";
import Navbar from "@/components/Navbar";
import {generateRecipe} from "@/components/ServerActions.server";
import {useRouter} from 'next/navigation';
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';

const schema = z.object({
    message: z.object({
        role: z.string(),
        content: z.string()
    })
});

const recipesSchema = z.array(z.string());



export default function SearchPage() {
    const searchRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");
    const [recipes, setRecipes] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(false);
    const Router = useRouter();
    const [recipeId, setRecipeId] = useState("");
    const updateRecipeId = (recipeId: string | undefined) => {
        if(recipeId === undefined) return;
        setLoading(true);
        setRecipeId(recipeId);
        setLoading(false);
    }
    const handleRecipe = async (recipe: string) => {
        console.log(recipe);
        const recipeId = await generateRecipe(recipe);

        updateRecipeId(recipeId);

        Router.push(`/recipes/${recipeId}`);
        // useEffect(() => {
        //     const Router = useRouter();
        //     Router.push({
        //         pathname: `/recipes/${recipeId}`,
        //         query: {recipeId: recipeId}
        //     });
        // }, [recipeId]);
    }

    let brief: string;
    const existingRecipes = useRecipes();

    if (existingRecipes.length !== 0) {
        const recipesNames = existingRecipes.map(recipe => recipe.name);
        const recipesString = recipesNames.join(', ');
        brief = `Tu es un chef cuisinier qui recommande des recettes de cuisine à des internautes. Voici les noms des recettes déjà stockées en base de données: ${recipesString}. Tu devras en fonction de ces recettes suggérer maximum 5 recettes diverses et variées à l\'internaute en fonction du texte de recherche et des recettes précédemment mentionnées. Tu renverras un tableau JSON de chaînes de caractères dans lequel tu renverra la liste des recettes qui correspondent à la recherche qui te sera donnée. Tu ne dois rien renvoyer d\'autre que du JSON, pas de texte avant ou après pas de bonjour ni rien du tout d\'autre que du JSON et le tableau ne doit pas être inclu dans aucune propriété, seulement un tableau tout simple de string.`
    }

    const updateSearch: ChangeEventHandler<HTMLInputElement> = useCallback(event => {
        setSearch(event.target.value);

    }, []);

    const getSearchResults: FormEventHandler = useCallback(event => {
        event.preventDefault();

        setLoading(true);
        setRecipes([]);

        
        fetch('api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                search,
                brief
            })
        }).then(response =>{
            return response.json();
        }).then(json => {
            return schema.parse(json);
        }).then(data => {
            return JSON.parse(data.message.content);
        }).then(data => {
            return recipesSchema.parse(data);
        }).then(recipes => {
            setRecipes(recipes);
        }).catch(error => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });

    }, [recipes, search]);

    if (loading) {
        return (
            <div className="relative h-screen w-full bg-[url('/images/loading.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
                <Stack spacing={1}>
                    <Typography variant="h4" align="center">
                        Chargement
                    </Typography>
                    <Typography align="center">
                        Merci de patienter pendant que nous recherchons des recettes correspondantes à votre recherche...
                    </Typography>
                </Stack>
            </div>
        );
    }

    return (
        <>
            <div className="relative h-screen w-full bg-[url('/images/kitchen.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
                <div className="bg-black w-full h-screen bg-opacity-50">
                    <Navbar/>
                    <div className="flex justify-center">
                        <div className="bg-white bg-opacity-70 px-16 py-8 items-center self-center mt-2 lg:w-2/5 lg:max-w-5xl rounded-md w-full my-auto">
                            <Typography variant="h4" align="center" className='mb-6'>
                                Rechercher une recette
                            </Typography>
                            <Stack component="form" spacing={1} onSubmit={getSearchResults}>
                                <TextField label={'Recherche'} ref={searchRef} value={search} onChange={updateSearch}></TextField>
                                <Button type='submit' variant='contained'>Rechercher</Button>
                            </Stack>
                            {recipes.length !== 0 && (
                                <Stack spacing={4}>
                                    <div className="my-16">
                                        <Typography variant={'h5'} align={'center'}>
                                            Recettes proposées
                                        </Typography>
                                    </div>
                                    <List>
                                        {recipes.map(recipe => (
                                            <div key={`div-${recipe}`} className={'bg-white'}>
                                                <ListItem key={`list-${recipe}`}>
                                                    <ListItemIcon>
                                                        <SoupKitchen/>
                                                    </ListItemIcon>
                                                    <ListItemButton>
                                                        <ListItemText onClick={() => handleRecipe(recipe)} primary={recipe} secondary="En savoir plus" />
                                                    </ListItemButton>
                                                </ListItem>
                                            </div>
                                        ))}
                                    </List>
                                </Stack>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
