// src/app/postcard/[id]/page.tsx

import { getPostcard } from '@/lib/firebaseFSDB';
import OpenPostcard01 from '@/components/openPostcard01';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export default async function PostcardPage({ params }: Props) {
  const postcard = await getPostcard(params.id);

  if (!postcard) return notFound();

  const { message, track, image } = postcard;

  return (
    <OpenPostcard01
      message={message}
      track={track}
      image={image}
    />
  );
}