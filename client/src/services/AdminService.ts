import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {baseURL} from "./config";
import {RootState} from "../store/store";
import {IScheduleOptions} from "../models/IAdmin";
import {GetUser, IUserOptions} from "../models/IUserOptions";
import {Schedule} from "../models/ISchedule";

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseURL}/api/admin`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).userReducer.tokens?.tokens.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (build) => ({
        getAllOptions: build.query<IScheduleOptions, null>({
            query: () => ({
                url: '/schedule/getOptions',
                method: 'GET',
            }),
        }),
        createSchedule: build.mutation<null, any>({
            query: (scheduleOptions) => ({
                url: '/schedule/create',
                method: 'POST',
                body: {scheduleOptions: scheduleOptions}
            }),
        }),
        getAudiences: build.query<{ id: number, number_audience: number }[], null>({
            query: () => ({
                url: '/audience/get_all',
                method: 'GET'
            }),
        }),
        createUpdateAudience: build.mutation<null, { id?: number, numberAudience: number }>({
            query: (options) => ({
                url: '/audience/create_or_update',
                method: 'POST',
                body: {audienceOptions: options}
            }),
        }),
        deleteAudience: build.mutation<null, string>({
            query: (id) => ({
                url: `/audience/delete?id=${id}`,
                method: 'DELETE',
            }),
        }),
        getGroups: build.mutation<{ id: number, name: string }[], string>({
            query: (str) => ({
                url: `/group/get_all?findWord=${str}`,
                method: 'GET'
            }),
        }),
        createUpdateGroup: build.mutation<null, { id?: number, name: string }>({
            query: (options) => ({
                url: '/group/create_or_update',
                method: 'POST',
                body: {groupOptions: options}
            }),
        }),
        getLessons: build.mutation<{ id: number, name: string }[], string>({
            query: (letter) => ({
                url: `/lesson/get_all?findString=${letter}`,
                method: 'GET'
            }),
        }),
        createUpdateLessons: build.mutation<null, { id?: number, name: string }>({
            query: (options) => ({
                url: '/lesson/create_or_update',
                method: 'POST',
                body: {lessonOptions: options}
            }),
        }),
        deleteGroup: build.mutation<null, string>({
            query: (id) => ({
                url: `/group/delete?id=${id}`,
                method: 'DELETE',
            }),
        }),
        deleteLesson: build.mutation<null, string>({
            query: (id) => ({
                url: `/lesson/delete?id=${id}`,
                method: 'DELETE',
            }),
        }),
        getUserOptions: build.query<IUserOptions, null>({
            query: () => ({
                url: '/user/getOptions',
                method: 'GET',
            }),
        }),
        getAllUsers: build.mutation<{ users: GetUser[] }, { group: string, isTeacher: boolean }>({
            query: (obj) => ({
                url: `/user/getAll?isStudent=${obj.isTeacher}&groupName=${obj.group ? obj.group : ''}`,
                method: 'GET',
            }),
        }),
        createUpdateUser: build.mutation<null, any>({
            query: (options) => ({
                url: '/user/registration',
                method: 'POST',
                body: options
            }),
        }),
        deleteUsers: build.mutation<null, string>({
            query: (id) => ({
                url: `/user/delete?id=${id}`,
                method: 'DELETE',
            }),
        }),
        getAllSchedules: build.query<Schedule[], null>({
            query: () => ({
                url: '/schedule/getAll',
                method: 'GET'
            }),
        }),
        getAllScheduleFilter: build.mutation<Schedule[], string>({
            query: (date) => ({
                url: `/schedule/getAll?${date}`,
                method: 'GET'
            }),
        }),
        deleteSchedule: build.mutation<null, string>({
            query: (id) => ({
                url: `/schedule/delete?id=${id}`,
                method: 'DELETE'
            }),
        }),
        checkDuplicate: build.mutation<boolean, { date: string, teacher: number, audience: number }>({
            query: (id) => ({
                url: `/schedule/isDuplicate?scheduleDates=${id.date}&teacherId=${id.teacher}&audienceId=${id.audience}`,
                method: 'GET'
            }),
        })
    })
})