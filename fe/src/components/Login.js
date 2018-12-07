import React from 'react'
import {Breadcrumb, Icon, Input, Button, message} from 'antd';
import {Link} from 'react-router-dom'
import '../assets/css/Login.css'

const success = () => {
    message.config({
        top: '6%',
        duration: 3,
    })
    message.success('成功登录！正在跳转。');
};
const error = () => {
    message.config({
        top: '6%',
        duration: 3,
    })
    message.error('登录失败，请检查您的用户名或密码后重新尝试！');
};
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            warn: false
        }
    }

    loginCheck = () => {
        let username = document.querySelector("input[name='username']")
        let password = document.querySelector("input[name='password']")
        if (username.value.length === 0 || password.value.length === 0) {
            error()
        } else {
            success()
        }
    }

    render() {
        return (
            <div className={'content loginPage'}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>登录</Breadcrumb.Item>
                </Breadcrumb>
                <form className={'loginBox'}>
                    <label><Icon type="user" style={{fontSize: '23px'}}/> <Input required={true} size={'large'}
                                                                                 name={'username'}
                                                                                 placeholder="请输入用户名"/></label><br/>
                    <label><Icon type="lock" style={{fontSize: '23px'}}/> <Input required={true} size={'large'}
                                                                                 type={'password'} name={'password'}
                                                                                 placeholder="请输入密码"/></label><br/>
                    <Button onClick={this.loginCheck} block={true} htmlType={'submit'} type="primary">登录</Button><br/>
                    <span>没有账号？<Link to={'/register'}>前往注册！</Link></span>
                </form>
            </div>
        )
    }
}

export default Login