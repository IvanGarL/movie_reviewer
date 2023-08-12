import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from 'helpers';

function createInitialState() {
    return {
        userInfo: {}
    }
}

function createExtraActions() {
    const baseUrl = process.env.REACT_APP_API_URL;  

    function getUserInfo() {

        return createAsyncThunk(
            `${name}/getUserInfo`,
            async (username) => {
                console.log("username: ", username);
                return await fetchWrapper.get(`${baseUrl}/users/${username}/reviews`)
            }
        );
    }

    return {
        getUserInfo: getUserInfo()
    };  
}

function createExtraReducers() {

    function getUserInfo() {
        var { pending, fulfilled, rejected } = extraActions.getUserInfo;
        return {
            [pending]: (state) => {
                state.userInfo = { loading: true };
            },
            [fulfilled]: (state, action) => {
                state.userInfo = action.payload;
            },
            [rejected]: (state, action) => {
                state.userInfo = { error: action.error };
            }
        };
    }

    return {
        ...getUserInfo()
    };
}

// create slice

const name = 'users';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;
