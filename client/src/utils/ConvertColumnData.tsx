import {IBDMarks} from "../models/IBDMarks";
import {IColumnData} from "../models/IColumnData";
import {ColumnsType} from "antd/es/table";
import {checkAvgMark} from "./checkAvgMark";
import React from "react";
import cl from "../../src/components/TeacherPlaceForMarks/TeacherPFM.module.css";
import {changeNumberDayToWeekDay} from "../components/StudentPlaceForMarks/StudentPlaceForMarks";

export const convertColumnData = (data: IBDMarks, toBD: boolean) => {
    const columnData: ColumnsType<IColumnData> = [{
        title: 'ФИО СТУДЕНТА',
        dataIndex: 'name',
        key: 'name',
    }];

    if (toBD) {
        console.log('ZAGLUSHKA')
    } else {
        data && data.classes.map((dClass, index) => {
            let year = dClass.start_time.split('-')[0];
            let month = dClass.start_time.split('-')[1];
            let day = dClass.start_time.split('-')[2].split('T')[0];
            let obj = {
                title: day + '.' + month + '.' + year + '(' + changeNumberDayToWeekDay(new Date(dClass.start_time).getDay()) + ')',
                dataIndex: +index,
                key: dClass.start_time,
            }
            columnData.push(obj);
        })
    }
    columnData.push({
        title: 'Средняя оценка',
        dataIndex: 'avgMark',
        key: 'avgMark',
        className: cl.lastColumn,
        fixed: 'right',
        render: (value: string) => {
            return <div className={checkAvgMark((value ? value : '-'))}>{Number(value) ? Number(value) : '-'}</div>
        }
    })
    return columnData;
}
