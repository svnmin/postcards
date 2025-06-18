import OpenPostcard from "@/components/openPostcard";
import { getPostcard } from "@/lib/firebase";
import { notFound } from "next/navigation";

export default async function OpenPostcardPage({
    params,
}: {
    params: { id: string };
}) {
    const postcard = await getPostcard(params.id);
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