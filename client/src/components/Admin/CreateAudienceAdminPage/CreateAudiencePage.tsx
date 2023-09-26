import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {adminApi} from "../../../services/AdminService";
import cl from './AdminAudience.module.css'
import {Button, Form, Input} from "antd";

const CreateAudiencePage = () => {
    const {audience_id: id} = useParams();
    const info = useLocation();
    const navigate = useNavigate();
    const [createAudience] = adminApi.useCreateUpdateAudienceMutation();
    const [number, setNumber] = useState('');
    useEffect(() => {
        setNumber(info.state)
    }, [])
    const createUpdateAudience = (values: any) => {
        if (Number(id) !== 0) {
            let obj = {
                id: Number(id),
                numberAudience: Number(values.audience)
            }
            createAudience(obj)

        } else {
            let obj = {
                numberAudience: Number(values.audience)
            }
            createAudience(obj)
        }
        navigate('/adminAudiences')
    }
    return (
        <Form className={cl.mainContainToOrg} name={'audiences'} onFinishFailed={() => console.log('Error')}
              onFinish={createUpdateAudience}>
            <div className={cl.topContain}>
                <p className={cl.mainText}>{Number(id) !== 0 ? 'Изменить аудиторию: ' : 'Создать аудиторию:'}</p>
                <Button htmlType={'submit'} className={cl.myButt}>Сохранить</Button>
            </div>
            <Form.Item className={cl.contain} name={'audience'} label={'Аудитория'}
                       rules={[{required: true, message: 'Аудитория не может быть пустой!'}]}>
                <Input defaultValue={info.state} className={cl.inp}/>
            </Form.Item>
        </Form>
    );
};

export default CreateAudiencePage;