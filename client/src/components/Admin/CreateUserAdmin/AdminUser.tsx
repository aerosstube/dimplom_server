import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {adminApi} from "../../../services/AdminService";
import cl from "../CreateAudienceAdminPage/AdminAudience.module.css";
import {Button, Checkbox, Input, Table} from "antd";
import Column from "antd/es/table/Column";
import {delay} from "../CreateAudienceAdminPage/AudiencePage";
import {GetUser} from "../../../models/IUserOptions";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";

const AdminUser = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [getAllUsers, {data: allUsers}] = adminApi.useGetAllUsersMutation();
    const [isTeacher, setIsTeacher] = useState(false);
    const [groupValue, setGroupValue] = useState('')
    const [deleteArray, setDeleteArray] = useState<any>([]);
    const [deleteUsers] = adminApi.useDeleteUsersMutation();
    const getRowClassName = (record: any) => {

        if (record.is_expelled === true) {
            return cl.expelled;
        }
        return '';
    };
    console.log('allUsers', allUsers)
    useEffect(() => {
        getAllUsers({group: groupValue, isTeacher: !isTeacher})
    }, [groupValue, isTeacher])
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
        deleteUsers(str)
        delay(500).then(() => {
            getAllUsers({group: groupValue, isTeacher: !isTeacher})
            setVisible(false)
        })

    }
    return (
        <>
            <div className={cl.topContain}>
                <p className={cl.mainText}>Список пользователей</p>
                <span style={{minWidth: '600px'}}>
                        <span style={{display: 'flex', minWidth: '300px'}}>
                     <p className={cl.text} style={{margin: '0 30px 0 0'}}>Сортировка:</p>
                    <Checkbox className={cl.checkBox} style={{margin: '0 10px 10px 10px'}} value={isTeacher}
                              onChange={e => setIsTeacher(e.target.checked)}>Учитель</Checkbox>
                        </span>
                       <span style={{display: 'flex', minWidth: '300px'}}>
                        <p className={cl.text} style={{margin: '0 10px 0 0', minWidth: '200px', textAlign: "left"}}>Название группы:</p>
                    <Input className={cl.inp} value={groupValue} onChange={(e) => setGroupValue(e.target.value)}
                           placeholder='Введите наименование группы'/>
                </span>
                  </span>
                <span>
                <Button className={cl.topButt}
                        onClick={() => navigate('/adminUsers/edit/0')}>Новый пользователь</Button>
                    {visible ? <Button className={cl.topButt} onClick={() => {
                            doDelete(deleteArray)
                        }}>Удалить</Button>
                        : <></>}
                </span>
            </div>
            <Table
                rowClassName={getRowClassName}
                className={cl.myTable}
                bordered={true}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            navigate(`/adminUsers/edit/${record.key}`, {state: record})
                        },
                    };
                }}
                dataSource={allUsers && allUsers.users?.map((user: GetUser) => ({
                    key: user.id,
                    fio: user.secondName + ' ' + user.firstName + ' ' + user.middleName,
                    phone: user.mobilePhone,
                    email: user.eMail,
                    role: user.role,
                    login: user.login,
                    date: user.dateOfBirthday,
                    group: !user.isTeacher ? user.group.map((gr) => {
                        return gr.name

                    }) : user.group.map((gr: any, index) => {
                        return gr?.name
                    }).join(',')
                    ,
                    isTeacher: user.isTeacher,
                    classes: user.classes && user.classes.map((clas) => {
                        return clas.two_our_class_id_fk
                    }),
                    groupsId: user.isTeacher ? user.group.map((gr: any) => {
                        return gr.id
                    }) : user.group.map((gr) => {
                        return gr.id
                    }),
                    is_expelled: user.is_expelled
                }))}
            >
                <Column title='ФИО:' align={"center"} className={cl.myColumn} dataIndex='fio'/>
                <Column title='Дата рождения:' align={"center"} className={cl.myColumn} dataIndex='date'/>
                <Column title='Телефон' align={"center"} className={cl.myColumn} dataIndex='phone'/>
                <Column title='E-MAIL' align={"center"} className={cl.myColumn} dataIndex='email'/>
                <Column title='Роль' align={"center"} className={cl.myColumn} dataIndex='role'/>
                <Column title='Логин' align={"center"} className={cl.myColumn} dataIndex='login'/>
                <Column title='Группа' align={"center"} className={cl.myColumn} dataIndex='group'/>
                <Column title='Учитель:' align={"center"} className={cl.myColumn} dataIndex='isTeacher'
                        render={(flag: boolean) => flag ?
                            <CheckCircleOutlined style={{color: '#029ef7', fontSize: '30px'}}/> :
                            <CloseCircleOutlined style={{color: 'red', fontSize: '30px'}}/>}/>
            </Table>
        </>
    );
};

export default AdminUser;