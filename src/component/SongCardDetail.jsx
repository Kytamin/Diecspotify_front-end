import * as React from 'react';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import MenuAppBar from "./NavBar";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import {useEffect} from "react";
import UserService from "../services/user.service";
import {useParams} from "react-router-dom";
import Footer from "./Footer";
import {useDispatch, useSelector} from "react-redux";
import {setSong as setCurrentSong} from "../redux/features/songs/songSlice";
import {setPlay, setPlayBar} from "../redux/features/musicPlayBar/playBarSlice";
import {TextareaComment} from "./CommentBox";
import {useOutletContext} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function SongCardDetail() {
    const navigate = useNavigate()
    const search = useOutletContext();
    const [expanded, setExpanded] = React.useState(false);
    const [favorite, setFavorite] = React.useState(false);
    const [isPlay, setIsPlay] = React.useState(false);
    const [song, setSong] = React.useState({});
    const dispatch = useDispatch();
    const currentSong = useSelector(state => state.song.song);
    const playingMusic = useSelector(state => state.playBar.playingMusic);
    let songId = useParams();
    const userInfo = JSON.parse(localStorage.getItem('userLogin'));
    const [songLikeCounts, setSongLikeCounts] = React.useState([]);
    const userLoginJSON = localStorage.getItem('userLogin');
    const userLogin = JSON.parse(userLoginJSON);


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleFavoriteClick = async () => {
        try {
            if(userLogin){
                !favorite
                ? await UserService.submitLikeOfSong(songId.id)
                : await UserService.submitDislikeOfSong(songId.id);

            setFavorite(!favorite);
            }else{
                navigate('/login')
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (songId.id) {
            UserService.getOneSong(songId.id)
                .then(res => {
                    setSong(res.data.song);
                    setSongLikeCounts(res.data.song.songLikeCounts);
                    const userLikes = res.data.song.songLikeCounts.some(like => like.user === userInfo?._id);
                    setFavorite(userLikes);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [songId.id, userInfo?._id, favorite]);

    useEffect(()=>{
        if(song.songName===currentSong.songName) setIsPlay(playingMusic)
    },[song])

    useEffect(() => {
        if (song.songName !== currentSong.songName) setIsPlay(false)
        else setIsPlay(playingMusic);
    }, [currentSong]);

    useEffect(() => {
        if (song.songName === currentSong.songName) setIsPlay(playingMusic);
    }, [playingMusic])

    const customTheme = createTheme({
        typography: {
            fontFamily: 'Times New Roman, serif',
        },
    });

    return (
        <ThemeProvider theme={customTheme}>
            <div
                style={{
                    marginLeft: "20.5%",
                    marginBottom: "155px",
                    marginRight: "1%",
                    color: "#fff",
                    padding: "30px 20px 20px 20px",
                    background: "black",
                    borderRadius: "10px",
                }}
            >
                <MenuAppBar search={search}/>
                <br/>
                <br/>
                <Card
                    sx={{
                        backgroundColor: 'black'
                    }}
                >
                    <Stack direction={'row'}>
                        <CardMedia
                            component="img"
                            height="194"
                            image={song.avatar}
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
                                Song
                            </Typography>
                            <Typography
                                variant="body2"
                                style={
                                    song.songName && song.songName.length > 21 ?
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
                                {song.songName}
                            </Typography>
                            <Typography
                                variant="body2"
                                style={{
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                }}>
                                {song.singers && song.singers[0] ? song.singers[0].name : 'Unknown Singer'}
                            </Typography>
                        </CardContent>
                    </Stack>
                    <CardActions disableSpacing>
                        {
                            isPlay ?
                                (
                                    <IconButton
                                        aria-label="pause"
                                        onClick={() => {
                                            dispatch(setPlay(false));
                                            setIsPlay(false);
                                        }}
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
                                        onClick={() => {
                                            if (song.songName !== currentSong.songName) {
                                                dispatch(setCurrentSong(song));
                                            }
                                            dispatch(setPlay(true));
                                            dispatch(setPlayBar(true));
                                            setIsPlay(true);
                                        }}
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
                            {songLikeCounts?.length} likes
                        </p>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon
                                sx={{
                                    color: '#1ed760'
                                }}
                            />
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent style={{color: 'white'}}>
                            <Typography paragraph>Lyrics:</Typography>
                            <Typography paragraph>
                                {song.description}
                            </Typography>
                        </CardContent>
                    </Collapse>
                    <TextareaComment/>
                </Card>
                <Footer/>
            </div>
        </ThemeProvider>
    );
}