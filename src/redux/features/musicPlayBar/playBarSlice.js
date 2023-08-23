import {createSlice} from "@reduxjs/toolkit";

export const playBarSlice = createSlice({
    name: 'playBar',
    initialState: {
        isPlaying: false,
        playingMusic: false
    },
    reducers: {
        setPlayBar: (state, action) => {
            state.isPlaying = action.payload;
        },
        setPlay: (state, action) => {
            state.playingMusic = action.payload
        },
    }
});

export const {setPlayBar, setPlay} = playBarSlice.actions;
export default playBarSlice.reducer;

