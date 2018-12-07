import React from 'react'
import {Breadcrumb, Icon, Input, Button, message} from 'antd';
import {Link} from 'react-router-dom'
import '../assets/css/Register.css'

const success = () => {
    message.config({
        top: '6%',
        duration: 3,
    })
    message.success('注册成功！准备跳转。');
};
const error = () => {
    message.config({
        top: '6%',
        duration: 3,
    })
    message.error('注册失败，请重新尝试！');
};
class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userState: null,
            pwdState: null,
            confirmState: null,
            emailState: null,
            style: {
                error: {
                    background: 'rgb(255, 238, 240)'
                },
                success: {
                    background: 'rgb(230, 255, 237)'
                }
            }
        }
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
            error()
        } else {
            success()
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
        let value = target.value
        let pattern
        switch (name) {
            case 'new_username':
                pattern = /^[A-Za-z0-9]{6,12}$/
                if (pattern.test(value)) {
                    this.setState({
                        userState: {background: 'rgb(230, 255, 237)'}
                    })
                } else {
                    this.setState({
                        userState: {background: 'rgb(255, 238, 240)'}
                    })
                }
                break
            case 'new_password':
                pattern = /^[A-Za-z0-9]{6,15}$/
                if (pattern.test(value)) {
                    this.setState({
                        pwdState: {background: 'rgb(230, 255, 237)'}
                    })
                } else {
                    this.setState({
                        pwdState: {background: 'rgb(255, 238, 240)'}
                    })
                }
                break
            case 'confirm_pwd':
                let pwd = document.querySelector("input[name='new_password']")
                if (value !== pwd.value) {
                    this.setState({
                        confirmState: {background: 'rgb(255, 238, 240)'}
                    })
                } else {
                    this.setState({
                        confirmState: {background: 'rgb(230, 255, 237)'}
                    })
                }
                break
            default:
                pattern = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
                if (pattern.test(value)) {
                    this.setState({
                        emailState: {background: 'rgb(230, 255, 237)'}
                    })
                } else {
                    this.setState({
                        emailState: {background: 'rgb(255, 238, 240)'}
                    })
                }
        }
    }

    render() {
        return (
            <div className={'content registerPage'}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>注册</Breadcrumb.Item>
                </Breadcrumb>
                <form className={'registerBox'} action={'/register'} method={'post'}>
                    <label><Icon type="user" style={{fontSize: '20px'}}/> <span style={{fontSize: '20px'}}>用户名:</span>
                        <Input required={true} size={'large'}
                               name={'new_username'}
                               placeholder="请输入用户名"
                               style={this.state.userState}
                               onChange={this.debounce(this.change, 300).bind(this)}/><br/><span>用户名由数字或字母组成，长度6~12位。</span></label><br/>
                    <label><Icon type="unlock" style={{fontSize: '20px'}}/> <span style={{fontSize: '20px'}}>密码:</span>
                        <Input required={true} size={'large'}
                               type={'password'}
                               name={'new_password'}
                               style={this.state.pwdState}
                               onChange={this.debounce(this.change, 300).bind(this)}
                               placeholder="请输入密码"/><br/><span>密码由数字或字母组成，长度6~15位。</span></label><br/>
                    <label><Icon type="lock" style={{fontSize: '20px'}}/> <span style={{fontSize: '20px'}}>再次确认:</span>
                        <Input required={true} size={'large'}
                               type={'password'}
                               name={'confirm_pwd'}
                               style={this.state.confirmState}
                               onChange={this.debounce(this.change, 300).bind(this)}
                               placeholder="请再次输入密码"/><br/><span>请再次确认您输入的密码。</span></label><br/>
                    <label><Icon type="mail" style={{fontSize: '20px'}}/> <span style={{fontSize: '20px'}}>邮箱:</span>
                        <Input required={true} size={'large'}
                               name={'new_email'}
                               onChange={this.debounce(this.change, 300).bind(this)}
                               style={this.state.emailState}
                               placeholder="请输入电子邮箱"/><br/><span>请输入您的电子邮箱，我们将保证绝不公开！</span></label><br/>
                    <Button onClick={this.registerCheck} block={true} htmlType={'submit'}
                            type="primary">注册</Button><br/>
                </form>
            </div>
        )
    }
}

export default Register