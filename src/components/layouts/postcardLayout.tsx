import { Track } from "@/types/spotifyTypes";
import { useRouter } from "next/router";
import { useState } from "react";


export default function PostcardLayout(){
    const [ query, setQuery] = useState('');
    const [ result, setResult ] = useState<Track[]>([]);
    const [ selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const [ message, setMessage ] = useState('');
    const router = useRouter();
}