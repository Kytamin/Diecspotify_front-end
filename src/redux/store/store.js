import {configureStore} from "@reduxjs/toolkit";
import songReducer from '../features/songs/songSlice'
import playBarReducer from "../features/musicPlayBar/playBarSlice";

export const store = configureStore({
    reducer: {
        song: songReducer,
        playBar: playBarReducer
    }
})