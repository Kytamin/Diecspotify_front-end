import React, { useEffect, useState } from "react";
import SongCard from "./SongCard";
import Footer from "./Footer";
import MenuAppBar from "./NavBar";
import SongService from "../services/song.service";
import { useOutletContext } from "react-router-dom";
import AlbumCard from "./PlaylistCard";

export default function PlaylistOnly() {
    const search = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [playlists, setPlaylists] = useState([])
  

    useEffect(() => {
        setIsLoading(true);
        SongService.searchSongPublic(search)
            .then((res) => {
                setPlaylists(res.data.playlists)
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
            <br />
            <br />
            {isLoading ? (
                <h2 style={{ textAlign: "center", margin: "150px", color: "#1DB954" }}>
                    Loading...
                </h2>
            ) : (
                <>
                    <div>
                        <h1>Album</h1>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5,1fr)",
                                marginTop: "40px",
                                gap: "30px 20px",
                            }}
                        >
                            {playlists && playlists.slice(0, 10).map((playlist, index) => (
                                <>
                                    <AlbumCard
                                        playlist={playlist}
                                        playlistId={playlist._id}
                                    />
                                </>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
}