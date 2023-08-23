import React, {useEffect, useState} from "react";
import SongCard from "./SongCard";
import Footer from "./Footer";
import MenuAppBar from "./NavBar";
import SongService from "../services/song.service";
import {useOutletContext} from "react-router-dom";
import PlaylistCard from "./PlaylistCard";

export default function Songspage() {
    const search = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [listPublicSongs, setListPublicSongs] = useState([]);
    const [playlists, setPlaylists] = useState([])
    const [singers, setSinger] = useState([])

    useEffect(() => {
        setIsLoading(true);
        SongService.searchSongPublic(search)
            .then((res) => {
                setListPublicSongs(res.data.songs);
                setPlaylists(res.data.playlists)
                setSinger(res.data.singers)
                setIsLoading(false);

            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            })
    }, [search]);

    return (
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
            {isLoading ? (
                <h2 style={{textAlign: "center", margin: "150px", color: "#1DB954"}}>
                    Loading...
                </h2>
            ) : (
                <>
                    <div>
                        <p
                            style={{
                                fontSize: '30px',
                                fontWeight: 500
                            }}
                        >
                            Best of music
                        </p>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5,1fr)",
                                marginTop: "40px",
                                gap: "30px 20px",
                            }}
                        >
                            {listPublicSongs && listPublicSongs.slice(0, 10).map((song, index) => (
                                <SongCard
                                    songUrl={song.fileURL}
                                    image={song.avatar}
                                    title={song.songName}
                                    artist={song.singers[0] ? song.singers[0].name : 'Unknown Singer'}
                                    key={index}
                                    song={song}
                                    likes={song.songLikeCounts?.length}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <br/>
                        <br/>
                        <br/>
                        <p
                            style={{
                                fontSize: '30px',
                                fontWeight: 500
                            }}
                        >
                            Album
                        </p>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5,1fr)",
                                marginTop: "40px",
                                gap: "30px 20px",
                            }}
                        >
                            {playlists && playlists.slice(0, 10).map((playlist, index) => (
                                <PlaylistCard
                                    key={index}
                                    playlist={playlist}
                                    playlistId={playlist._id}
                                    likes={playlist.playlistLikeCounts?.length}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Footer/>
        </div>
    );
}