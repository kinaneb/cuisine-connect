import {z} from "zod";
import OpenAI from "openai";
import {NextResponse} from "next/server";

const postSchema = z.object({
    search: z.string(),
    brief : z.string()
})

export async function POST(request: Request) {
    const body = await request.json();

    const { search, brief } = postSchema.parse(body);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const completions = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: brief
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