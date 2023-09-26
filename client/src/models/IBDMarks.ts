export interface IBDMarks {
    studentMarks: {
        groupStudents: [
            {
                student_id: number,
                user_id: number,
                user: {
                    first_name: string,
                    second_name: string,
                    middle_name: string
                },
                marks?: [
                    {
                        id: number,
                        mark: string,
                        two_our_class_id: number,
                        date: string
                    }

                ]
                avgMark: string
            }
        ],
    },
    "classes": [
        {
            "start_time": string
        }
    ]
}