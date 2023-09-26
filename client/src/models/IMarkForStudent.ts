export interface IMarkForStudent {
    mark: string,
    classId: number,
    date: string,
    two_our_class: {
        name: string
    }
}

export interface IMarkForStudentResponse {
    classId: number,
    name: string,
    marks: [
        {
            mark: string,
            date: string
        },
        {
            mark: string,
            date: string
        }
    ],
    avgMark: string
}