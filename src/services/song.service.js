import axios from "axios";

class SongService {
    static async getPublicSongs() {
        return await axios.get('http://localhost:8000/song/list/songs');
    }
    static async getRandomSong(songIDs){
        return await axios.post('http://localhost:8000/song/random',songIDs)
    }
    static async searchSongPublic(songname) {
        return await axios.get(`http://localhost:8000/song/search-public?songName=${songname}`);
    }
    static async getSingers(){
        return await axios.get('http://localhost:8000/song/singers')
    }
    static async getComposers(){
        return await axios.get('http://localhost:8000/song/composers')
    }
    static async getTags(){
        return await axios.get('http://localhost:8000/song/tags')
    }
    static async getPublicPlaylist(playlistId){
        return await axios.get(`http://localhost:8000/song/playlist-public/${playlistId}`)
    }
}

export default SongService;