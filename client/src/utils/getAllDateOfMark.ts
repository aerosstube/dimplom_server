import {IMarkForStudentResponse} from "../models/IMarkForStudent";

export const getAllDateOfMark = (marks: IMarkForStudentResponse[]) => {
    let arr: any[] = []
    console.log('marks', marks)
    for (let i = 0; i < marks.length; i++) {
        for (let j = 0; j < marks[i].marks.length; j++) {
            if (arr.length > 0) {
                for (let k = 0; k < arr.length; k++) {
                    if (arr[k] !== marks[i].marks[j].date.split('T')[0]) {
                        arr.splice(0, 0, marks[i].marks[j].date.split('T')[0]);
                        console.log('next', marks[i].marks[j].date.split('T')[0]);
                        break
                    } else {
                        console.log('mimo', marks[i].marks[j].date.split('T')[0]);
                        break
                    }
                }
            } else {
                console.log('perviy')
                arr.splice(0, 0, marks[i].marks[j].date.split('T')[0]);
            }
        }
    }
    console.log('arr', arr)
    return 0
}