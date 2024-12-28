import { createSlice } from "@reduxjs/toolkit";

const loadWatchFromLocalStorage = () => {
    try {
        const serializedWatch = localStorage.getItem('Watchlists');
        return serializedWatch ? JSON.parse(serializedWatch) : [];
    } catch (err) {
        console.error('Error loading Watchlist', err);
        return [];
    }
};

const saveWatchtoLocalStorage = (Watchlists) => {
    try {
        const serializedWatch = JSON.stringify(Watchlists);
        localStorage.setItem('Watchlists', serializedWatch);
    } catch (err) {
        console.error('Error saving movie ', err);
    }
};

const initialState = {
    Watchlists: loadWatchFromLocalStorage(),
};

const watchSlice = createSlice({
    name: 'watch',
    initialState,
    reducers: {
        addToWatch: (state, action) => {
            const existingWatch = state.Watchlists.find(movie => movie.id === action.payload.id);
            if (!existingWatch) {
                state.Watchlists.push(action.payload);
                saveWatchtoLocalStorage(state.Watchlists);
            }
        },
        removeFromWatch: (state, action) => {
            state.Watchlists = state.Watchlists.filter(movie => movie.id !== action.payload.id);
            saveWatchtoLocalStorage(state.Watchlists);
        },
    },
});

export const { addToWatch, removeFromWatch } = watchSlice.actions;
export default watchSlice.reducer;
