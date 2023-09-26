import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {adminApi} from "../../../services/AdminService";
import cl from "../CreateAudienceAdminPage/AdminAudience.module.css";
import {Button, Form, Input} from "antd";

const CreateAdminLesson = () => {
    const {lesson_id: id} = useParams();
    const info = useLocation();
    const navigate = useNavigate();
    const [createLesson] = adminApi.useCreateUpdateLessonsMutation();
    const [name, setName] = useState('');
    useEffect(() => {
        setName(info.state)
    }, [])
    const createUpdateLesson = (values: any) => {
        if (Number(id) !== 0) {
            let obj = {
                id: Number(id),
                name: values.name
            }
            createLesson(obj)

        } else {
            let obj = {
                name: values.name
            }
            createLesson(obj)
        }
        navigate('/adminLessons')
    }
    return (
        <Form className={cl.mainContainToOrg} name={'lessons'}
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              onFinish={createUpdateLesson}
              onFinishFailed={() => console.log('Ошибка')}
        >
            <div className={cl.topContain}>
                <p className={cl.mainText}>{Number(id) !== 0 ? 'Изменить занятие: ' : 'Создать занятие:'}</p>
                <Form.Item>
                    <Button htmlType={"submit"} className={cl.myButt} style={{marginRight: '10px'}}>Сохранить</Button>
                </Form.Item>
            </div>
            <Form.Item className={cl.contain} label={'Название'} name={'name'}
                       rules={[{required: true, message: 'Название не может быть пустым!'}]}>
                <Input className={cl.inp} defaultValue={info.state}/>
            </Form.Item>
        </Form>
    );
};

export default CreateAdminLesson;