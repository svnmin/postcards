import OpenPostcard from "@/components/openPostcard";
import { getPostcard } from "@/lib/firebase";
import { notFound } from "next/navigation";


export default async function OpenPostcardPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const postcard = await getPostcard(id);
    if (!postcard) return notFound();

    return (
        <>
            <OpenPostcard
            message={postcard.message}
            track={postcard.track}
            image={postcard.image}
        />
        </>
    );
}