'use client';
import {useRouter} from "next/navigation";
import {useRecipe} from "../../../../hooks/useRecipe";
import {
    Card, CardActions,
    CardMedia,
    Divider,
    Grid,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import Navbar from "@/components/Navbar";
import ListItem from "@mui/material/ListItem";
import { ArrowCircleRight, SoupKitchen} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import List from "@mui/material/List";

export default function Recipe({params}: {params: {recipeId: string}}) {
    const recipe = useRecipe(params.recipeId);
    const [similarsRecipes, setSimilarRecipes] = useState<Array<object>>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // setSimilarRecipes([]);

        if (recipe.id !== '') {

            let brief: string = `Tu es un chef cuisinier qui recommande des recettes de cuisine à des internautes. En fonction de cette recette : ${recipe.name}, tu devras proposer maximum 3 recettes similaires à l\'internaute. Tu renverras un tableau JSON contenant  uniquement des objets. Chaque objet sera constitué d’une clé name, et d’une autre clé thumnailurl. Tu ne dois rien renvoyer d\'autre que du JSON, pas de texte avant ou après pas de bonjour ni rien du tout d\'autre que du JSON et le tableau ne doit pas être inclu dans aucune propriété, seulement un tableau tout simple d’objets. Tu supprimeras toutes clé qui ne sont pas name ou thumbnailurl.`;

            (async () => {
                await fetch('/api/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        search: recipe.name,
                        brief
                    })
                }).then(response =>{
                    return response.json();
                }).then(data => {
                    return JSON.parse(data.message.content);
                }).then(recipes => {
                    console.log(recipes);
                    setSimilarRecipes(recipes);
                }).catch(error => {
                    console.error(error);
                }).finally(() => {
                    setLoading(false);
                });

            })();
        }

    }, [recipe]);


    if (loading) {
        return (
            <div className="relative h-screen w-full bg-[url('/images/loading.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
                <Stack spacing={1}>
                    <Typography variant="h4" align="center">
                        Chargement
                    </Typography>
                    <Typography align="center">
                        Merci de patienter pendant que nous recherchons votre recette...
                    </Typography>
                </Stack>
            </div>
        );
    }


    return(
        <>
            <div className="relative h-fit w-full bg-[url('/images/bg-kitchen-2.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
                <Navbar/>
                <div className={'mx-3 my-3'}>
                    <Stack spacing={1}>
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
                <Divider/>
                <div className={'my-8 mx-16 py-12'}>
                    <Typography variant={'h2'} align={'center'} color={'white'}>Recettes similaires</Typography>
                    <div className={'mt-8'}>
                        <Grid container spacing={3}>
                        {similarsRecipes.length > 0 &&
                            similarsRecipes.map((recipe, index) => {
                                return (
                                    <Grid key={recipe.name} item xs={4}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardMedia
                                                component="img"
                                                height="194"
                                                image={`/images/thumbnail-${index}.jpg`}
                                                alt="Paella dish"
                                            />
                                            <CardActions>
                                                <div>
                                                    <Typography>{recipe.name}</Typography>
                                                    {/*<Button variant={'contained'}  color={'inherit'} href={`/recipes/${recipe.id}`}>Voir le détail</Button>*/}
                                                </div>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })}
                    </Grid>
                    </div>
                </div>
            </div>
        </>
    )
}