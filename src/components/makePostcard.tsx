"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Track, UnsplashImage } from "@/types/types"
import { handleSubmit } from "@/lib/firebase"
import { getRandomImage } from "@/lib/unsplash"

import styled from "styled-components"

export default function MakePostcard() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<Track[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<UnsplashImage | null>(null);

    const postcardRef = useRef<HTMLDivElement | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(true);
    }, []);

    useEffect(() => {
        const savedImage = localStorage.getItem("postcardImage");
        const savedTimestamp = localStorage.getItem("postcardImageTimestamp");
        const now = Date.now();
        const maxAge = 1000 * 60 * 60;

        if (savedImage && savedTimestamp && now - parseInt(savedTimestamp) < maxAge) {
            setImage(JSON.parse(savedImage));
        } else {
            const fetchImage = async () => {
                const img = await getRandomImage();
                setImage(img);
                localStorage.setItem("postcardImage", JSON.stringify(img));
                localStorage.setItem("postcardImageTimestamp", now.toString());
            };
            fetchImage();
        }
    }, []);

    const trackSearch = async () => {
        if (!query) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/spotify?type=search&q=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error('Failed to fetch results');
            const data = await res.json();
            setResults(Array.isArray(data.results) ? data.results : []);
        } catch {
            setError('* SOMETHING WENT WRONG *');
            setTimeout(() => setError(''), 1500);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async () => {
        if (!message || !selectedTrack || !image) {
            setError('* NEED TO FINISH THE POSTCARD FIRST *');
            setTimeout(() => setError(''), 1500);
        } else {
            try {
                const id = await handleSubmit(message, selectedTrack, image);
                const url = `${window.location.origin}/postcard/${id}`;
                await navigator.clipboard.writeText(url);
                alert(`Postcard link copied \n${url}`);

                localStorage.removeItem("postcardImage");
                localStorage.removeItem("postcardImageTimestamp");

                setQuery('');
                setResults([]);
                setSelectedTrack(null);
                setMessage('');
                setImage(null);
                setIsFlipped(true);
                window.location.href = "/";
            } catch {
                setError('* FAILED TO SAVE ThE POSTCARD *');
                setTimeout(() => setError(''), 1500);
            }
        }
    };

    return (
        <Container
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                if (postcardRef.current && !postcardRef.current.contains(e.target as Node)) {
                    setIsFlipped((prev) => !prev);
                };
            }}
        >
            <PostcardContainer ref={postcardRef}>
                <PostcardWrapper>
                    {isFlipped ? (
                        <PostcardFront>
                            <CardSide>
                                <p>POSTCARD {isFlipped ? (":FRONT") : (": BACK")}</p>
                            </CardSide>
                            {image ? (
                                <Image src={image.url} alt="Postcard front" />
                            ) : (
                                <NoImage>( postcard image unavailable for now )</NoImage>
                            )}
                            {image && (
                                <UnsplashAttr>
                                    Photo by{' '}
                                    <a href={`https://unsplash.com/@${image.user.username}`} target="_blank" rel="noopener noreferrer" className="artist">
                                        {image.user.name}
                                    </a>{' '}
                                    on{' '}
                                    <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="unsplash">
                                        Unsplash
                                    </a>
                                </UnsplashAttr>
                            )}
                        </PostcardFront>
                    ) : (
                        <PostcardBack>
                            {error && (
                                <OverlayErrorText>
                                    <p>{error}</p>
                                </OverlayErrorText>
                            )}
                            <PostcardUpper>
                                <p>POSTCARD {isFlipped ? (":FRONT") : (": BACK")}</p>
                            </PostcardUpper>
                            <PostcardBody>
                                <BodyLeft>
                                    <MessageInput
                                        contentEditable
                                        suppressContentEditableWarning
                                        data-placeholder="( write your message here )"
                                        onInput={(e: React.MouseEvent<HTMLDivElement>) => setMessage(e.currentTarget.textContent || '')}
                                    />
                                </BodyLeft>
                                <CenterDiv>
                                    <div className="divider" />
                                </CenterDiv>
                                <BodyRight>
                                    {results.length > 0 && (
                                        <PlayerSect>
                                            {selectedTrack && (
                                                <MiniPlayer>
                                                    <iframe
                                                        src={`https://open.spotify.com/embed/track/${selectedTrack.id}`}
                                                        width="100%"
                                                        height="80"
                                                        frameBorder="0"
                                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                        loading="lazy"
                                                        className="rounded"
                                                    />
                                                </MiniPlayer>
                                            )}
                                        </PlayerSect>
                                    )}
                                    <SearchSect>
                                        <SearchBar>
                                            {loading && <SearchingText>searching...</SearchingText>}
                                            <SearchInput>
                                                <input
                                                    type="text"
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    placeholder="( find your track here )"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            trackSearch();
                                                        }
                                                    }}
                                                />
                                            </SearchInput>
                                            <SearchBtn>
                                                <button onClick={trackSearch}>search</button>
                                            </SearchBtn>
                                        </SearchBar>
                                        <SearchResults>
                                            {results.map((track) => (
                                                <Results key={track.id}>
                                                    <TrackInfo>
                                                        <p className="track">{track.name}</p>
                                                        <p className="artist">{track.artists}</p>
                                                    </TrackInfo>
                                                    <SelectBtn>
                                                        <button onClick={() => setSelectedTrack(track)}>select</button>
                                                    </SelectBtn>
                                                </Results>
                                            ))}
                                        </SearchResults>
                                    </SearchSect>
                                </BodyRight>
                            </PostcardBody>
                            <PostcardLower>
                                <p>2025 POST_OFFICE</p>
                                <button onClick={onSubmit}>send postcard</button>
                            </PostcardLower>
                        </PostcardBack>
                    )}
                </PostcardWrapper>
            </PostcardContainer>
        </Container>
    );
}

//POSTCARD_FRAME
const Container = styled.div`
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const PostcardContainer = styled.div`
    width: 960px;
    height: 648px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    position: relative;
`;
const PostcardWrapper = styled.div`
    width: 920px;
    height: 608px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

// FRONT_SIDE
const PostcardFront = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
`;
const CardSide = styled.div`
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 4px 8px;
    font-size: 12px;
    text-align: center;
    color: #000000;
    background: #ffffff;
    border: solid 1px #000000;
    &:hover{
        color: #ffffff;
        background: #ff0000;
        border-color: #ff0000;
    }
`;
const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const NoImage = styled.div`
    font-size: 12px;
    color: #000000;
    margin: auto;
`;
const UnsplashAttr = styled.div`
    position: absolute;
    bottom: 1%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 4px 8px;
    font-size: 12px;
    text-align: center;
    color: #000000;
    background: #ffffff;
    border: solid 1px #000000;
    .artist{
        text-decoration: underline;
        &:hover {
            color: #ffffff;
            background: #001ac0;
        }
    }
    .unsplash{
        text-decoration: underline;
        &:hover {
            color: #ffffff;
            background: #ff0000;
        }
    }
`;

// BACK_SIDE
const PostcardBack = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
`;
const OverlayErrorText = styled.div`
    width: 790px;
    height: 50px;
    text-align: center;
    line-height: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-25deg);
    z-index: 999;
    font-size: 36px;
    font-weight: 400;
    color: red;
    pointer-events: none;
    border: 1px solid #ff0000;
    padding: 8px 16px;
    background: white;
`;
const PostcardUpper = styled.div`
    height: 10%;
    width: 100%;
    position: relative;
    p{
        position: relative;
        top: 50%;
        left: 50%;
        width: fit-content;
        transform: translate(-50%, -50%);
        text-align: center;
        padding: 4px;
        font-size: 12px;
        color: #000000;
        background: #ffffff;
        border: solid 1px transparent;
        &:hover{
            color: #ffffff;
            background: #ff0000;
            border-color: #ff0000;
        }
    }
`;
const PostcardLower = styled.div`
    height: 10%;
    width: 100%;
    position: relative;
    p{
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        padding: 4px;
        font-size: 12px;
        color: #000000;
        background: #ffffff;
    }
    button {
        position: absolute;
        bottom: 1%;
        right: 3%;
        transform: translate(0, -50%);
        width: 100px;
        height: 30px;
        font-size: 12px;
        color: #000000;
        border: solid 1px #000000;
        outline: none;
        background: none;
        &:hover {
        color: #ffffff;
        background: #001ac0;
        }
    }
`;
const PostcardBody = styled.div`
    height: 80%;
    display: flex;
    align-items: center;
`;
const BodyLeft = styled.div`
    width: 49%;
    height: 100%;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`;
const MessageInput = styled.div`
    width: 70%;
    max-height: 90%;
    padding: 8px;
    font-size: 12px;
    border: none;
    outline: none;
    background: none;
    color: #000000;
    text-align: center;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-word;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &:empty::before {
        content: attr(data-placeholder);
        position: absolute;
        padding: 1px 4px;
        font-size: 12px;
        color: #000000;
        opacity: 1;
        pointer-events: none;
        text-align: center;
        width: fit-content
    }

    &::before {
        opacity: 0;
    }

    &:hover:empty::before {
        color: #ffffff;
        background-color: #ff0000;
    }

    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const CenterDiv = styled.div`
    width: 2%;
    height: 100%;
    display: flex;
    justify-content: center;
    .divider {
        width: 1px;
        height: 100%;
        background-color: #000000;
    }
`;
const BodyRight = styled.div`
    width: 49%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const PlayerSect = styled.div`
    width: 90%;
    height: 20%;
    align-items: center;
`;
const MiniPlayer = styled.div`

`;
const SearchSect = styled.div`
    width: 90%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const SearchBar = styled.div`
    position: relative;
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    gap: 35px;
    border: solid 1px #000000;
`;
const SearchInput = styled.div`
    width: 80%;
    display: flex;
    align-items: center;
    padding: 8px;
    input {
        width: 100%;
        border: none;
        outline: none;
        background: none;
        color: #000000;
        &::placeholder {
            width: fit-content;
            padding: 4px;
            font-size: 12px;
            color: #000000;
        }
        &:hover::placeholder {
            color: #ffffff;
            background: #ff0000;
        }
    }
`;
const SearchBtn = styled.div`
    width: 10%;
    display: flex;
    justify-content: center;
    button {
        padding: 1px 4px;
        font-size: 12px;
        color: #000000;
        border: none;
        outline: none;
        background: none;
        &:hover {
        color: #ffffff;
        background: #ff0000;
        }
    }
`;
const SearchResults = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const SearchingText = styled.div`
    position: absolute;
    left: 70%;
    transform: translate(-50%, 0);
    font-size: 12px;
    color: #838383;
    margin: auto;
    text-align: center;
`;
const Results = styled.div`
    padding: 4px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #000000;
    border-bottom: solid 1px #000000;
    &:hover {
        background: #e4e4e4;
    }
`;
const TrackInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    .track {
        font-size: 16px;
        font-weight: 600;
    }
    .artist {
        font-size: 12px;
        font-weight: 400;
    }
`;
const SelectBtn = styled.div`
    padding: 8px;
    button {
        padding: 0 4px;
        font-size: 12px;
        color: #000000;
        border: none;
        outline: none;
        background: none;
        &:hover {
        color: #ffffff;
        background: #ff0000;
        }
    }
`;