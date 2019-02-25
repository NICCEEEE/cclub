import React from 'react'
import {Button, Input, Avatar, Tooltip, Badge, Icon, Popconfirm} from 'antd';
import '../assets/css/Header.css';
import {Link} from 'react-router-dom';
import axios from 'axios'
import {error} from "../utilities"

const Search = Input.Search;
axios.defaults.withCredentials = true;

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginStatus: 'fail',
            uid: null,
            msgCount: 0,
            notifyCount: 0
        }
    }

    search = (query) => {
        let url = 'https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&ch=&tn=baidu&bar=&wd='
        window.open(url + query)
    }

    closeConfirm = () => {
        return true
    }

    logout = () => {
        let res = this.closeConfirm()
        if (res === true) {
            axios.get('http://0.0.0.0:2000/api/logout')
                .then((response) => {
                    if (response.data !== false) {
                        window.history.pushState(null, null, '/login')
                        document.location.reload()
                        console.log(response.data)
                    } else {
                        error('登出失败，请稍候重试！')
                    }
                })
                .catch((err) => {
                    error('糟糕，出现未知异常，请稍候重试！')
                    console.log(err)
                })
        }
    }

    componentWillMount() {
        axios.get('http://0.0.0.0:2000/api/user')
            .then((response) => {
                if (response.data === 'fail') {
                    this.setState({
                        loginStatus: response.data
                    })
                } else {
                    this.setState({
                        loginStatus: response.data.nickname,
                        uid: response.data.uid
                    })
                }
            })
            .catch((err) => {
                error('糟糕，出现未知异常，请稍候尝试！')
                console.log(err)
            })
        axios.get('http://0.0.0.0:2000/api/msg-notify-count')
            .then((response) => {
                if (response.data !== 'fail') {
                    this.setState({
                        msgCount: response.data.msg,
                        notifyCount: response.data.notify,
                    })
                }
            })
    }

    render() {
        let head
        if (this.state.loginStatus === 'fail') {
            head = (
                <div className={'buttonGroup'}>
                    <Link to={'/register'}>
                        <Button type="primary">注册</Button>
                    </Link>
                    <Link to={'/login'}>
                        <Button>登录</Button>
                    </Link>
                </div>
            )
        } else {
            head = (
                <div className={'userStatus'}>
                    <Popconfirm placement="bottom" title={'您确定要退出登录吗？'} onConfirm={this.logout}
                                okText="确定" cancelText="取消">
                        <Tooltip plactment={'bottom'} title='登出'>
                            <span>
                                <Icon type="logout" style={{fontSize: '25px'}}/>
                            </span>
                        </Tooltip>
                    </Popconfirm>
                    <Badge count={this.state.notifyCount}>
                        <Tooltip plactment={'bottom'}
                                 title={this.state.notifyCount === 0 ? '通知' : `您有${this.state.notifyCount}条通知未读`}>
                            <div>
                                <Link style={{color: 'black'}} to={'/my-summary/notification'}>
                                    <Icon type="bell" style={{fontSize: '25px'}}/>
                                </Link>
                            </div>
                        </Tooltip>
                    </Badge>
                    <Badge count={this.state.msgCount}>
                        <Tooltip plactment={'bottom'}
                                 title={this.state.msgCount === 0 ? '私信' : `您有${this.state.msgCount}条通知未读`}>
                            <div>
                                <Link style={{color: 'black'}} to={'/my-summary/message'}>
                                    <Icon type="mail" style={{fontSize: '25px'}}/>
                                </Link>
                            </div>
                        </Tooltip>
                    </Badge>
                    <Tooltip placement="bottom" title={this.state.loginStatus}>
                        <div>
                            <Link to={{pathname: `/my-summary`, state: {uid: this.state.uid}}}>
                                <Avatar size={50} src={`http://0.0.0.0:2000/avatar_by_id/${this.state.uid}`}
                                        icon={'user'}/>
                            </Link>
                        </div>
                    </Tooltip>
                </div>
            )
        }
        return (
            <header>
                <div className={'headContent'}>
                    <div className={'headLeft'}>
                        <Link to={'/'}>
                            <img src={require('../assets/images/logo.svg')} alt={'logo'}/>
                        </Link>
                        {/*<div className={'buttonGroup'}>*/}
                            <Search
                                placeholder="Search"
                                onSearch={value => this.search(value)}
                                enterButton
                            />
                            <Link style={{fontSize: '25px', margin: '10px'}} to={{pathname: '/asm', state: {uid: this.state.uid}}}>
                                <Icon title={'汇编实验楼'} type="experiment" />
                            </Link>
                        {/*</div>*/}
                    </div>
                    {head}
                </div>
            </header>
        )
    }
}

export default Header