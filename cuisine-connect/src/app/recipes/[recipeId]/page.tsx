'use client';
import {useRecipe} from "../../../../hooks/useRecipe";
import {
    Card, CardActions,
    CardMedia,
    Divider,
    Grid,
    Button,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography, CircularProgress
} from "@mui/material";
import Navbar from "@/components/Navbar";
import ListItem from "@mui/material/ListItem";
import { ArrowCircleRight, SoupKitchen} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import List from "@mui/material/List";

interface Accompaniement {
    wine: string,
    cheese: string,
    dessert: string
}

interface SimilarRecipe {
    name: string,
    thumbnailUrl: string
}

interface ShoppingList {
    name: string,
    quantity: string,
    price: string
}

export default function Recipe({params}: {params: {recipeId: string}}) {
    const recipe = useRecipe(params.recipeId);
    const [similarsRecipes, setSimilarRecipes] = useState<Array<SimilarRecipe>>([]);
    const [accompanients, setAccompanients] = useState<Array<Accompaniement>>([]);
    const [shoppingList, setShoppingList] = useState<Array<ShoppingList>>([]);
    const [loading, setLoading] = useState(false);
    const [loadingAccompanients, setLoadingAccompanients] = useState(false);
    const [loadingShoppingList, setLoadingShoppingList] = useState(false);
    const [displayAccompaniement, setDisplayAccompaniement] = useState(false);
    const [displayShoppingList, setDisplayShoppingList] = useState(false);

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
                    setSimilarRecipes(recipes);
                }).catch(error => {
                    console.error(error);
                }).finally(() => {
                    setLoading(false);
                });

            })();
        }

    }, [recipe]);

    const targetAccompaniement = () => {
        let brief: string = `Voici une recette pour laquelle j’aimerai que tu me suggères des accompagnements : . Les accompagnements que j’aimerai que tu me proposes doivent être constitués du nom d'un vin, d’un dessert ainsi qu’un fromage. Chaque proposition devra être unique. Le tableau ne devra contenir que les objets, rien d'autre que les objets. Chaque objet sera constitué d’une clé wine, desert et cheese. Tu me feras 3 propositions. Tu ne dois rien renvoyer d\'autre que du JSON, pas de texte avant ou après pas de bonjour ni rien du tout d\'autre que du JSON, seulement un tableau tout simple d’objets. Tu supprimeras toutes clé qui ne sont pas wine, dessert ou cheese.`;
        setLoadingAccompanients(true);

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
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                return JSON.parse(data.message.content);
            }).then(accompanients => {
                setAccompanients(accompanients);
            }).catch(error => {
                console.error(error);
            }).finally(() => {
                setDisplayAccompaniement(true);
                setLoadingAccompanients(false);
            });

        })();
    }

    const targetShoppingList = () => {
        let brief: string = `Voici une recette pour laquelle j’aimerai que tu me génère une liste de courses. Trois clés devront apparaître au sein du tableau JSON, le nom de l’ingrédient dont la clé sera name, la quantité requise dont la clé sera quantity et une estimation de prix dont la clé sera price.Tu ne dois rien renvoyer d\'autre que du JSON, pas de texte avant ou après pas de bonjour ni rien du tout d\'autre que du JSON, seulement un tableau tout simple d’objets. Tu supprimeras toutes clés qui ne sont pas name, quantity ou price.`;
        setLoadingShoppingList(true);

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
            }).then(response => {
                return response.json();
            }).then(data => {
                console.log(data);
                return JSON.parse(data.message.content);
            }).then(shoppingList => {
                setShoppingList(shoppingList);
            }).catch(error => {
                console.error(error);
            }).finally(() => {
                setDisplayShoppingList(true);
                setLoadingShoppingList(false);
            });
        })();
    }

    if (loading) {
        return (
            <div className="relative h-screen w-full bg-[url('/images/loading.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
                <Stack spacing={1}>
                    <Typography variant="h4" align="center" color={'white'}>
                        Chargement
                    </Typography>
                    <Typography align="center"  color={'white'}>
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
                        <div className={'flex justify-around'}>
                            <Typography variant={'h2'} >{recipe?.name}</Typography>
                        </div>
                        <Divider light={false}/>
                        <div className={'flex justify-evenly'}>
                            <div className={'flex-col'}>
                                <div className="bg-white bg-opacity-70 px-16 py-8 items-center self-center mt-2 rounded-md w-full my-auto mx-3">
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
                                <div className="bg-white bg-opacity-70 px-16 py-8 items-center self-center mt-2 rounded-md w-full my-auto mx-3">
                                    <Typography variant={'h4'} color={'white'}>Accompagnements</Typography>
                                    {!displayAccompaniement && (
                                        <Button color={'inherit'} variant={'contained'} size={'small'} onClick={targetAccompaniement}>Accompagnements</Button>
                                    )}
                                    {loadingAccompanients && (
                                        <CircularProgress size={'1rem'} color={'inherit'}/>
                                    )}
                                    {displayAccompaniement && (
                                        <div className="bg-white bg-opacity-70 px-16 py-8 items-center self-center mt-2 rounded-md w-full my-auto mx-3">
                                            <List>
                                                {accompanients.map(accompanient => (
                                                    <ListItem key={accompanient.wine}>
                                                        <ListItemIcon>
                                                            <SoupKitchen/>
                                                        </ListItemIcon>
                                                        <ListItemButton>
                                                            <ListItemText primary={accompanient.wine} />
                                                        </ListItemButton>
                                                        <ListItemButton>
                                                            <ListItemText primary={accompanient.cheese} />
                                                        </ListItemButton>
                                                        <ListItemButton>
                                                            <ListItemText primary={accompanient.dessert} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={'flex-col '}>
                                <div className="bg-white bg-opacity-70 px-16 py-8 items-center self-center mt-2 rounded-md my-auto mx-6">
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
                                <div className="bg-white bg-opacity-70 px-16 py-8 items-center self-center mt-2 rounded-md my-auto mx-6">
                                    <Typography variant={'h4'} color={'white'}>Liste des courses</Typography>
                                    {!displayShoppingList && (
                                        <Button variant={'contained'} color={'inherit'} size={'small'} onClick={targetShoppingList}>Générer la liste de course</Button>
                                    )}
                                    {loadingShoppingList && (
                                        <CircularProgress size={'1rem'} color={'inherit'} />
                                    )}
                                    {displayShoppingList && (
                                        <List>
                                            {shoppingList.map(item => (
                                                <ListItem key={item.name}>
                                                    <ListItemIcon>
                                                        <ArrowCircleRight/>
                                                    </ListItemIcon>
                                                    <ListItemButton>
                                                        <ListItemText primary={item.name} secondary={`${item.quantity} | ${item.price} `} />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </div>
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