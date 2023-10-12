'use client';

import React, {useState} from 'react';
import {Input} from "@/components/Input";

function Search() {
    const [recipe, setRecipe] = useState('');

    return (
        <div className="relative h-screen w-full bg-[url('/images/kitchen.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-screen bg-opacity-50">
                <div className="flex justify-center">
                    <div className="bg-white bg-opacity-70 px-16 py-16 items-center self-center mt-2 lg:w-2/5 lg:max-w-5xl rounded-md w-full my-auto">
                        <Input id='recipe' onChange={(event: any) => setRecipe(event.target.value) } value={recipe} label="Tapez le nom de votre recette"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
