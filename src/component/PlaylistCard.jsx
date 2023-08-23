import * as React from "react";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import Stack from "@mui/material/Stack";
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function PlaylistCard({playlist, playlistId, likes}) {
    const [flag, setFlag] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const handleViewPlaylist = (playlistId) => {
        navigate(`/playlist/detail/${playlistId}`)
    }

    const formatUploadTime = (uploadTime) => {
        const date = new Date(uploadTime);
        const dateString = date.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: '2-digit'});
        const timeString = date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
        return `${dateString} ${timeString}`;
    }
    return (
        <div className='songCardDiv'>
            <img
                src={playlist?.avatar}
                alt="image"
                onClick={() => {
                    handleViewPlaylist(playlistId)
                }}
                className="scale-img"
            />
            <button
                onClick={() => {
                    setFlag(true)
                }}
            >
                <FontAwesomeIcon icon={faPlay}/>
            </button>
            <h3>{playlist?.playlistName}</h3>
            <Stack
                direction='row'
                sx={{
                    fontSize: '12px'
                }}
            >
                <p>Updated on: {formatUploadTime(playlist?.uploadTime)}</p>
                <p
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: '-10%'
                    }}
                >
                    <FavoriteIcon
                        sx={{
                            fontSize: '12px',
                        }}
                    />
                    &nbsp;{likes}
                </p>
            </Stack>
        </div>
    )
}