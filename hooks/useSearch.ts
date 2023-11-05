import {useEffect, useState} from "react";
import {z} from "zod";

export function useSearch(search: string, brief: string) {

    const schema = z.object({
        message: z.object({
            role: z.string(),
            content: z.string()
        })
    });

    const recipesSchema = z.array(z.object({
        name: z.string(),
        thumbnailUrl: z.string(),
    }));
    const [resultSearch, setResultSearch] = useState<Array<object>>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        (async () => {
            await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    search,
                    brief
                })
            }).then(response =>{
                return response.json();
            }).then(json => {
                return schema.parse(json);
            }).then(data => {
                return JSON.parse(data.message.content);
            }).then(recipes => {
                setResultSearch(recipes);
            }).catch(error => {
                console.error(error);
            }).finally(() => {
                setLoading(false);
            });

        })();
    }, [search, brief, schema, recipesSchema])

    return resultSearch;
}
