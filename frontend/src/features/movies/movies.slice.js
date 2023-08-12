import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchWrapper } from 'helpers';

function createInitialState() {
    return {
        movies: {},
        selectedMovie: null
    }
}

function createExtraActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/movies`;

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(baseUrl)
        );
    }

    return {
        getAll: getAll(),
    };    
}

function createExtraReducers() {
    function getAll() {
        var { pending, fulfilled, rejected } = extraActions.getAll;
        return {
            [pending]: (state) => {
                state.movies = { loading: true };
            },
            [fulfilled]: (state, action) => {
                state.movies = action.payload;
            },
            [rejected]: (state, action) => {
                state.movies = { error: action.error };
            }
        };
    }

    return {
        ...getAll(),
    };
}

// create slice

const name = 'movies';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ 
    name, 
    initialState, 
    reducers: {
        selectMovie(state, action) {
            return {
                ...state,
                selectedMovie: action.payload
            }
        }
    }, 
    extraReducers });

// exports

export const moviesActions = { ...slice.actions, ...extraActions };
export const moviesReducer = slice.reducer;

