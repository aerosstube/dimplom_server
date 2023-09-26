import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {adminApi} from "../../../services/AdminService";
import cl from "../CreateAudienceAdminPage/AdminAudience.module.css";
import {Button, Form, Input} from "antd";

const CreateAdminGroup = () => {
    const {group_id: id} = useParams();
    const info = useLocation();
    const navigate = useNavigate();
    const [createGroup] = adminApi.useCreateUpdateGroupMutation();
    const [name, setName] = useState('');
    useEffect(() => {
        setName(info.state)
    }, [])
    const createUpdateGroup = (values: any) => {
        if (Number(id) !== 0) {
            let obj = {
                id: Number(id),
                name: values.group
            }
            createGroup(obj)

        } else {
            let obj = {
                name: values.group
            }
            createGroup(obj)
        }
        navigate('/adminGroups')
    }
    return (
        <Form className={cl.mainContainToOrg} name={'groups'} onFinish={createUpdateGroup}
              onFinishFailed={() => console.log('Ошибка')}>
            <div className={cl.topContain}>
                <p className={cl.mainText}>{Number(id) !== 0 ? 'Изменить группу: ' : 'Создать группу:'}</p>
                <Form.Item>
                    <Button htmlType={"submit"} className={cl.myButt} style={{marginRight: '10px'}}>Сохранить</Button>
                </Form.Item>
            </div>
            <Form.Item className={cl.contain} label={'Группа'} name={'group'}
                       rules={[{required: true, message: 'Группа не может быть пустой!'}]}>
                <Input className={cl.inp} defaultValue={info.state}/>
            </Form.Item>

        </Form>
    );
};

export default CreateAdminGroup;