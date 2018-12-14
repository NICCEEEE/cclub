import React from 'react'
import {Breadcrumb, Icon, Input, Button, Tooltip} from 'antd';
import {Link} from 'react-router-dom'
import '../assets/css/Register.css'
import axios from 'axios'
import qs from 'qs'
import {Motion, spring} from 'react-motion';
import {error, success, changeTitle, debounce, getCodeword, changeCodeword} from "../utilities"

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userState: null,
            pwdState: null,
            confirmState: null,
            emailState: null,
            answerState: null,
            problem: {
                problem: '',
                cid: -1,
            },
            degree: 0,
        }
    }

    registerCheck = (e) => {
        e.preventDefault()
        let user = document.querySelector("input[name='new_username']")
        let pwd = document.querySelector("input[name='new_password']")
        let confirm_pwd = document.querySelector("input[name='confirm_pwd']")
        let email = document.querySelector("input[name='new_email']")
        let codeword = document.querySelector("input[name='answer']")
        const validUser = /^[A-Za-z0-9]{6,12}$/
        const validPwd = /^[A-Za-z0-9]{6,15}$/
        const validEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        const validAnswer = /^[-]?[0-9]+$/
        const warn = (words) => {
            error(words)
            user.value = ''
            pwd.value = ''
            confirm_pwd.value = ''
            email.value = ''
            codeword.value = ''
            this.setState({
                userState: {background: 'rgb(255, 238, 240)'},
                pwdState: {background: 'rgb(255, 238, 240)'},
                confirmState: {background: 'rgb(255, 238, 240)'},
                emailState: {background: 'rgb(255, 238, 240)'},
                answerState: {background: 'rgb(255, 238, 240)'},
            })
            getCodeword.bind(this)()
        }
        if (validUser.test(user.value)) {
            if (validPwd.test(pwd.value)) {
                if (confirm_pwd.value === pwd.value) {
                    if (validEmail.test(email.value)) {
                        if (validAnswer.test(codeword.value)) {
                            let data = {
                                new_username: user.value,
                                new_password: pwd.value,
                                confirm_pwd: confirm_pwd.value,
                                new_email: email.value,
                                answer: codeword.value,
                                cid: this.state.problem.cid,
                            }
                            axios.post('http://0.0.0.0:2000/register', qs.stringify(data))
                                .then((response) => {
                                    if (response.data === 'True') {
                                        success('注册成功！即将跳转。')
                                        setTimeout(() => this.props.history.push('/login'), 1000)
                                    } else {
                                        warn('注册失败，请重新尝试！')
                                    }
                                })
                                .catch((err) => {
                                    error('糟糕，出现未知异常，请稍候尝试！')
                                    console.log(err);
                                })
                        } else {
                            warn('注册失败，请重新尝试！')
                        }
                    } else {
                        warn('注册失败，请重新尝试！')
                    }
                } else {
                    warn('注册失败，请重新尝试！')
                }
            } else {
                warn('注册失败，请重新尝试！')
            }
        } else {
            warn('注册失败，请重新尝试！')
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
                    axios.get(`http://0.0.0.0:2000/api/username/${value}`)
                        .then((response) => {
                            if (response.data === 'username exist') {
                                error('用户名不合法或已存在，请重新输入')
                                this.setState({
                                    userState: {background: 'rgb(255, 238, 240)'}
                                })
                            } else {
                                this.setState({
                                    userState: {background: 'rgb(230, 255, 237)'}
                                })
                            }
                        })
                        .catch((err) => {
                            error('糟糕，出现未知异常，请稍候尝试！')
                            console.log(err)
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
            case 'answer':
                pattern = /^[-]?[0-9]+$/
                if (pattern.test(value)) {
                    axios.get(`http://0.0.0.0:2000/api/codeword/solution?cid=${this.state.problem.cid}&answer=${value}`)
                        .then((response) => {
                            if (response.data === 'False') {
                                this.setState({
                                    answerState: {background: 'rgb(255, 238, 240)'}
                                })
                            } else {
                                this.setState({
                                    answerState: {background: 'rgb(230, 255, 237)'}
                                })
                            }
                        })
                        .catch((err) => {
                            error('糟糕，出现未知异常，请稍候尝试！')
                            console.log(error)
                        })
                } else {
                    this.setState({
                        answerState: {background: 'rgb(255, 238, 240)'}
                    })
                }
                break
            default:
                pattern = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
                if (pattern.test(value)) {
                    axios.get(`http://0.0.0.0:2000/api/email/${value}`)
                        .then((response) => {
                            if (response.data === 'email exist') {
                                error('邮箱不合法或已被注册，请重新输入')
                                this.setState({
                                    emailState: {background: 'rgb(255, 238, 240)'}
                                })
                            } else {
                                this.setState({
                                    emailState: {background: 'rgb(230, 255, 237)'}
                                })
                            }
                        })
                        .catch((err) => {
                            error('糟糕，出现未知异常，请稍候尝试！')
                            console.log(error)
                        })
                } else {
                    this.setState({
                        emailState: {background: 'rgb(255, 238, 240)'}
                    })
                }
        }
    }

    componentDidMount() {
        changeTitle('注册新用户')
        getCodeword.bind(this)()
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
                               onChange={debounce(this.change, 300).bind(this)}/><br/><span>用户名由数字或字母组成，长度6~12位。</span></label><br/>
                    <label><Icon type="unlock" style={{fontSize: '20px'}}/> <span style={{fontSize: '20px'}}>密码:</span>
                        <Input required={true} size={'large'}
                               type={'password'}
                               name={'new_password'}
                               style={this.state.pwdState}
                               onChange={debounce(this.change, 300).bind(this)}
                               placeholder="请输入密码"/><br/><span>密码由数字或字母组成，长度6~15位。</span></label><br/>
                    <label><Icon type="lock" style={{fontSize: '20px'}}/> <span style={{fontSize: '20px'}}>再次确认:</span>
                        <Input required={true} size={'large'}
                               type={'password'}
                               name={'confirm_pwd'}
                               style={this.state.confirmState}
                               onChange={debounce(this.change, 300).bind(this)}
                               placeholder="请再次输入密码"/><br/><span>请再次确认您输入的密码。</span></label><br/>
                    <label><Icon type="mail" style={{fontSize: '20px'}}/> <span style={{fontSize: '20px'}}>邮箱:</span>
                        <Input required={true} size={'large'}
                               name={'new_email'}
                               onChange={debounce(this.change, 300).bind(this)}
                               style={this.state.emailState}
                               placeholder="请输入电子邮箱"/><br/><span>请输入您的电子邮箱，我们将保证绝不公开！</span></label><br/>
                    <label><Icon type="calculator" style={{fontSize: '20px'}}/> <span
                        style={{fontSize: '20px'}}>验证码:</span>
                        <Input name={'problem'} disabled={true}
                               placeholder={this.state.problem.problem.concat(" = ?")}/>
                        <Motion defaultStyle={{degree: 0}} style={{degree: spring(this.state.degree)}}>
                            {({degree}) => <Tooltip placement="bottom" title={'点击换一题'}><Icon
                                onClick={changeCodeword.bind(this)}
                                style={{
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    transform: `rotate(${degree}deg`
                                }}
                                type="reload"/></Tooltip>}
                        </Motion>
                        <span style={{fontSize: '20px', marginLeft: '15px'}}>答案:</span><Input required={true}
                                                                                              size={'large'}
                                                                                              name={'answer'}
                                                                                              onChange={debounce(this.change, 300).bind(this)}
                                                                                              style={this.state.answerState}
                                                                                              placeholder="答案"/></label><br/>
                    <Button onClick={this.registerCheck} block={true} htmlType={'submit'}
                            type="primary">注册</Button><br/>
                </form>
            </div>
        )
    }
}

export default Register