import {z} from "zod";
import OpenAI from "openai";
import {NextResponse} from "next/server";
import {getUserProfileDetails} from "@/components/ServerActions.server";
import {currentUser} from "@clerk/nextjs";

const postSchema = z.object({
    search: z.string(),
    brief : z.string()
})

export async function POST(request: Request) {
    const body = await request.json();
    const user = await currentUser();
    if(!user) {
        throw new Error("no user");
    }
    const userProfileDetails = await getUserProfileDetails(user.id);
    // console.log("userProfileDetails", userProfileDetails);
    const { search, brief } = postSchema.parse(body);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const completions = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: brief + userProfileDetails
            },
            {
                role: "user",
                content: search
            }
        ]
    });

    return NextResponse.json({
        message: completions.choices[0].message as unknown as string
    });
}