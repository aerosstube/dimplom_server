import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import {Schedule, ScheduleDay} from '../models/ISchedule';
import {RootState} from "../store/store";
import {baseURL} from "./config";


export const lessonApi = createApi({
    reducerPath: 'lessonApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseURL}/api/schedule`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).userReducer.tokens?.tokens.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (build) => ({
        fetchLessons: build.query<ScheduleDay[], string>({
            query: (startOfWeek) => ({
                url: '/get_week',
                method: 'GET',
                params: {
                    startOfWeek
                }
            })
        }),
        fetchMarks: build.query<ScheduleDay[], string>({
            query: (startOfWeek) => ({
                url: '/get_week_marks',
                method: 'GET',
                params: {
                    startOfWeek
                }

            }),
        }),
        fetchCurrentLesson: build.query<Schedule, string | undefined>({
            query: (id) => ({
                url: `/get_schedule/${id}`,
                method: 'GET',
            }),
        }),
        downloadFile: build.mutation<any, string>({
            query: (path: string) => ({
                url: `/downloadFile`,
                method: 'GET',
                params: {
                    filePath: path
                }
            }),
        })
    })
});