import {IUser} from '../../models/IUser';
import {ITokens} from '../../models/IAuth';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import jwtDecode from "jwt-decode";

export interface UserState {
    user: IUser;
    tokens: ITokens;
    isLogged: boolean;
}

const initialState: UserState = {

    user: jwtDecode(localStorage.getItem('token') || '') || {
        userId: 0,
        fullName: '',
        login: '',
        role: '',
        iat: 0,
        exp: 0,
        inviteCode: '',
        isTeacher: false
    },
    tokens: {
        tokens: {
            accessToken: localStorage.getItem('token') || '',
            refreshToken: ''
        }
    },
    isLogged: !!localStorage.getItem('token'),

};

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<UserState>) {
            state.user = action.payload.user;
            state.tokens = action.payload.tokens;
            state.isLogged = action.payload.isLogged;
            localStorage.setItem('token', action.payload.tokens.tokens.accessToken)
        },
        addCode(state, action: PayloadAction<string>) {
            state.user.inviteCode = action.payload;
        },
        removeUser(state) {
            state.user = initialState.user;
            state.tokens = initialState.tokens;
            state.isLogged = initialState.isLogged;
        }
    }
});

export default UserSlice.reducer;
export const {removeUser} = UserSlice.actions;
