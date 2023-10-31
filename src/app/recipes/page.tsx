'use client';

import {
    Card,
    CardActions,
    CardMedia,
    Grid,
    Stack,
    Typography,
    Button
} from "@mui/material";
import {useRecipes} from "../../../hooks/useRecipes";
import Navbar from "@/components/Navbar";

export default function Recipes() {
    const recipes  = useRecipes();

    if (recipes) {
        return (
            <>
                <div className="relative h-screen w-full bg-[url('/images/bg-kitchen.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
                    <div className="bg-black w-full h-screen bg-opacity-50">
                    <Navbar/>
                        <Stack spacing={4}>
                            <Typography variant={'h4'} align={'center'} color={'white'}>Nos recettes</Typography>
                        </Stack>
                        <div className={'mx-16 my-14'}>
                            <Grid container spacing={2}>
                                {recipes &&
                                    recipes.map((recipe) => {
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
                                })}
                            </Grid>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}