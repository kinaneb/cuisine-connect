import prismadb from "../../../../lib/prismadb";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
    try {
        const recipes = await prismadb.recipe.findMany();

        return NextResponse.json(
            {recipes},
            {status: 200}
        )
    }catch (e) {
        return NextResponse.json(
            {e},
            {status: 500}
        )
    }
}