import OpenPostcard from "@/components/openPostcard";
import { getPostcard } from "@/lib/firebase";
import { notFound } from "next/navigation";
import { PageParams } from "@/types/types";

export default async function OpenPostcardPage({ params } : PageParams){
    const { id } = params;
    const postcard = await getPostcard(id);
    if(!postcard) return notFound();
    
    const { message, track, image } = postcard;

    return(
        <OpenPostcard
            message = {message}
            track = {track}
            image = {image}
        />
    );
}