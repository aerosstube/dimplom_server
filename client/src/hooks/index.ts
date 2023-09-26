import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {authAPI} from "../services/AuthService";
import {useEffect} from "react";
import {UserSlice, UserState} from "../store/reducers/UserSlice";
import jwt from "jwt-decode";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useRefreshUser() {
    const {data: tokens, isLoading, error} = authAPI.useRefreshQuery('');
    const {addUser} = UserSlice.actions;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (tokens) {
            const response: UserState = {
                user: jwt(tokens.tokens.accessToken),
                tokens,
                isLogged: true
            };
            dispatch(addUser(response));
        }
    },[tokens]);

    useEffect(() => {
         if (error) {
            console.log(error);
        }
    }, [error]);

    return isLoading;
}