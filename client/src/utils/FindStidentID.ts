import {IBDMarks} from "../models/IBDMarks";

export function FindStudentID(marks: IBDMarks, record: string) {
    let res = 0;
    marks && marks.studentMarks.groupStudents.map((student) => {
        let nameOfStudent = student.user.second_name + ' ' + student.user.first_name;
        if (nameOfStudent === record) {
            res = student.student_id
        }
    })
    return res

}