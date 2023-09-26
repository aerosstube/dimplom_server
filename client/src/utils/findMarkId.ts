import {IBDMarks} from "../models/IBDMarks";

export function findMarkId(marks: IBDMarks | undefined, date: string, studentId: number | undefined) {
    let res = 0;
    marks && marks.studentMarks.groupStudents.map((student) => {
        if (student.marks && student.student_id === studentId) {
            for (const mark of student.marks) {
                if (date === mark.date) {
                    res = mark.id;
                }
            }
        }
    })
    return res
}