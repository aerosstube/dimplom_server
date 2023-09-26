import React, {useEffect, useState} from 'react';
import {Select, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import cl from './TeacherPFM.module.css'
import {useLocation} from "react-router-dom";
import {teacherAPI} from "../../services/TeacherService";
import {convertColumnData} from "../../utils/ConvertColumnData";
import {convertTableData} from "../../utils/ConvertTableData";
import TableCell from "../TableCell/TableCell";
import {FindStudentID} from "../../utils/FindStidentID";

const TeacherPlaceForMarks = () => {
    const location = useLocation();
    const {data: lessons} = teacherAPI.useFetchClassesQuery(location.state.groupID.toString());
    console.log(lessons && lessons.classes[0].id, 'hello')
    const [fetchMarks, {data: marks}] = teacherAPI.useFetchMarksMutation();
    const [selectValue, setSelectValue] = useState(lessons && lessons.classes[0].id || 1)
    // @ts-ignore
    const columns: ColumnsType<DataType> = convertColumnData(marks, false);
    const columnsRenderMark = {
        render: (text: string, record: any) => {
            // @ts-ignore
            const studentID = FindStudentID(marks, record.name)
            return <TableCell
                text={(text + ',' + record.name).toString()}
                studentID={studentID}
                // @ts-ignore
                dates={marks.classes}
                classID={selectValue}
                marks={marks}
            />
        }
    }
    console.log(selectValue, 'select')
    useEffect(() => {
        if (lessons)
            setSelectValue(lessons.classes[0].id)
    }, [lessons])
    const checkLessonId = () => {
        if (lessons)
            for (let i = 0; i < lessons?.classes.length; i++) {
                if (lessons?.classes[i].id === selectValue) {
                    return lessons?.classes[i].name
                }
            }
    }
    const arg = {
        groupId: location.state.groupID.toString(),
        classId: selectValue.toString()
    };
    useEffect(() => {
        fetchMarks(arg)
    }, [selectValue])
    const finalColumns: any = [];
    for (let i = 0; i < columns.length; i++) {
        if (i !== 0 && i !== columns.length - 1) {
            // @ts-ignore
            finalColumns[i] = Object.assign({}, columns[i], columnsRenderMark)
        } else {
            finalColumns[i] = columns[i];
        }
    }

    const data: any[] = convertTableData(marks)

    return (
        <>
            <Select
                size={"large"}
                value={selectValue}
                style={{
                    marginLeft: 'auto',
                    marginRight: '0px',
                    minWidth: '150px',
                    border: '3px solid #0095FFDB',
                    borderRadius: '10px'
                }}
                options={lessons?.classes.map((lesson) => ({
                        value: lesson.id,
                        label: lesson.name
                    })
                )}
                onChange={(e) =>
                    setSelectValue(e)
                }
            />
            <div className={cl.tableContain}>
                <p className={cl.tableText}>Группа {location.state.name}, {checkLessonId()} </p>
                <Table columns={finalColumns} className={cl.table} dataSource={data} pagination={false}
                       scroll={{x: 1500}} bordered={true}/>
            </div>
        </>
    );
};

export default TeacherPlaceForMarks;