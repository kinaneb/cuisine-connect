'use client';

import React, {FormEventHandler, useCallback, useRef, useState, ChangeEventHandler} from 'react';
import {Button, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Typography} from "@mui/material";
import {useRecipeData} from "../../../hooks/useRecipeData";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {z} from "zod";
import {SoupKitchen} from "@mui/icons-material";


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
    const brief = 'Tu es un chef cuisinier qui recommande des recettes de cuisine à des internautes. Voici les noms des recettes déjà stockées en base de données. Tu devras en fonction de ces recettes suggérer d\'autres recette à l\'internaute en fonction du texte de recherche et des recettes précédemment mentionnées. Tu renverras un tableau JSON de chaînes de caractères dans lequel tu renverra la liste des recettes qui correspondent à la recherche qui te sera donnée. Tu ne dois rien renvoyer d\'autre que du JSON, pas de texte avant ou après pas de bonjour ni rien du tout d\'autre que du JSON et le tableau ne doit pas être inclu dans aucune propriété, seulement un tableau tout simple de string.'

    const existingRecipes = useRecipeData();

    // console.log(existingRecipes.recipes.length, existingRecipes);
    // if (existingRecipes.length > 0) {
    //     const recipesNames = existingRecipes.recipes.map(recipe => recipe.name);
    //     console.log(recipesNames);
    //     const recipesString = recipesNames.join('');
    // }


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
            console.log(data);
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
            <Stack spacing={1}>
                <Typography variant="h4" align="center">
                    Chargement
                </Typography>
                <Typography align="center">
                    Merci de patienter pendant que nous recherchons des recettes correspondantes à votre recherche...
                </Typography>
            </Stack>
        );
    }

    return (
        <div className="relative h-screen w-full bg-[url('/images/kitchen.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-screen bg-opacity-50">
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
                                <Typography variant={'h5'} align={'center'} className={"mt-4"}>
                                    Recettes proposées
                                </Typography>
                                <List>
                                    {recipes.map(recipe => (
                                        <div key={recipe} className={'bg-white'}>
                                            <ListItem key={recipe}>
                                                <ListItemIcon>
                                                    <SoupKitchen/>
                                                </ListItemIcon>
                                                <ListItemButton>
                                                    <ListItemText primary={recipe} secondary="En savoir plus" />
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
    );
}
