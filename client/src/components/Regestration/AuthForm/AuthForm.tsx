import jwt from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {useAppDispatch} from '../../../hooks';
import {authAPI} from '../../../services/AuthService';
import {UserSlice, UserState} from '../../../store/reducers/UserSlice';
import cl from './RegForm.module.css';
import {useNavigate} from "react-router-dom";
import img from "../../../img/logo2.png";
import {Button, Form, Input} from "antd";

const AuthForm = () => {
    const [loginUser, {data: tokens, error, isLoading}] = authAPI.useUserLoginMutation();

    const [password, setPassword] = useState('');
    const [passwordDirt, setPasswordDirt] = useState(false);
    const [passwordError, setPasswordError] = useState('Пароль не может быть пустым');
    //const regExpPassword = /^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    const [login, setLogin] = useState('');
    const [loginDirt, setLoginDirt] = useState(false);
    const [loginError, setLoginError] = useState('Логин не может быть пустым');

    const [valid, setValid] = useState(false)
    // @ts-ignore
    const handleBlur = (e) => {
        switch (e.target.name) {
            case 'login': {
                setLoginDirt(true);
                break;
            }
            case 'password': {
                setPasswordDirt(true);
                break;
            }

        }
    }

    const handleCheckPassword = (e: any) => {
        setPassword(e.target.value);
        if (e.target.value.split('').length > 0) {
            setPasswordError('')
        } else {
            setPasswordError('Логин не может быть пустым')
        }
    }
    const handleCheckLogin = (e: any) => {
        setLogin(e.target.value);
        if (e.target.value.split('').length > 0) {
            setLoginError('')
        } else {
            setLoginError('Логин не может быть пустым')
        }
    }
    const {addUser} = UserSlice.actions;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const goToSchedule = (isTeacher: boolean) => {
        if (isTeacher) {
            navigate('/groups')
        } else {
            navigate('/schedule')
        }
    };

    const handleSend = async (values: any) => {
        const user = {
            login: values.login,
            password: values.password
        };
        await loginUser(user);
    };

    useEffect(() => {
        if (loginError || passwordError) {
            setValid(false);
        } else setValid(true)
    }, [passwordError, loginError])

    useEffect(() => {
        if (tokens) {

            const response: UserState = {
                user: jwt(tokens.tokens.accessToken),
                tokens,
                isLogged: true
            };
            dispatch(addUser(response));
            goToSchedule(response.user.isTeacher);
        }
        if (error) {
            console.log(error);
        }
    }, [tokens, error]);

    return (
        <Form className={cl.mainContainer} onFinish={handleSend} onFinishFailed={() => console.log('penis')}>
            <img src={img} alt="" className={cl.regImg}/>
            <p className={cl.regText}>Добро пожаловать в электронный школьный портал!</p>
            <Form.Item
                name={'login'}
                rules={[{required: true, message: 'Логин не может быть пустым'}]}
            >
                <Input
                    placeholder="Логин"
                    name='login'
                    className={cl.regInp}
                />
            </Form.Item>
            <Form.Item
                name={'password'}
                rules={[{required: true, message: 'Пароль не может быть пустым'}]}
            >
                <Input.Password
                    placeholder="Пароль"
                    name='password'
                    className={cl.regInp}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType='submit'
                    className={cl.regBut}
                    loading={isLoading}
                >
                    Войти
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AuthForm;