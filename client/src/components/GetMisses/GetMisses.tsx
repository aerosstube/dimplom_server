import React, {useEffect} from 'react';
import {studentApi} from "../../services/StudentService";
import {Table} from "antd";
import Column from "antd/es/table/Column";
import {IMisses} from "../../models/IMisses";
import './GetMisses.css'

const GetMisses = () => {
    const {data: allMisses, refetch} = studentApi.useGetMyMissesQuery(null);
    const convertData = (misses?: IMisses) => {
        let tableArr: any = [];
        misses && misses.missesOptions.map((miss) => {
            let obj = {
                lesson: miss.name,
                total: miss.bSum + miss.nSum + miss.pSum,
                sick: miss.bSum,
                respect: miss.pSum,
                none: miss.nSum
            }
            tableArr.push(obj)
        })
        if (misses) {
            let obj1 = {
                lesson: 'Всего:',
                total: misses?.amountMisses.nSum + misses?.amountMisses.pSum + misses?.amountMisses.bSum,
                sick: misses.amountMisses.bSum,
                respect: misses.amountMisses.pSum,
                none: misses.amountMisses.nSum
            }
            tableArr.push(obj1)
        }
        return tableArr
    }
    useEffect(() => {
        refetch()
    })
    return (
        <div className={'tableContain'}>
            <Table dataSource={convertData(allMisses)} pagination={false} className={'table'}>
                <Column title='Предмет' dataIndex='lesson' className={'lessonColumn'} align={"center"}/>
                <Column title='Всего' dataIndex='total' className={'totalColumn'} align={"center"} width={75}/>
                <Column title='Б' dataIndex='sick' className={'sickColumn'} align={"center"} width={55}/>
                <Column title='У' dataIndex='respect' className={'respectColumn'} align={"center"} width={55}/>
                <Column title='Н' dataIndex='none' className={'noneColumn'} align={"center"} width={55}/>
            </Table>
        </div>
    );
};

export default GetMisses;