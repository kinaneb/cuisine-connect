import {Button} from "@mui/material";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs"

export default function Navbar() {
  // const {userId} = auth();
  // console.log("userId", userId);
  return (
    <>
      <nav>
        <div className={'flex py-2'}>
          <Button href={'/'} color={'inherit'} variant={'contained'} className={'mx-2'}>Accueil</Button>
          <SignedIn>
              <Button href={'/recipes'} color={'inherit'} variant={'contained'} className={'mx-2'}>Nos
                recettes</Button>
              <Button href={'/search'} color={'inherit'} variant={'contained'} className={'mx-2'}>Rechercher
                des recettes
              </Button>
              <div className="ml-auto mx-2">
                < UserButton afterSignOutUrl="/"/>
              </div>
            </SignedIn>
              <SignedOut>
                <div className="flex items-end ml-auto">
                  <Button href={'/sign-up'} color={'inherit'} variant={'contained'} className={'mx-2'}>Créer un
                    compte</Button>
                  <Button href={'/sign-in'} color={'inherit'} variant={'contained'}
                          className={'mx-2 ml-auto'}>Connexion</Button>
                </div>
              </SignedOut>
        </div>
      </nav>
    </>
  )
}