import React from 'react'
import {Button, Input} from 'antd';
import '../assets/css/Header.css';
import {Link, withRouter} from 'react-router-dom';
import axios from 'axios'

const Search = Input.Search;
axios.defaults.withCredentials = true;

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginStatus: 'fail',
        }
    }

    search = (query) => {
        let url = 'https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&ch=&tn=baidu&bar=&wd='
        window.open(url + query)
    }

    componentWillMount() {
        axios.get('http://0.0.0.0:2000/api/user')
            .then((response) => {
                this.setState({
                    loginStatus: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        let head
        if (this.state.loginStatus === 'fail') {
            head = (
                <div className={'buttonGroup'}>
                    <Search
                        placeholder="百度一下，你就知道"
                        onSearch={value => this.search(value)}
                        enterButton
                    />
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
                    <Search
                        placeholder="百度一下，你就知道"
                        onSearch={value => this.search(value)}
                        enterButton
                    />
                    <Button>{this.state.loginStatus}</Button>
                </div>
            )
        }
        return (
            <header>
                <Link to={'/'}>
                    <img src={require('../assets/images/logo.svg')} alt={'logo'}/>
                </Link>
                {head}
            </header>
        )
    }
}

export default withRouter(Header)