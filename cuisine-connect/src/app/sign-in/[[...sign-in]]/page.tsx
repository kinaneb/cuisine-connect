import React from "react";
import {Stack, Typography} from "@mui/material";
import {SignIn} from '@clerk/nextjs';
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  return (
    <div className="relative h-screen w-full bg-[url('/images/loading.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <Navbar/>
      <div className="h-screen flex items-center justify-center ">
        <div className="bg-white bg-opacity-70 px-28 py-28 rounded-2xl">
          <Stack spacing={1}>
            <Typography variant="h4" align="center">
              <SignIn/>
            </Typography>
          </Stack>
        </div>
      </div>
    </div>
  );
}