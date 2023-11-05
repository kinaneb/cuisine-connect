import {Button} from "@mui/material";

export default function Navbar() {
    return (
        <>
            <nav>
                <div className={'flex py-2'}>
                    <Button href={'/'} color={'inherit'} variant={'contained'} className={'mx-2'}>Accueil</Button>
                    <Button href={'/recipes'} color={'inherit'} variant={'contained'} className={'mx-2'}>Nos recettes</Button>
                    <Button href={'/search'} color={'inherit'} variant={'contained'} className={'mx-2'}>Rechercher des recettes</Button>
                </div>
            </nav>
        </>
    )
}