import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {adminApi} from "../../../services/AdminService";
import cl from "../CreateAudienceAdminPage/AdminAudience.module.css";
import {Button, Table} from "antd";
import Column from "antd/es/table/Column";
import {delay} from "../CreateAudienceAdminPage/AudiencePage";

const AdminGroups = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [getAllGroups, {data: allGroups}] = adminApi.useGetGroupsMutation();
    const [deleteGroup] = adminApi.useDeleteGroupMutation();
    const [deleteArray, setDeleteArray] = useState<any>([])
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
        deleteGroup(str)
        delay(500).then(() => {
            getAllGroups('')
            setVisible(false)
        })
    }
    useEffect(() => {
        getAllGroups('')
    }, [])
    return (
        <>
            <div className={cl.topContain}>
                <p className={cl.mainText}>Список классов</p>
                <span>
                <Button className={cl.topButt}
                        onClick={() => navigate('/adminGroups/edit/0')}>Новая группа</Button>
                    {visible ? <Button className={cl.topButt} onClick={() => doDelete(deleteArray)}>Удалить</Button>
                        : <></>}
                </span>
            </div>
            <Table
                className={cl.myTable}
                bordered={true}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            navigate(`/adminGroups/edit/${record.key}`, {state: record.name})
                        },
                    };
                }}
                dataSource={allGroups && allGroups.map((group: any) => ({
                    key: group.id,
                    name: group.name
                }))}
            >

                <Column title='Класс' align={"center"} className={cl.myColumn} dataIndex='name'/>
            </Table>
        </>
    );
};

export default AdminGroups;