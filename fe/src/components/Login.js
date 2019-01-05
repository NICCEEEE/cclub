import React from 'react'
import {Breadcrumb, Icon, Input, Button, Tooltip} from 'antd';
import {Link, Redirect} from 'react-router-dom'
import '../assets/css/Login.css'
import {error, success, changeTitle, getCodeword, changeCodeword} from "../utilities"
import {Motion, spring} from 'react-motion';
import axios from 'axios'
import qs from 'qs'


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;


class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            warn: false,
            userState: null,
            pwdState: null,
            answerState: null,
            problem: {
                problem: '',
                cid: -1,
            },
            degree: 0,
            loginSuccess: 'fail',
        }
    }

    loginCheck = (e) => {
        e.preventDefault()
        let username = document.querySelector("input[name='username']")
        let password = document.querySelector("input[name='password']")
        let codeword = document.querySelector("input[name='answer']")
        const validUser = /^[A-Za-z0-9]{6,12}$/
        const validPwd = /^[A-Za-z0-9]{6,15}$/
        const validAnswer = /^[-]?[0-9]+$/
        const warn = (words) => {
            error(words)
            username.value = ''
            password.value = ''
            codeword.value = ''
            this.setState({
                userState: {background: 'rgb(255, 238, 240)'},
                pwdState: {background: 'rgb(255, 238, 240)'},
                answerState: {background: 'rgb(255, 238, 240)'},
            })
            getCodeword.bind(this)()
        }
        if (validUser.test(username.value)) {
            if (validPwd.test(password.value)) {
                if (validAnswer.test(codeword.value)) {
                    let data = {
                        username: username.value,
                        password: password.value,
                        answer: codeword.value,
                        cid: this.state.problem.cid,
                    }
                    axios.post('http://0.0.0.0:2000/login', qs.stringify(data))
                        .then((response) => {
                            if (response.data === 'False') {
                                warn('登录失败，请确认您填写的信息后重新尝试！')
                            } else {
                                success('登录成功，欢迎回来，即将跳转。:)')
                                setTimeout(() => this.setState({
                                    loginSuccess: 'success'
                                }), 800)
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else {
                    warn('登录失败，请确认您填写的信息后重新尝试！')
                }
            } else {
                warn('登录失败，请确认您填写的信息后重新尝试！')
            }
        } else {
            warn('登录失败，请确认您填写的信息后重新尝试！')
        }
    }

    componentDidMount() {
        getCodeword.bind(this)()
        changeTitle('正在登录')
    }

    render() {
        if (this.state.loginSuccess === 'success') {
            document.location.reload()
            return (<Redirect to={{pathname: '/', state: {loginStatus: this.state.loginSuccess}}}/>);
        }
        return (
            <div className={'content loginPage'}>
                <Breadcrumb style={{marginTop: '15px'}}>
                    <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>登录</Breadcrumb.Item>
                </Breadcrumb>
                <form className={'loginBox'}>
                    <label><Icon type="user" style={{fontSize: '20px'}}/> <span
                        style={{fontSize: '20px'}}>用户名:</span><Input required={true} size={'large'}
                                                                     style={this.state.userState}
                                                                     name={'username'}
                                                                     placeholder="请输入用户名"/></label><br/>
                    <label><Icon type="lock" style={{fontSize: '20px'}}/> <span
                        style={{fontSize: '20px'}}>密码:</span><Input required={true} size={'large'}
                                                                    style={this.state.pwdState}
                                                                    type={'password'} name={'password'}
                                                                    placeholder="请输入密码"/></label><br/>
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
                                                                                              style={this.state.answerState}
                                                                                              placeholder="答案"/></label><br/>
                    <Button onClick={this.loginCheck} block={true} htmlType={'submit'} type="primary">登录</Button><br/>
                    <span style={{paddingRight: '32%'}}>没有账号？<Link to={'/register'}>前往注册！</Link></span>
                </form>
            </div>
        )
    }
}

export default Login