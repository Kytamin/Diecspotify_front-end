import {createSlice} from "@reduxjs/toolkit";

export const songSlice = createSlice({
    name: 'song',
    initialState: {
        song: {},
        currentPlaylist: {
            playlistName: 'default-playlist-name-budget-spotify',
            songs: []
        }
    },
    reducers: {
        setSong: (state, action) => {
            state.song = {...action.payload}
        },
        setPlayList: (state, action) =>{
            state.currentPlaylist = {...action.payload}
        },
        addSongIntoPlayList: (state, action) =>{
            state.currentPlaylist.songs.push(action.payload)
        }
    }
})

export const {setSong, setPlayList, addSongIntoPlayList} = songSlice.actions;
export default songSlice.reducer;