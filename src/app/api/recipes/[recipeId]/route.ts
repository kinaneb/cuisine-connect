import {NextRequest, NextResponse} from "next/server";
import prismadb from "../../../../../lib/prismadb";

export async function GET(req: NextRequest, params: any) {
    try {
        const recipeId = params.params.recipeId;

        if (!recipeId) {
            throw new Error('Invalid ID');
        }

        const recipe = await prismadb.recipe.findUnique({
            where: {
                id: params.params.recipeId
            }
        });

        if (!recipe) {
            throw new Error('Invalid ID');
        }
        return NextResponse.json(
            {recipe},
            {
                status: 200
            }
        );

    }catch (e) {
        return NextResponse.json(
            {
                message: e
            },
            {
                status: 500
            }
        );
    }
}