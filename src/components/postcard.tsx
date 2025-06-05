"use client"
import { FC, useState } from "react";
import { Track } from "@/types/spotifyTypes";


const Postcard : FC = () => {
  const [ query, setQuery ] = useState('');
  const [ results, setResults ] = useState<Track[]>([]);
  const [ chosenTrack, setChosenTrack ] = useState<Track | null>(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const trackSearch = async () => {
    if(!query) return;
    setLoading(true);
    setError('');
    try{
      const res = await fetch(`/api/spotify?type=search&q=${encodeURIComponent(query)}`);
      if(!res.ok){
        throw new Error('Failed to fetch results');
      }
      const data = await res.json();
      setResults(data.results);
    }catch(err){
      setError('Something went wrong');
    }finally{
      setLoading(false);
    }
  };
  return(
    <></>
  )
}

export default Postcard