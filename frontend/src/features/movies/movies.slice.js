import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { history, fetchWrapper } from 'helpers';

function createInitialState() {
    return {
        movies: {},
        selectedMovie: null,
        movieReviews: {},
    }
}

function createExtraActions() {
    const baseUrl = process.env.REACT_APP_API_URL;

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(`${baseUrl}/movies`)
        );
    }

    function reviewMovie() {
        return createAsyncThunk(
            `${name}/reviewMovie`,
            async ({ tmdbId, userName, rating, comment }) => await fetchWrapper.post(`${baseUrl}/reviews`, { tmdbId, userName, rating, comment })
        );
    }

    return {
        getAll: getAll(),
        reviewMovie: reviewMovie(),
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

    function reviewMovie() {
        var { pending, fulfilled, rejected } = extraActions.reviewMovie;
        return {
            [pending]: (state) => {
                state.movieReviews = { loading: true };
            },
            [fulfilled]: (state, action) => {
                state.movieReviews = action.payload;
                const {tmdbId} = state.selectedMovie;
                history.navigate(`/${tmdbId}/reviews`);
            },
            [rejected]: (state, action) => {
                state.movieReviews = { error: action.error };
            }
        };
    }

    return {
        ...getAll(),
        ...reviewMovie(),
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

