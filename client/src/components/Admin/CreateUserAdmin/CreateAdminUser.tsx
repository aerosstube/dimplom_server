import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {adminApi} from "../../../services/AdminService";
import cl from "../CreateAudienceAdminPage/AdminAudience.module.css";
import {Button, Checkbox, DatePicker, Form, Input, Select, Table} from "antd";
import dayjs, {Dayjs} from "dayjs";
import Column from "antd/es/table/Column";
import {getLowerCaseFilter} from "../../../utils/getLowerCaseFilter";
import {checkPhone} from "../../../utils/checkPhone";

export const changeNameToID = (array: any[], name: string) => {
    let res: number = 0;
    array.map((elem) => {
        if (elem.name.toString() === name) {

            res = elem.id

        }
    })
    return res
}
export const changeNumberToID = (array: any[], numberOF: number) => {
    let res: number = 0;
    array.map((elem) => {
        if (elem.number_audience === numberOF) {

            res = elem.id

        }
    })
    return res
}
export const changeTeacherToID = (array: any[], user: string) => {
    let res: number = 0;

    array.map((elem) => {
        if (elem.user.second_name === user) {
            res = elem.id
        }
    })
    return res
}
export const changeDate = (date: string) => {
    let day = '0' + new Date(date).getDate();
    let month = '0' + (new Date(date).getMonth() + 1);
    let year = new Date(date).getFullYear();
    return year + '-' + month + '-' + day + ' 00:00:00.000000'
}
const CreateAdminUser = () => {
    const {user_id: id} = useParams();
    const info = useLocation();
    const [filter, setFilter] = useState('');
    const [groupFilter, setGroupFilter] = useState('')
    const navigate = useNavigate();
    const {data: allOptions} = adminApi.useGetUserOptionsQuery(null);
    const [getAllLessons, {data: allLessons}] = adminApi.useGetLessonsMutation();
    const [getAllGroups, {data: allGroups}] = adminApi.useGetGroupsMutation();
    const [createUser] = adminApi.useCreateUpdateUserMutation();
    const [firstname, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [group, setGroup] = useState(0);
    const [isTeacher, setIsTeacher] = useState(false);
    const [is_ex, setIs_ex] = useState(false);

    const [dateOfBirth, setDayOfBirth] = useState('');
    const [dateForPicker, setDateForPicker] = useState<Dayjs | null>(dayjs(new Date()));

    const [selectedRowGroupKeys, setSelectedRowGroupKeys] = useState(info.state?.groupsId);
    const [selectedRowLessonKeys, setSelectedRowLessonKeys] = useState(info.state?.classes);
    const convertDate = (date: string, toNormal: boolean) => {
        let str = '';
        if (toNormal) {
            for (let i = date?.split('-').length - 1; i >= 0; i--) {
                if (i !== 0) {
                    str += date?.split('-')[i] + '.'
                } else {
                    str += date?.split('-')[i]
                }
            }
            return str
        } else {
            let str = date?.split('.')[1] + '-' + date?.split('.')[0] + '-' + date?.split('.')[2];
            return str.toString()
        }
    }
    const onSelectGroupChange = (selectedRowGroupKeys: any) => {
        setSelectedRowGroupKeys(selectedRowGroupKeys);
    };
    const onSelectLessonChange = (selectedRowLessonKeys: any) => {
        setSelectedRowLessonKeys(selectedRowLessonKeys);
    };
    const rowGroupSelection = {
        selectedRowKeys: selectedRowGroupKeys,
        onChange: onSelectGroupChange,
    };
    const rowLessonSelection = {
        selectedRowKeys: selectedRowLessonKeys,
        onChange: onSelectLessonChange,
    };
    const handleSetPickers = (_: any, date: string) => {
        setDateForPicker(dayjs(new Date(date)))
        setDayOfBirth(convertDate(date, true))

    }
    useEffect(() => {
        getAllGroups(groupFilter)
    }, [groupFilter])


    useEffect(() => {

        setSecondName(info.state?.fio?.split(' ')[0]);
        setFirstName(info.state?.fio?.split(' ')[1]);
        setMiddleName(info.state?.fio?.split(' ')[2])
        setPhone(info.state?.phone);
        setEmail(info.state?.email);
        setRole(info.state?.role);
        setLogin(info.state?.login);
        setDateForPicker(info.state?.date ? dayjs(new Date(convertDate(info.state?.date, false))) : dayjs(new Date()))
        setDayOfBirth(info.state?.date);
        setIsTeacher(info.state?.isTeacher);
        setGroup(info.state?.group);
        setIs_ex(info.state?.is_expelled)
        getAllLessons('')
    }, [])
    const createUpdateUser = (values: any) => {
        if (Number(id) !== 0) {
            if (isTeacher) {
                let obj = {
                    id: Number(id),
                    login: values.login,
                    password: values.password ? values.password : null,
                    firstName: values.firstName,
                    secondName: values.secondName,
                    middleName: values.middleName,
                    mobilePhone: phone,
                    eMail: values.email,
                    dateOfBirthday: values.dateOfBirth,
                    role: values.role,
                    isTeacher: isTeacher,
                    classesIds: selectedRowLessonKeys,
                    groupId: selectedRowGroupKeys
                }
                console.log({user: obj}, 'teacherUpdate')
                // createUser({user: obj})
            } else {
                let obj = {
                    id: Number(id),
                    login: values.login,
                    password: values.password ? values.password : null,
                    firstName: values.firstName,
                    secondName: values.secondName,
                    middleName: values.middleName,
                    mobilePhone: phone,
                    eMail: values.email,
                    dateOfBirthday: values.dateOfBirth,
                    role: values.role,
                    isTeacher: isTeacher,
                    groupId: values.group,
                    is_expelled: is_ex
                }
                console.log({user: obj}, 'studentUpdate')
                //createUser({user: obj})
            }


        } else {
            if (isTeacher) {
                let obj = {
                    login: login,
                    password: values.password ? values.password : null,
                    firstName: firstname,
                    secondName: secondName,
                    middleName: middleName,
                    mobilePhone: phone,
                    eMail: email,
                    groupId: selectedRowGroupKeys,
                    dateOfBirthday: dateOfBirth,
                    role: role,
                    isTeacher: isTeacher,
                    classesIds: selectedRowLessonKeys
                }
                console.log({user: obj}, 'teacherCreate')
                //createUser({user: obj})
            } else {
                let obj = {
                    login: values.login,
                    password: values.password ? values.password : null,
                    firstName: values.firstName,
                    secondName: values.secondName,
                    middleName: values.middleName,
                    mobilePhone: phone,
                    eMail: values.email,
                    dateOfBirthday: values.dateOfBirth,
                    isTeacher: isTeacher,
                    groupId: values.group,
                    is_expelled: is_ex
                }
                console.log({user: obj}, 'studentCreate')
                // createUser({user: obj})
            }
        }
        navigate('/adminUsers')
    }
    useEffect(() => {
        getAllLessons(filter)
    }, [filter])
    return (
        <>
            <Form className={cl.mainContainToOrg} onFinish={createUpdateUser}
                  onFinishFailed={() => console.log('Error')}>
                <div className={cl.topContain}>
                    <p className={cl.mainText}>{Number(id) !== 0 ? 'Изменить пользователя: ' : 'Создать пользователя:'}</p>
                    <Button htmlType={'submit'} className={cl.myButt}>Сохранить</Button>
                </div>
                <Form.Item className={cl.contain} label={'Фамилия:'} name={'secondName'}
                           rules={[{required: true, message: 'Фамилия не может быть пустой!'}]}>
                    <Input className={cl.inp} defaultValue={info.state?.fio?.split(' ')[0]}
                           value={info.state?.fio?.split(' ')[0]}/>
                </Form.Item>
                <Form.Item className={cl.contain} label={'Имя:'} name={'firstName'}
                           rules={[{required: true, message: 'Имя не может быть пустым!'}]}>
                    <Input className={cl.inp} defaultValue={info.state?.fio?.split(' ')[1]}/>
                </Form.Item>
                <Form.Item className={cl.contain} label={'Отчество:'} name={'middleName'}
                           rules={[{required: true, message: 'Отчество не может быть пустым!'}]}>

                    <Input className={cl.inp} defaultValue={info.state?.fio?.split(' ')[2]}/>
                </Form.Item>
                <Form.Item className={cl.contain} label={'Телефон:'}
                           rules={[{required: true, message: 'Телефон не может быть пустым!'}]}>
                    <Input className={cl.inp} value={phone} onChange={e => setPhone(checkPhone(e))}/>
                </Form.Item>
                <Form.Item className={cl.contain} label={'Эл.почта:'} name={'email'}
                           rules={[{required: true, message: 'Email не может быть пустым!'}]}>
                    <Input className={cl.inp} type={'email'} defaultValue={info.state?.email}
                           onChange={(e) => setEmail(e.target.value)}/>
                </Form.Item>
                <Form.Item className={cl.contain} label={'Дата рождения:'} name={'dateOfBirth'}
                           rules={[{required: true, message: 'Дата рождения не может быть пустой!'}]}>
                    <DatePicker defaultValue={info.state?.date && dayjs(new Date(convertDate(info.state?.date, false)))}
                                size={'large'} className={cl.date}/>
                </Form.Item>
                <Form.Item className={cl.contain} label={'Роль:'} name={'role'}
                           rules={[{required: true, message: 'Роль не может быть пустой!'}]}>
                    <Select size={"large"} className={cl.select} defaultValue={info.state?.role}
                            onChange={(e) => setRole(e)}
                            options={allOptions?.userOptions.role.map((role: any) => ({
                                value: role.name,
                                label: role.name
                            }))}/>
                </Form.Item>
                <Form.Item className={cl.contain} label={'Логин:'} name={'login'}
                           rules={[{required: true, message: 'Логин не может быть пустым!'}]}>
                    <Input className={cl.inp} defaultValue={info.state?.login}
                           onChange={(e) => setLogin(e.target.value)}/>
                </Form.Item>
                <Form.Item className={cl.contain} label={'Пароль:'} name={'password'}>
                    <Input className={cl.inp}/>
                </Form.Item>
                {!isTeacher ? <Form.Item className={cl.contain} label={'Группа:'} name={'group'}
                                         rules={[{required: true, message: 'Группа не может быть пустой!'}]}>
                    <Select size={"large"} className={cl.select} defaultValue={info.state?.group}
                            onChange={(e) => setGroup(e)}
                            options={allOptions?.userOptions.groups.map((group: any) => ({
                                value: group.id,
                                label: group.name
                            }))}/>
                </Form.Item> : <></>}
                {Number(id) !== 0 ? <Form.Item className={cl.contain} label={'Учитель:'}>
                        <Checkbox className={cl.checkBox} checked={isTeacher} disabled={Number(id) !== 0}/>
                    </Form.Item>
                    : <Form.Item className={cl.contain} label={'Учитель:'}>
                        <Checkbox className={cl.checkBox} checked={isTeacher} disabled={Number(id) !== 0}
                                  onChange={e => setIsTeacher(e.target.checked)}/>
                    </Form.Item>
                }
                {!isTeacher ? <Form.Item className={cl.contain} label={'Отчислен:'}>
                    <Checkbox className={cl.checkBox} checked={is_ex} onChange={e => setIs_ex(e.target.checked)}/>
                </Form.Item> : <></>}
            </Form>
            {isTeacher ? <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '0 auto',
                gap: '70px',
                width: '1640px'
            }}>
                <span>
                    <p style={{minWidth: '300px', margin: '10px 15px'}} className={cl.text}>Поиск по группе:</p>
                 <Input className={cl.inp} value={groupFilter} onChange={(e) => {
                     setGroupFilter((e.target.value))
                 }} style={{marginBottom: '10px', marginRight: '10px'}}/>
                <Table className={cl.myLessonTable}
                       dataSource={allGroups && allGroups.map((group) => ({
                           key: group.id,
                           name: group.name
                       }))}
                    // @ts-ignore
                       rowSelection={rowGroupSelection}

                >
                    <Column title='ID' dataIndex='key' className={cl.myColumn}/>
                    <Column title='Группа' dataIndex='name' className={cl.myColumn}/>
                </Table>
                    </span>
                <span>
                    <p style={{minWidth: '300px', margin: '10px 15px'}} className={cl.text}>Поиск по предмету:</p>
                 <Input className={cl.inp} value={filter} onChange={(e) => {
                     setFilter((getLowerCaseFilter(e.target.value)))
                 }} style={{marginBottom: '10px', marginRight: '10px'}}/>
                <Table className={cl.myLessonTable} dataSource={allLessons && allLessons.map((lesson) => ({
                    key: lesson.id,
                    name: lesson.name
                }))}
                       rowSelection={rowLessonSelection}
                >
                    <Column title='ID' dataIndex='key' className={cl.myColumn}/>
                    <Column title='Предметы' dataIndex='name' className={cl.myColumn}/>
                </Table>
                    </span>
            </div> : <></>}
        </>
    );
};

export default CreateAdminUser;