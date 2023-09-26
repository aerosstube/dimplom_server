import React from 'react';
import {Table} from "antd";
import cl from "../TeacherPlaceForMarks/TeacherPFM.module.css";
import {studentApi} from "../../services/StudentService";
import {ColumnsType} from "antd/es/table";
import {checkMark} from "../../utils/checkMark";
import {checkAvgMark} from "../../utils/checkAvgMark";

const StudentPlaceForMarks = () => {
    const {data: studentMarks} = studentApi.useFetchAllMarksQuery('');
    console.log(studentMarks)

    type AntDesignTableData = {
        key: string;
        classId: number;
        name: string;
        marks: { mark: string; date: string }[];
        avgMark: string;
    };

    const getUniqueDates = (data: AntDesignTableData[]): string[] => {
        const uniqueDates: string[] = [];

        data && data.forEach((item) => {
            item.marks.forEach((mark) => {
                if (!uniqueDates.includes(mark.date)) {
                    uniqueDates.push(mark.date);
                }
            });
        });

        return uniqueDates;
    };

    const generateColumns = (dates: string[]): ColumnsType<AntDesignTableData> => {
        const columns: ColumnsType<AntDesignTableData> = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (value) => {
                    return <p className={cl.lessonsText}>{value}</p>
                }
            },
            {
                title: 'Average Mark',
                dataIndex: 'avgMark',
                key: 'avgMark',
                fixed: 'right',
                className: cl.lastColumn,
                render: (value) => {
                    return <div
                        className={checkAvgMark(value)}>{Number(value).toFixed(1) !== '0.0' ? Number(value).toFixed(1) : '-'}</div>
                }
            },
        ];

        dates && dates.forEach((date) => {
            columns.splice(1, 0, {
                title: date?.split('T')[0],
                dataIndex: date,
                key: date,
                render: (text: string, record: AntDesignTableData) => {
                    const mark = record.marks.find((mark) => mark.date === date);
                    return mark ? <div className={checkMark(mark.mark)}>{mark.mark}</div> : '';
                },
            });
        });

        return columns;
    };

// Пример данных для таблицы

    // @ts-ignore
    const data: any[] = studentMarks && studentMarks.map((mark, index) => ({

        key: index,
        name: mark.name,
        marks: mark.marks,
        avgMark: mark.avgMark,

    }));
    const uniqueDates = getUniqueDates(data);
    const columns = generateColumns(uniqueDates);

    return (
        <div className={cl.tableContain}>
            <Table<AntDesignTableData> columns={columns} dataSource={data} bordered={true} pagination={false}
                                       scroll={{x: 1500}}/>
        </div>
    )
}
export default StudentPlaceForMarks;