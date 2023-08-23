import React, { useEffect, useState } from "react";
import SongCard from "./SongCard";
import Footer from "./Footer";
import MenuAppBar from "./NavBar";
import SongService from "../services/song.service";
import { useOutletContext } from "react-router-dom";


export default function SongOnly() {
    const search = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [listPublicSongs, setListPublicSongs] = useState([]);


    useEffect(() => {
        setIsLoading(true);
        SongService.searchSongPublic(search)
            .then((res) => {
                setListPublicSongs(res.data.songs);
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
            <MenuAppBar search={search} />
            <br />
            <br />
            {isLoading ? (
                <h2 style={{ textAlign: "center", margin: "150px", color: "#1DB954" }}>
                    Loading...
                </h2>
            ) : (
                <>
                    <div>
                        <h1>Best of music</h1>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5,1fr)",
                                marginTop: "40px",
                                gap: "30px 20px",
                            }}
                        >
                            {listPublicSongs && listPublicSongs.slice(0, 10).map((song, index) => (
                                <>
                                    <SongCard
                                        songUrl={song.fileURL}
                                        image={song.avatar}
                                        title={song.songName}
                                        artist={song.singers[0] ? song.singers[0].name : 'Unknown Singer'}
                                        key={index}
                                        song={song}
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