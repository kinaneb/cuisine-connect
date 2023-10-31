import Image from 'next/image'
import {Link, Stack, Typography} from "@mui/material";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
      <>
          <div className="relative h-screen w-full bg-[url('/images/kitchen.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <Navbar/>
              <div className="h-screen flex items-center justify-center ">
                  <div className="bg-white bg-opacity-70 px-28 py-28 rounded-2xl">
                    <Stack spacing={1}>
                        <Typography variant={'h4'}>
                            Bienvenue sur notre site de recette !
                        </Typography>
                        <Typography align={'center'}>
                            C'est par ici que ça se passe :)
                        </Typography>
                        <Link align={'center'} href={'/search'}>Rechercher des recettes</Link>
                    </Stack>
                  </div>
              </div>
          </div>
      </>
  )
}
