import * as React from 'react';
import {styled} from '@mui/system';
import TablePagination, {
    tablePaginationClasses as classes,
} from '@mui/base/TablePagination';
import {Link} from "react-router-dom";
import MenuAppBar from "./NavBar";
import UserAddSong from "./UserAddSong";
import {useEffect, useState} from "react";
import UserService from "../services/user.service";
import Footer from "./Footer";
import {useDispatch} from "react-redux";
import {setSong} from "../redux/features/songs/songSlice";
import IconButton from "@mui/material/IconButton";
import DeleteModal from "./DeleteSong";
import {setPlayBar} from "../redux/features/musicPlayBar/playBarSlice";
import Stack from "@mui/material/Stack";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Card from "@mui/material/Card";
import PublicState from "./PublicState";
import { useOutletContext } from 'react-router-dom';
import UserEditSong from './UserEditSong'

export default function SongUploaded() {
    const search = useOutletContext();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [songs, setSongs] = useState([]);
    const dispatch = useDispatch();
    const [songsListChange, setSongsListChange] = useState(null);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - songs.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("token");
        UserService.getSongs(accessToken)
            .then(res => {
                setSongs(res.data.songs);
            })
            .catch(err => {
                console.log(err)
            })
    }, [songsListChange]);

    return (
        <Root
            sx={{
                marginLeft: "20.5%",
                marginBottom: "155px",
                marginRight: "1%",
                color: "#fff",
                padding: "75px 20px 20px 20px",
                background: "black",
                borderRadius: "10px",
            }}
        >
            <MenuAppBar search={search}/>
            <h2 className="text-2xl font-semibold">Songs Uploaded</h2>
            <br/>
            <UserAddSong reload={setSongsListChange}/>
            <table aria-label="custom pagination table">
                <thead>
                <tr>
                    <th>Song</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {(rowsPerPage > 0
                        ? songs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : songs
                ).map(song => (
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
                                        image={song.avatar}
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
                                                    {song.songName.length > 20 ? `${song.songName.substring(0, 20)}...` : song.songName}
                                                </Link>
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                style={{
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: '400',
                                                }}>
                                                {song.singers[0] ? song.singers[0].name : 'Unknown Singer'}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                    <CardContent
                                        style={{
                                            paddingRight: '142.5px',
                                            paddingTop: '25px',
                                        }}
                                    >
                                        <PublicState song={song}/>
                                    </CardContent>
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            style={{
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                paddingRight: '142.5px',
                                                paddingTop: '25px',
                                            }}>
                                            Time
                                        </Typography>
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
                                        <UserEditSong songID={song._id} reload={setSongsListChange}/>
                                        <DeleteModal song={song} reload={setSongsListChange}/>
                                    </CardActions>
                                </Stack>
                            </Card>
                        </td>
                    </tr>
                ))}
                {emptyRows > 0 && (
                    <tr style={{height: 41 * emptyRows}}>
                        <td colSpan={6}/>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr>
                    <CustomTablePagination
                        rowsPerPageOptions={[5, 10, 15, {label: 'All', value: -1}]}
                        colSpan={6}
                        count={songs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        slotProps={{
                            select: {
                                'aria-label': 'rows per page',
                            },
                            actions: {
                                showFirstButton: true,
                                showLastButton: true,
                            },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </tr>
                </tfoot>
            </table>
            <Footer/>
        </Root>
    );
}

const grey = {
    200: '#d0d7de',
    800: '#32383f',
    900: '#24292f',
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
  
  td img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
  `,
);

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.select} {
    background-color: black;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;