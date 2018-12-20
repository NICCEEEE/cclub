import React from 'react'
import {Button, Input} from 'antd';
import '../assets/css/Header.css';
import {Link, withRouter} from 'react-router-dom';
import axios from 'axios'
import {error} from "../utilities"

const Search = Input.Search;
axios.defaults.withCredentials = true;

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginStatus: 'fail',
            username: null,
            uid: null
        }
    }

    search = (query) => {
        let url = 'https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&ch=&tn=baidu&bar=&wd='
        window.open(url + query)
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
                        loginStatus: response.data.username,
                        username: response.data.username,
                        uid: response.data.uid
                    })
                }
            })
            .catch((err) => {
                error('糟糕，出现未知异常，请稍候尝试！')
                console.log(err)
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
                <div className={'buttonGroup'}>
                    <Link to={{pathname: `/my-summary`, state: {uid: this.state.uid}}}><Button>{this.state.loginStatus}</Button></Link>
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
                        <div className={'buttonGroup'}>
                            <Search
                                placeholder="百度一下，你就知道"
                                onSearch={value => this.search(value)}
                                enterButton
                            />
                        </div>
                    </div>
                    {head}
                </div>
            </header>
        )
    }
}

export default withRouter(Header)