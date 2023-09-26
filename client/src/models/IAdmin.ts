export interface IScheduleOptions {
    scheduleOptions: {
        groups: {
            id: number,
            name
                :
                string
        }[],
        classes
            :
            {
                id: number,
                name
                    :
                    string
            }[],
        teachers: ITeacherOptions[],
        audiences
            :
            {
                id: number,
                number_audience
                    :
                    number
            }[],
        weekdays
            :
            {
                id: number,
                name
                    :
                    string
            }[]
    }
}

export interface CreateSchedule {
    startTime: string,
    groupId: number,
    weekdayId: number,
    audienceId: number,
    classId: number,
    teacherId: number,
    dateOfClass: string,
    numberOfSchedule: number
}

export interface ITeacherOptions {
    id: number,
    user: {
        id: number,
        first_name: string,
        second_name: string,
        middle_name: string
    }
}
