"use client"

import { useState, useRef, useEffect } from "react"
import { PostcardProps } from "@/types/types";

import styled from "styled-components";

export default function OpenPostcard({ message, track, image }: PostcardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const postcardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setIsFlipped(true);
    }, []);

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
                            <CardSide>POSTCARD: FRONT</CardSide>
                            {image ? (
                                <Image src={image.url} alt="Postcard front" />
                            ) : (
                                <NoImage>( postcard image unavailable for now )</NoImage>
                            )}
                            {image && (
                                <UnsplashAttr>
                                    Photo by{' '}
                                    <a
                                        href={`https://unsplash.com/@${image.user.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="artist"
                                    >
                                        {image.user.name}
                                    </a>{' '}
                                    on{' '}
                                    <a
                                        href="https://unsplash.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="unsplash"
                                    >
                                        Unsplash
                                    </a>
                                </UnsplashAttr>
                            )}
                        </PostcardFront>
                    ) : (
                        <PostcardBack>
                            <PostcardUpper>
                                <p>POSTCARD: BACK</p>
                            </PostcardUpper>
                            <PostcardBody>
                                <BodyLeft>
                                    <Message>
                                        <p>{message}</p>
                                    </Message>
                                </BodyLeft>
                                <CenterDiv>
                                    <div className="divider" />
                                </CenterDiv>
                                <BodyRight>
                                    <TrackText>
                                        <p>Track :</p>
                                    </TrackText>
                                    <MiniPlayer>
                                        <iframe
                                            src={`https://open.spotify.com/embed/track/${track.id}`}
                                            width="100%"
                                            height="380"
                                            frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"
                                            className="rounded"
                                        ></iframe>
                                    </MiniPlayer>
                                </BodyRight>
                            </PostcardBody>
                            <PostcardLower>
                                <p>2025 POST_OFFICE</p>
                            </PostcardLower>
                        </PostcardBack>
                    )}
                </PostcardWrapper>
            </PostcardContainer>
        </Container>
    );
}


const Container = styled.div`
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`

const PostcardContainer = styled.div`
    width: 960px;
    height: 648px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    position: relative;
`
const PostcardWrapper = styled.div`
    width: 920px;
    height: 608px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`
//FRONT_SIDE
const PostcardFront = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
`
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
`

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

const NoImage = styled.div`
    font-size: 12px;
    color: #000000;
    margin: auto;
`

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
    .artist {
        text-decoration: underline;
        &:hover {
            color: #ffffff;
            background: #001ac0;
        }
    }
    .unsplash {
        text-decoration: underline;
        &:hover {
            color: #ffffff;
            background: #ff0000;
        }
    }
`

//BACK_SIDE
const PostcardBack = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
`

const PostcardUpper = styled.div`
    height: 10%;
    width: 100%;
    position: relative;
    p {
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
`

const PostcardLower = styled.div`
    height: 10%;
    width: 100%;
    position: relative;
    p {
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
`

const PostcardBody = styled.div`
    height: 80%;
    display: flex;
    align-items: center;
`

const BodyLeft = styled.div`
    width: 49%;
    height: 100%;
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`

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
`

const BodyRight = styled.div`
    width: 49%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const TrackText = styled.div`
    padding: 4px;
`

const MiniPlayer = styled.div`
`

const Message = styled.div`
    width: 70%;
    text-align: center;
    p {
        color: #000000;
        font-size: 12px;
    }
`