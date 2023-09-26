import React, {useEffect, useState} from 'react';
import cl from './AdminAudience.module.css'
import {Button, Table} from "antd";
import Column from "antd/es/table/Column";
import {adminApi} from "../../../services/AdminService";
import {useNavigate} from "react-router-dom";

export const delay = (ms: number) => {
    return new Promise(r => setTimeout(() => r(''), ms))
}
const AudiencePage = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [deleteAudience] = adminApi.useDeleteAudienceMutation();
    const {data: allAudiences, refetch} = adminApi.useGetAudiencesQuery(null);
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
        deleteAudience(str)
        delay(500).then(() => {
            refetch()
            setVisible(false)
        })

    }
    useEffect(() => {
        refetch()
    }, [])
    return (
        <>
            <div className={cl.topContain}>
                <p className={cl.mainText}>Список кабинетов</p>
                <span>
                <Button className={cl.topButt}
                        onClick={() => navigate('/adminAudiences/edit/0')}>Новый кабинет</Button>
                    {visible ? <Button className={cl.topButt} onClick={() => {
                            doDelete(deleteArray)
                        }}>Удалить</Button>
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
                            navigate(`/adminAudiences/edit/${record.key}`, {state: record.number})
                        },
                    };
                }}
                dataSource={allAudiences && allAudiences.map((audience: any) => ({
                    key: audience.id,
                    number: audience.number_audience
                }))}
            >

                <Column title='Номер кабинета' align={"center"} className={cl.myColumn} dataIndex='number'/>
            </Table>
        </>
    );
};

export default AudiencePage;