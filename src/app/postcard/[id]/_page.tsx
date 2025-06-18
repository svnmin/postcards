export const dynamic = 'force-dynamic';

import OpenPostcard from "@/components/openPostcard";
import { getPostcard } from "@/lib/firebase";
import { notFound } from "next/navigation";

interface Props {
    params: {
        id: string;
    };
}

export default async function OpenPostcardPage({ params }: Props) {
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