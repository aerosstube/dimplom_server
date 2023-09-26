import React from 'react';
import cl from './Header.module.css'
import img from '../../img/logo.png'
import {ConfigProvider, Dropdown, MenuProps} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {UserSlice} from "../../store/reducers/UserSlice";
import {authAPI} from "../../services/AuthService";
import HeaderTexts from "./HeaderTexts";

const Header = () => {
    const {fullName, role} = useAppSelector(state => state.userReducer.user);
    const {removeUser} = UserSlice.actions;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [logoutUser] = authAPI.useLogoutUserMutation();
    const arr = fullName.split(' ');
    arr[2] = '';
    const headerName = arr.join(" ");

    const handleLogOut = async () => {
        await logoutUser(null);
        dispatch(removeUser());
    };
    const handleClick: MenuProps['onClick'] = async ({key}) => {
        if (key === '1') {
            await handleLogOut();
            navigate('/auth')
        }
        if (key === '2') {
            navigate('/adminChoisePage')
        }
    };
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <>
                    <LogoutOutlined style={{marginRight: '5px'}}/>
                    Выйти
                </>
            ),
        },
        {
            key: '2',
            label: role === 'ADMIN' ? <span style={{marginTop: '10px'}}>Администратор</span> :
                <span style={{display: 'none'}}></span>
        }

    ];


    return (
        <div className={cl.headerMain}>
            <div className={cl.headerContainImg}>
                <img src={img} alt="SHP" className={cl.headerImg}/>
                <p className={cl.headerMainText}>Школьный портал</p>
            </div>
            <HeaderTexts/>
            {
                fullName &&
                <ConfigProvider
                    theme={{
                        token: {colorText: '#0095FFDB',}
                    }}
                >

                    <Dropdown menu={{items, onClick: handleClick}} placement="bottom"
                              trigger={['click']}>
                        <h2 className={cl.headerText}>{headerName}</h2>

                    </Dropdown>
                </ConfigProvider>
            }
            {
                !fullName && <Link className={cl.headerText} to='/auth'>Авторизуйтесь</Link>
            }
        </div>

    );
};

export default Header;