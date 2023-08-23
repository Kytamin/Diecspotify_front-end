import React, {useEffect, useState} from 'react'
import "./component.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import {useDispatch, useSelector} from "react-redux";
import {setSong} from "../redux/features/songs/songSlice";
import {setPlayBar, setPlay} from "../redux/features/musicPlayBar/playBarSlice";
import {Link} from "react-router-dom";
import Stack from "@mui/material/Stack";
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function SongCard({songUrl, image, title, artist, id, song, likes}) {
    const dispatch = useDispatch();
    const [flag, setFlag] = useState(false);
    const currentSong = useSelector(state => state.song.song)
    const playingMusic = useSelector(state => state.playBar.playingMusic);
    useEffect(() => {
        if (song.songName !== currentSong.songName) setFlag(false)
        else setFlag(playingMusic)
    }, [currentSong]);
    useEffect(() => {
        if (song.songName === currentSong.songName) setFlag(playingMusic)
    }, [playingMusic])

    return (
        <div
            className='songCardDiv'
            style={{
                width: '14vw',
                height: '35vh',
            }}
        >
            <Link to={`/song/detail/${song._id}`}>
                <img
                    src={image}
                    alt="image"
                    style={{
                        width: '100%',
                        height: '75%',
                    }}
                />
            </Link>
            {
                flag ? (
                    <button onClick={() => {
                        dispatch(setPlay(false))
                        setFlag(false);
                    }}>
                        <FontAwesomeIcon icon={faPause}/>
                    </button>
                ) : (
                    <button onClick={() => {
                        if (song.songName !== currentSong.songName) {
                            dispatch(setSong(song));
                        }
                        dispatch(setPlay(true));
                        dispatch(setPlayBar(true));
                        setFlag(true);
                    }}>
                        <FontAwesomeIcon icon={faPlay}/>
                    </button>
                )
            }
            <h3 style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
            }}
            >
                {title}
            </h3>
            <Stack
                direction='row'
                alignItems='center'
                sx={{
                    fontSize: '12px'
                }}
            >
                <p>{artist}</p>
                <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
                    <FavoriteIcon
                        sx={{
                            fontSize: '12px',
                            marginRight: '4px',
                        }}
                    />
                    <p style={{margin: 0}}>{likes}</p>
                </div>
            </Stack>
        </div>
    )
}
