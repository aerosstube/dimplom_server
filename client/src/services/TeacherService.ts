import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {baseURL} from "./config";
import {RootState} from "../store/store";
import {IGroups} from "../models/IGroups";
import {ILessons} from "../models/ILessons";
import {IBDMarks} from "../models/IBDMarks";
import {IMarksToBD} from "../models/IMarksToBD";
import {UpdateLessonInfo} from "../models/ITeacher";


export const teacherAPI = createApi({
    reducerPath: 'teacherAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseURL}/api/teacher`,
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).userReducer.tokens?.tokens.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (build) => ({
        fetchGroups: build.query<IGroups[], string>({
            query: () => ({
                url: '/getAllowedGroups',
                method: 'GET',
            }),
        }),
        fetchClasses: build.query<ILessons, string>({
            query: () => ({
                url: '/getAllowedClasses',
                method: 'GET',
            })
        }),
        fetchMarks: build.mutation<IBDMarks, { groupId: string, classId: string }>({
            query: (obj) => ({
                url: '/getStudentsMarks',
                method: 'GET',
                params: {
                    classId: obj.classId,
                    groupId: obj.groupId,
                }
            })
        }),
        updateMarks: build.mutation<any, IMarksToBD>({
            query: (obj: IMarksToBD) => ({
                url: '/updateStudentMark',
                method: 'POST',
                body: obj


            })
        }),
        getTeacherSchedule: build.query<any, string>({
            query: (date: string) => ({
                url: '/schedule/get_teacher_week',
                method: 'GET',
                params: {
                    startOfWeek: date
                }
            })
        }),
        updateLessonInfo: build.mutation<any, UpdateLessonInfo>({
            query: (obj: UpdateLessonInfo) => ({
                url: '/schedule/updateSchedule',
                method: 'POST',
                body: {scheduleInfo: obj}


            })
        })
    })
});