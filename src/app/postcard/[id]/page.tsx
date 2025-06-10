import { notFound } from 'next/navigation';
// import { getPostcard } from '@/lib/firebaseRTDB';
import { getPostcard } from '@/lib/firebaseFSDB';
import OpenPostcard01 from '@/components/openPostcard01';

interface PostcardProps {
  params: { id: string };
}
export default async function PostcardPage({ params }: PostcardProps){
  const postcard = await getPostcard(params.id);
  if(!postcard) return notFound();
  const { message, track } = postcard;
  return(
    <OpenPostcard01 message={message} track={track} />
  )
}