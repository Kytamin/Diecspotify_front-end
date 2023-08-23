import MenuAppBar from "./NavBar";
import Footer from "./Footer";
import * as React from "react";
import {styled} from "@mui/system";
import {useEffect, useState} from "react";
import UserService from "../services/user.service";
import {Link, useParams} from "react-router-dom";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardMedia from "@mui/material/CardMedia";
import {setSong} from "../redux/features/songs/songSlice";
import {setPlayBar} from "../redux/features/musicPlayBar/playBarSlice";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {useDispatch,useSelector} from "react-redux";
import SongService from "../services/song.service";
import {useOutletContext} from "react-router-dom";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {CommentPlaylist} from "./CommentPlayList";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import {setPlayList} from "../redux/features/songs/songSlice";
export default function PlaylistDetail() {
    const navigate = useNavigate()
    const userLoginJSON = localStorage.getItem('userLogin');
    const userLogin = JSON.parse(userLoginJSON);
    const search = useOutletContext();
    const dispatch = useDispatch();
    const params = useParams();
    const [data, setData] = useState([]);
    const [isPlay, setIsPlay] = useState(false);
    const [favorite, setFavorite] = React.useState(false);
    let playlistId = useParams().playlistId;
    const userInfo = JSON.parse(localStorage.getItem('userLogin'));
    const [playlistLikeCounts, setPlaylistLikeCounts] = useState([]);
    const [visible, setVisible] = useState(4);
    const song = useSelector(state => state.song.song)
    const currentPlaylist = useSelector(state => state.song.currentPlaylist)
    const isShowingPlaybar = useSelector(state => state.playBar.isPlaying)
    const isPlayingMusic = useSelector(state => state.playBar.playingMusic)
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);
      };
      const handlePlay = () => {
        if(data.playlistName!==currentPlaylist.playlistName){
            dispatch(setPlayList({
                playlistName: data.playlistName,
                songs: data.songs
            }))
            dispatch(setSong(data.songs[0]))
        }
        dispatch(setPlayBar(true))
        setIsPlay(true)
    }
    const handlePause = () => {
        setIsPlay(false)
    }

    useEffect(() => {
        SongService.getPublicPlaylist(params.playlistId)
            .then(res => {
                setData(res.data.playlist)
                setPlaylistLikeCounts(res.data.playlist?.playlistLikeCounts);
                const userLikes = res.data.playlist?.playlistLikeCounts.some(like => like.user === userInfo?._id);
                setFavorite(userLikes);
            })
            .catch(e => {
                console.log(e)
            });
    }, [params.playlistId, userInfo?._id, favorite]);

    const handleFavoriteClick = async () => {
        try {
            if(userLogin){
                !favorite
                ? await UserService.submitLikePlaylist(playlistId)
                : await UserService.submitDislikePlaylist(playlistId);

            setFavorite(!favorite);
            }else{
                navigate('/login')
            }
            
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Root>
            <MenuAppBar search={search}/>
            <Card
                sx={{
                    backgroundColor: 'black'
                }}
            >
                <Stack direction={'row'}>
                    <CardMedia
                        component="img"
                        height="194"
                        image={data?.avatar}
                        alt="Paella dish"
                        sx={{
                            width: '192px',
                            height: '192px'
                        }}
                    />
                    <CardContent style={{flexGrow: '1'}}>
                        <Typography
                            variant="body2"
                            style={{
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                            }}>
                            Playlist
                        </Typography>
                        <Typography
                            variant="body2"
                            style={
                                data?.playlistName?.length > 21 ?
                                    {
                                        color: 'white',
                                        fontSize: '4rem',
                                        fontWeight: '900',
                                    } :
                                    {
                                        color: 'white',
                                        fontSize: '5rem',
                                        fontWeight: '900',
                                    }
                            }
                        >
                            {data?.playlistName}
                        </Typography>
                        <Typography
                            variant="body2"
                            style={{
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                            <img
                                src={data?.uploader?.avatar}
                                alt="error"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '100%'
                                }}
                            />
                            &nbsp;{data?.uploader?.lastName + " " + data?.uploader?.firstName} &bull; {data?.songs?.length} songs
                        </Typography>
                    </CardContent>
                </Stack>
                <CardActions disableSpacing>
                    {
                        isPlay ?
                            (
                                <IconButton
                                    aria-label="pause"
                                    onClick={handlePause}
                                >
                                    <PauseCircleIcon
                                        fontSize='large'
                                        sx={{
                                            color: '#1ed760',
                                            fontSize: 60,
                                        }}
                                    />
                                </IconButton>
                            ) :
                            (
                                <IconButton
                                    aria-label="play"
                                    onClick={handlePlay}
                                >
                                    <PlayCircleIcon
                                        fontSize='large'
                                        sx={{
                                            color: '#1ed760',
                                            fontSize: 60,
                                        }}
                                    />
                                </IconButton>
                            )
                    }
                    <IconButton aria-label="add to favorites" onClick={handleFavoriteClick}>
                        {
                            favorite ?
                                (
                                    <FavoriteIcon
                                        fontSize='large'
                                        sx={{
                                            color: '#1ed760'
                                        }}
                                    />
                                ) :
                                (
                                    <FavoriteBorderIcon
                                        fontSize='large'
                                        sx={{
                                            color: '#1ed760',
                                        }}
                                    />
                                )
                        }
                    </IconButton>
                    <p
                        style={{
                            color: 'white'
                        }}
                    >
                        {playlistLikeCounts?.length} likes
                    </p>
                </CardActions>
            </Card>

            <table aria-label="custom pagination table">
                <thead>
                <tr>
                    <th>Song</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>

                </tr>
                </thead>
                <tbody>
                {data?.songs?.slice(0,visible).map(song => (
                    <tr key={song._id}>
                        <td colSpan={6} style={{backgroundColor: 'grey'}}>
                            <Card
                                sx={{
                                    backgroundColor: 'black'
                                }}
                            >
                                <Stack direction={'row'}>
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image={song?.avatar}
                                        alt="Paella dish"
                                        onClick={() => {
                                            dispatch(setSong(song));
                                            dispatch(setPlayBar(true));
                                        }}
                                        sx={{
                                            width: '100px',
                                            height: '100px',
                                            cursor: "pointer",
                                        }}
                                    />
                                    <CardContent
                                        sx={{
                                            flexGrow: '1',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                        }}
                                    >
                                        <Stack direction={'column'}>
                                            <Typography
                                                variant="body2"
                                                style={{
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                }}>
                                                <Link to={`/song/detail/${song._id}`}>
                                                    {song.songName}
                                                </Link>
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                style={{
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: '400',
                                                }}>
                                                {new Date(song.uploadTime).toLocaleDateString()}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <IconButton aria-label="add to favorites">
                                            <FavoriteBorderIcon
                                                fontSize='large'
                                                sx={{
                                                    color: '#1ed760',
                                                }}
                                            />
                                        </IconButton>
                                    </CardActions>
                                </Stack>
                            </Card>
                        </td>
                    </tr>
                ))}
                <div>
                <Button style={{backgroundColor:"green"}} variant="contained" disableElevation onClick={showMoreItems}>
                    Load More
                 </Button>
                </div>
                </tbody>
            </table>
            <br/>
            <CommentPlaylist/>
            <Footer/>
        </Root>
    );
}

const rootSx = {
    marginLeft: "20.5%",
    marginBottom: "155px",
    marginRight: "1%",
    color: "#fff",
    padding: "75px 20px 20px 20px",
    background: "black",
    borderRadius: "10px",
};

const Root = styled('div')(
    ({theme}) => `
        table {
            font-family: IBM Plex Sans, sans-serif;
            font-size: 0.875rem;
            border-collapse: collapse;
            width: 100%;
        }

        td,
        th {
            text-align: left;
            padding: 8px;
        }

        th {
            background-color: ${theme.palette.mode === 'dark' ? grey[900] : 'black'};
        }
    `,
    rootSx
);

const grey = {
    200: '#d0d7de',
    800: '#32383f',
    900: '#24292f',
};