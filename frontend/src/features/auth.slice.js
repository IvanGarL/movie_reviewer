import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { history, fetchWrapper } from '_helpers';

function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        error: null
    }
}

function createReducers() {
    // TODO: check if this is the best way to handle logout
    function logout(state) {
        state.user = null;
        localStorage.removeItem('user');
        history.navigate('/login');
    }

    return {
        logout
    };
}

function createExtraActions() {

    const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

    function login() {
        return createAsyncThunk(
            `${name}/login`,
            async ({ email, password }) => await fetchWrapper.post(`${baseUrl}/logIn`, { email, password })
        );
    }

    return {
        login: login()
    };    
}

function createExtraReducers() {

    function login() {
        var { pending, fulfilled, rejected } = extraActions.login;
        return {
            [pending]: (state) => {
                state.error = null;
            },
            [fulfilled]: (state, action) => {
                const user = action.payload;
                
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                state.user = user;

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/' } };
                history.navigate(from);
            },
            [rejected]: (state, action) => {
                state.error = action.error;
            }
        };
    }

    return {
        ...login()
    };
}

// create slice

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;
