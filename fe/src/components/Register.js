import React from 'react'
import {Breadcrumb, Icon, Input, Button, Alert} from 'antd';
import {Link} from 'react-router-dom'
import '../assets/css/Register.css'

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            warn: false,
        }
    }

    onClose = (e) => {
        this.setState({
            warn: false
        })
    }
    registerCheck = () => {
        let user = document.querySelector("input[name='new_username']")
        let pwd = document.querySelector("input[name='new_password']")
        let confirm_pwd = document.querySelector("input[name='confirm_pwd']")
        let email = document.querySelector("input[name='new_email']")
        if (user.value.length < 6) {
            this.setState({
                warn: true
            })
            user.value = ''
            pwd.value = ''
            confirm_pwd.value = ''
            email.value = ''
        }
    }
    debounce = (fn, delay) => {
        let timer
        return function (event) {
            clearTimeout(timer)
            timer = setTimeout(fn.bind(this, event.target), delay)
        }
    }
    change = (target) => {
        let name = target.name
        console.log('$$$$$', name)
        let value = target.value
        let validStr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        switch (name) {
            case 'new_username':
                if (value.length < 6 || value.length > 12) {
                    console.log('长度不符')
                }
                for (let i = 0; i < value.length; i++) {
                    if (!validStr.includes(value[i])) {
                        console.log('含有不合法字符')
                    }
                }
                break
            case 'new_password':
                if (value.length < 6 || value.length > 15) {
                    console.log('长度不符')
                }
                for (let i = 0; i < value.length; i++) {
                    if (!validStr.includes(value[i])) {
                        console.log('含有不合法字符')
                    }
                }
                break
            case 'confirm_pwd':
                let pwd = document.querySelector("input[name='new_password']")
                if (value !== pwd.value) {
                    console.log('密码不符')
                }
                break
            default:
                console.log('email')
        }
    }

    render() {
        let warn = null
        if (this.state.warn === true) {
            warn = (
                <Alert
                    message="注册失败"
                    description="请检查用户名或密码！"
                    type="error"
                    closable
                    onClose={this.onClose}
                />
            )
        }
        return (
            <div className={'content registerPage'}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>注册</Breadcrumb.Item>
                </Breadcrumb>
                <form className={'registerBox'}>
                    {warn}
                    <label><Icon type="user" style={{fontSize: '23px'}}/> <Input required={true} size={'large'}
                                                                                 name={'new_username'}
                                                                                 placeholder="请输入用户名"
                                                                                 onChange={this.debounce(this.change, 300).bind(this)}/><br/><span>用户名由数字或字母组成，长度6~12位。</span></label><br/>
                    <label><Icon type="unlock" style={{fontSize: '23px'}}/> <Input required={true} size={'large'}
                                                                                   type={'password'}
                                                                                   name={'new_password'}
                                                                                   onChange={this.debounce(this.change, 300).bind(this)}
                                                                                   placeholder="请输入密码"/><br/><span>密码由数字或字母组成，长度6~15位。</span></label><br/>
                    <label><Icon type="lock" style={{fontSize: '23px'}}/> <Input required={true} size={'large'}
                                                                                 type={'password'}
                                                                                 name={'confirm_pwd'}
                                                                                 onChange={this.debounce(this.change, 300).bind(this)}
                                                                                 placeholder="请再次输入密码"/><br/><span>请再次确认您输入的密码。</span></label><br/>
                    <label><Icon type="mail" style={{fontSize: '23px'}}/> <Input required={true} size={'large'}
                                                                                 name={'new_email'}
                                                                                 onChange={this.debounce(this.change, 300).bind(this)}
                                                                                 placeholder="请输入电子邮箱"/><br/><span>请输入您的电子邮箱，我们将保证绝不公开！</span></label><br/>
                    <Button onClick={this.registerCheck} block={true} htmlType={'submit'}
                            type="primary">注册</Button><br/>
                </form>
            </div>
        )
    }
}

export default Register