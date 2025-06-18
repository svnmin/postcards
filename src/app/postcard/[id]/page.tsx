
import OpenPostcard from "@/components/openPostcard";
import { getPostcard } from "@/lib/firebase";
import { notFound } from "next/navigation";

type PageParams = Promise<{id: string}>

export default async function OpenPostcardPage({ params }: {params : PageParams}) {
    const { id } = await params
    const postcard = await getPostcard(id);

    if (!postcard) return notFound();

    const { message, track, image } = postcard;

    return (
        <OpenPostcard
            message={message}
            track={track}
            image={image}
        />
    );
}