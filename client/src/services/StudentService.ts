import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {baseURL} from "./config";
import {RootState} from "../store/store";
import {IMarkForStudentResponse} from "../models/IMarkForStudent";
import {IMisses} from "../models/IMisses";

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseURL}/api/student`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).userReducer.tokens?.tokens.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (build) => ({
        fetchAllMarks: build.query<IMarkForStudentResponse[], string>({
            query: () => ({
                url: '/getAllMarks',
                method: 'GET',
            }),
        }),
        getMyMisses: build.query<IMisses, null>({
            query: () => ({
                url: '/getAllMisses',
                method: 'GET',
            }),
        })
    })
})