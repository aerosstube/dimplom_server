import React, {useEffect, useState} from 'react';
import {adminApi} from "../../../services/AdminService";
import {Button, DatePicker, DatePickerProps, Input, Spin, Table, TimePicker} from "antd";
import cl from '../CreateAudienceAdminPage/AdminAudience.module.css'
import Column from "antd/es/table/Column";
import {Select} from "antd/lib";
import dayjs from "dayjs";
import {delay} from "../CreateAudienceAdminPage/AudiencePage";
import {changeNameToID, changeNumberToID, changeTeacherToID} from "../CreateUserAdmin/CreateAdminUser";
import {CreateSchedule} from "../../../models/IAdmin";


export const getStartDay = (date: Date) => {
    const resDate = dayjs(date).startOf('day');
    return resDate.toISOString()

}
export const getformattedSecAndMin = (str: string) => {
    if (str.split('').length > 1) {
        return str
    } else {
        return '0' + str
    }
}
export const changeIdToWeekday = (array: any[], id: number) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === id) return array[i].name
    }
    return 'Понедельник'
}
const CreateAdminSchedule = () => {
    const {data: allSchedules, refetch: refetchAll, isLoading} = adminApi.useGetAllSchedulesQuery(null);
    const {data: allOptions} = adminApi.useGetAllOptionsQuery(null);
    const [deleteSchedule] = adminApi.useDeleteScheduleMutation();
    const [getFilteredSchedules, {data: allFilteredSchedules}] = adminApi.useGetAllScheduleFilterMutation();
    const [getCurrentSubjects, {data: currentSubjects}] = adminApi.useGetCurrentSubjectsForTeacherMutation();
    const [getCurrentTeacher, {data: currentTeacher}] = adminApi.useGetCurrentTeachersMutation();
    const [createSchedule] = adminApi.useCreateScheduleMutation();
    const [sendArray, setSendArray] = useState<any[]>([])
    const [visible, setVisible] = useState(false);
    const [deleteArray, setDeleteArray] = useState<any>([]);
    const [dateFilter, setDateFilter] = useState(dayjs(new Date()));
    const [selectFilter, setSelectFilter] = useState(1);
    const [dateBetween, setDateBetween] = useState<any>([]);
    const [arrayVisble, setArrayVisible] = useState(false);
    const [groupValue, setGroupValue] = useState(0);
    const [lessonValue, setLessonValue] = useState(0);
    const [changer, setChanger] = useState(false)
    const {RangePicker} = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    useEffect(() => {
        if (groupValue || lessonValue)
            getCurrentTeacher({group: groupValue, lesson: lessonValue})
    }, [groupValue, lessonValue])
    useEffect(() => {
        if (allOptions) {
            if (allSchedules && !allFilteredSchedules) {
                setSendArray([...allSchedules.map((schedule) => (
                    {
                        key: schedule.id,
                        group: schedule.groupName,
                        class: schedule.twoOurClassName,
                        teacher: schedule.teacher.split(' ')[0] + ' ' + schedule.teacher.split(' ')[1].split('')[0] + '. ' + schedule.teacher.split(' ')[2].split('')[0] + '.',
                        audience: changeNumberToID(allOptions && allOptions.scheduleOptions.audiences, schedule.audience),
                        weekday: schedule.weekday,
                        date: schedule.dateOfClass,
                        numberOfSchedule: schedule.numberOfSchedule ? schedule.numberOfSchedule : 0,
                        startTime: new Date(schedule.startTime)
                    }))])
            }
            if (allFilteredSchedules) {
                setSendArray([...allFilteredSchedules.map((schedule) => ({
                    key: schedule.id,
                    group: schedule.groupName,
                    class: schedule.twoOurClassName,
                    teacher: schedule.teacher.split(' ')[0] + ' ' + schedule.teacher.split(' ')[1].split('')[0] + '. ' + schedule.teacher.split(' ')[2].split('')[0] + '.',
                    audience: changeNumberToID(allOptions && allOptions.scheduleOptions.audiences, schedule.audience),
                    weekday: schedule.weekday,
                    date: schedule.dateOfClass,
                    numberOfSchedule: schedule.numberOfSchedule ? schedule.numberOfSchedule : 0,
                    startTime: new Date(schedule.startTime)
                }))])
            }
        }
    }, [allSchedules, allFilteredSchedules, allOptions])
    const handleSend = () => {
        let arr: CreateSchedule[] = []
        if (allOptions)
            sendArray.map((elem) => {
                let obj = {
                    id: elem.key !== 0 ? elem.key : null,
                    startTime: new Date(new Date(elem.date).getFullYear() + '-' + (new Date(elem.date).getMonth() + 1) + '-' + new Date(elem.date).getDate() + ' ' + new Date(elem.startTime).getHours() + ':' + new Date(elem.startTime).getMinutes()).toISOString(),
                    groupId: changeNameToID(allOptions.scheduleOptions.groups, elem.group),
                    weekdayId: Number(dayjs(elem.date).format('d')) !== 0 ? Number(dayjs(elem.date).format('d')) : 7,
                    audienceId: elem.audience,
                    classId: changeNameToID(allOptions.scheduleOptions.classes, elem.class),
                    teacherId: changeTeacherToID(allOptions.scheduleOptions.teachers, elem.teacher.split(' ')[0]),
                    dateOfClass: getStartDay(elem.date),
                    numberOfSchedule: elem.numberOfSchedule

                }
                arr.push(obj)

            })
        createSchedule(arr);
        setArrayVisible(false);
    }
    const createNewRow = () => {
        const newRow = {
            key: 0,
            group: '',
            class: '',
            teacher: '',
            audience: '',
            weekday: '',
            date: dayjs(new Date()),
            startTime: dayjs(new Date()),
            numberOfSchedule: 0
        }
        setSendArray([newRow, ...sendArray])
        setChanger(false)
    }
    const handleChange = (event: any, id: number, key: string) => {
        const value = event.target?.value || event;
        const index = sendArray.findIndex(schedule => schedule.key === id);
        const foundObj = sendArray.find(schedule => schedule.key === id);
        if (foundObj) {
            let obj = {};
            switch (key) {
                case 'group' : {
                    setChanger(true)
                    setGroupValue(value.value)
                    obj = {
                        group: value.label,

                    }
                    break
                }
                case 'class' : {
                    setLessonValue(value.value)
                    setChanger(true)
                    obj = {
                        class: value.label,

                    }
                    break
                }
                case 'audience' : {
                    obj = {
                        audience: value.value,

                    }
                    break
                }
                case 'teacher' : {
                    setChanger(true)
                    getCurrentSubjects(value.value)
                    obj = {
                        teacher: value.label,

                    }
                    break
                }
                case 'date' : {
                    const weekDay = new Date(value).getDay() !== 0 ? new Date(value).getDay() : 1;
                    if (allOptions)
                        obj = {
                            date: value.toISOString(),
                            weekday: changeIdToWeekday(allOptions.scheduleOptions.weekdays, weekDay),
                            startTime: new Date(new Date(value).getFullYear() + '-' + getformattedSecAndMin(new Date(value).getMonth().toString()) + '-' + getformattedSecAndMin(new Date(value).getDate().toString()) + ' ' + new Date(foundObj.startTime).getHours() + ':' + new Date(foundObj.startTime).getMinutes()).toISOString()
                        }
                    break
                }
                case 'startTime': {
                    obj = {
                        startTime: new Date(new Date(foundObj.date).getFullYear() + '-' + getformattedSecAndMin(new Date(foundObj.date).getMonth().toString()) + '-' + getformattedSecAndMin(new Date(foundObj.date).getDate().toString()) + ' ' + new Date(value).getHours() + ':' + new Date(value).getMinutes()).toISOString()
                    }
                    break
                }
                case 'numberOfSchedule': {
                    obj = {
                        numberOfSchedule: Number(value) ? Number(value) : 0
                    }
                    break
                }
                default: {
                    obj = {
                        [key]: value
                    }
                }
            }

            sendArray[index] = {...foundObj, ...obj}
            setSendArray([...sendArray])
        }
    };
    const handleFilter = () => {
        if (selectFilter === 1) {
            getFilteredSchedules('dateOfClass=' + getStartDay(new Date(dateFilter.toISOString())))
        } else {
            let str = '';
            for (let i = 0; i < dateBetween.length; i++) {
                if (i === 0) {
                    str += getStartDay((dateBetween[i].toISOString())) + ','
                } else {
                    str += getStartDay((dateBetween[i].toISOString()))
                }

            }
            getFilteredSchedules('betweenDates=' + str)
        }
    }
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            if (selectedRows.length > 0) {
                setVisible(true);
                setDeleteArray(selectedRows)
            } else {
                setVisible(false);
                setDeleteArray(selectedRows)

            }
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    const doDelete = (array: any[]) => {
        let str = '';
        for (let i = 0; i < array.length; i++) {
            if (i === array.length - 1) {
                str += array[i].key.toString()
            } else {
                str += array[i].key.toString() + ','
            }
        }
        deleteSchedule(str)
        delay(200).then(() => {
            if (allSchedules && sendArray.length < allSchedules.length) {
                if (selectFilter === 1) {
                    getFilteredSchedules('dateOfClass=' + getStartDay(new Date(dateFilter.toISOString())))
                } else {
                    let str = '';
                    for (let i = 0; i < dateBetween.length; i++) {
                        if (i === 0) {
                            str += getStartDay((dateBetween[i].toISOString())) + ','
                        } else {
                            str += getStartDay((dateBetween[i].toISOString()))
                        }

                    }
                    getFilteredSchedules('betweenDates=' + str)
                }
            } else {
                refetchAll()
            }

            setVisible(false)
        })
    }
    const onChange: DatePickerProps['onChange'] = (date) => {
        setDateFilter(dayjs(date))
    };
    useEffect(() => {
        refetchAll()
    }, [])
    return (
        <>
            <div className={cl.topContain}>
                <p className={cl.mainTextFilter}>Расписание</p>
                <span style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxHeight: '50px',
                    minWidth: '150px',
                    alignContent: 'center',
                    paddingTop: '34px'
                }}>
                    <p className={cl.text}>Сортировка:</p>
                    <Select className={cl.selectFilter} size={"large"}
                            options={[{value: 1, label: 'Дата'}, {value: 2, label: 'Промежуток'}]} value={selectFilter}
                            onChange={(e) => setSelectFilter(e)}/>
                    {selectFilter === 1 ?

                        <DatePicker allowClear={false} style={{marginRight: '20px'}} className={cl.date}
                                    size={'large'}
                                    onChange={onChange}
                                    value={dateFilter}/>
                        :

                        <RangePicker onChange={(e) => setDateBetween(e)} style={{marginRight: '20px'}}
                                     className={cl.date}
                                     defaultValue={[dayjs('2023/06/01', dateFormat), dayjs('2023/06/01', dateFormat)]}
                                     format={dateFormat}
                        />

                    }
                    <Button
                        className={cl.topButtFilter} onClick={handleFilter}>Сортировать</Button>
                        </span>
                <span style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button className={cl.topButt} onClick={createNewRow}
                >Новое занятие</Button>
                    {visible ? <Button className={cl.topButt} onClick={() => {
                            doDelete(deleteArray)
                            refetchAll();
                        }}>Удалить</Button>
                        : <></>}
                    {arrayVisble ? <Button className={cl.topButt} onClick={() =>
                            handleSend()
                        }>Отправить</Button>
                        : <></>}
                </span>
            </div>
            <Spin spinning={isLoading} size="large">
                <Table
                    className={cl.myTable}
                    scroll={{x: 1600}}
                    bordered={true}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    dataSource={sendArray}
                >
                    <Column title='Учитель' align={"center"} className={cl.myColumn} dataIndex='teacher'
                            render={(value, record: any) => {
                                return <Select className={cl.tableSelect} size={"large"}
                                               onChange={(e: any, option) => {
                                                   handleChange(option, record.key, 'teacher')
                                                   setArrayVisible(true);
                                               }}
                                               options={currentTeacher && changer ? currentTeacher.teachers.map((teach) => ({
                                                   value: teach.id,
                                                   label: teach.user.second_name + ' ' + teach.user.first_name.split('')[0] + '. ' + teach.user.middle_name.split('')[0].split('')[0] + '.'
                                               })) : allOptions && allOptions.scheduleOptions.teachers.map((group) => ({
                                                   value: group.id,
                                                   label: group.user.second_name + ' ' + group.user.first_name?.split('')[0] + '. ' + group.user.middle_name?.split('')[0] + '.'
                                               }))}
                                               value={value ? value?.split(' ')[0] + ' ' + value?.split(' ')[1]?.split('')[0] + '. ' + value?.split(' ')[2]?.split('')[0] + '.' : ''}/>
                            }}/>
                    <Column title='Группа' align={"center"} className={cl.myColumn} dataIndex='group'
                            render={(value, record: any) => {
                                return <Select onChange={(e, option) => {
                                    handleChange(option, record.key, 'group')
                                    setArrayVisible(true)
                                }}
                                               className={cl.tableSelect} size={"large"}
                                               options={currentSubjects && changer ? currentSubjects.groups.map((gr) => ({
                                                   value: gr.id,
                                                   label: gr.name
                                               })) : allOptions && allOptions.scheduleOptions.groups.map((gr) => ({
                                                   value: gr.id,
                                                   label: gr.name
                                               }))} value={value}/>
                            }}/>
                    <Column title='Предмет' align={"center"} className={cl.myColumn} dataIndex='class'
                            render={(value, record: any) => {
                                return <Select className={cl.tableSelect} size={"large"}
                                               onChange={(e, option) => {
                                                   handleChange(option, record.key, 'class')
                                                   setArrayVisible(true)
                                               }}
                                               options={currentSubjects && changer ? currentSubjects.classes.map((clas) => ({
                                                   value: clas.id,
                                                   label: clas.name
                                               })) : allOptions && allOptions.scheduleOptions.classes.map((group) => ({
                                                   value: group.id,
                                                   label: group.name
                                               }))} value={value}/>
                            }}/>
                    <Column title='Кабинет' width={200} align={"center"} className={cl.myColumn} dataIndex='audience'
                            render={(value, record: any) => {
                                return <Select className={cl.tableSelect} size={"large"}
                                               onChange={(e, option) => {
                                                   handleChange(option, record.key, 'audience')
                                                   setArrayVisible(true)
                                               }}
                                               options={allOptions && allOptions.scheduleOptions.audiences.map((group) => ({
                                                   value: group.id,
                                                   label: group.number_audience
                                               }))} value={value}/>
                            }}/>
                    <Column title='Дата' align={"center"} className={cl.myColumn} dataIndex='date'
                            render={(value, record: any) => {
                                return <DatePicker onChange={(e) => {
                                    handleChange(e, record.key, 'date')
                                    setArrayVisible(true);
                                }} className={cl.tableSelect} size={"large"} value={dayjs(new Date(value))}/>
                            }}/>
                    <Column width={'150px'} title='Начало урока' align={"center"} className={cl.myColumn}
                            dataIndex='startTime'
                            render={(value, record: any) => {
                                return <TimePicker className={cl.tableSelect} onChange={(e) => {
                                    handleChange(e, record.key, 'startTime')
                                    setArrayVisible(true)
                                }}
                                                   value={dayjs(value) || dayjs(new Date())}
                                                   defaultValue={dayjs('00:00', 'HH:mm')} format={'HH:mm'}/>
                            }}/>

                    <Column width={'150px'} title='Номер урока' align={"center"} className={cl.myColumn}
                            dataIndex='numberOfSchedule'
                            render={(value, record: any) => {
                                return <Input className={cl.tableInp} value={value} onChange={(e) => {
                                    handleChange(e, record.key, 'numberOfSchedule')
                                    setArrayVisible(true)
                                }}/>
                            }}
                    />
                </Table>
            </Spin>
        </>

    );
};

export default CreateAdminSchedule;