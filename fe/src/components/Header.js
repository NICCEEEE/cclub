import React from 'react'
import {Button, Input} from 'antd';
import '../assets/css/Header.css';
import {Link} from 'react-router-dom';

const Search = Input.Search;

class Header extends React.Component {
    search = (query) => {
        let url = 'https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&ch=&tn=baidu&bar=&wd='
        window.open(url + query)
    }
    render() {
        return (
            <header>
                <Link to={'/'}>
                    <img src={require('../assets/images/logo.png')} alt={'logo'}/>
                </Link>
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
            </header>
        )
    }
}

export default Header