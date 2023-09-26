import {IBDMarks} from "../models/IBDMarks";
import {fixArrayOfMarks} from "./FixArrayOfMarks";

export function convertTableData(data?: IBDMarks) {
    const tableData: any = [];
    let arr1: any = [];
    data && data.studentMarks.groupStudents.map((student, index) => {
        let obj = {
            key: index,
            name: student.user.second_name + ' ' + student.user.first_name,
            avgMark: student.avgMark
        }
        for (let i = 0; i < data.classes.length; i++) {
            if (student.marks) {
                if (student.marks[0] !== undefined) {
                    for (let j = 0; j < student.marks.length; j++) {
                        if (student.marks[j].date === data.classes[i].start_time) {
                            arr1.push(student.marks[j].mark + i.toString())

                        }


                    }

                }
            }
            arr1.push('-' + i.toString())

        }
            arr1 = fixArrayOfMarks(arr1);
            let obj1 = Object.assign({}, arr1);
            let obj3 = Object.assign({}, obj, obj1)

            tableData.push(obj3)
            arr1 = [];
        })
    return tableData
}