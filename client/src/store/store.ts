import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {authAPI} from '../services/AuthService';
import userReducer from './reducers/UserSlice';
import {lessonApi} from "../services/LessonService";
import {teacherAPI} from "../services/TeacherService";
import {studentApi} from "../services/StudentService";
import {adminApi} from "../services/AdminService";

const rootReducer = combineReducers({
    userReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer,
    [teacherAPI.reducerPath]: teacherAPI.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                authAPI.middleware,
                lessonApi.middleware,
                teacherAPI.middleware,
                studentApi.middleware,
                adminApi.middleware
            )


    });
};


export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']