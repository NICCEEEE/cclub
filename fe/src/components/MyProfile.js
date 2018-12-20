import React from 'react'
import '../assets/css/MyProfile.css'
import {Avatar, Button, Breadcrumb, Menu, Dropdown, Icon, Spin, Tooltip, Timeline} from 'antd';
import {Link, Route, Redirect, Switch} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment/min/moment-with-locales';
import {error, changeTitle} from "../utilities"
import Summary from "./Summary"
import Edit from "./Edit"
import Notify from "./Notify"
import Message from "./Message"
import Setting from "./Setting"

class MyProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: null,
        }
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="1"><Link to={'/my-summary/edit'}><Icon type="edit"
                                                                       theme="filled"/>&nbsp;&nbsp;编辑</Link></Menu.Item>
                <Menu.Item key="2"><Link to={'/my-summary/notification'}><Icon type="bell"
                                                                               theme="filled"/>&nbsp;&nbsp;通知</Link></Menu.Item>
                <Menu.Item key="3"><Link to={'/my-summary/message'}><Icon type="mail"
                                                                          theme="filled"/>&nbsp;&nbsp;私信</Link></Menu.Item>
                <Menu.Item key="4"><Link to={'/my-summary/setting'}><Icon type="setting"
                                                                          theme="filled"/>&nbsp;&nbsp;设置</Link></Menu.Item>
            </Menu>
        );
        return (
            <div className={'profile-container'}>
                <div className={'head'}>
                    <img alt={'cover'} className={'cover'} src={require('../assets/images/back3.png')}/>
                    <Avatar size={128} icon="user" src={`http://0.0.0.0:2000/avatar`}/>
                    <Dropdown overlay={menu} placement="bottomCenter">
                        <Button style={{backgroundColor: 'rgb(51, 122, 183)', borderColor: 'rgb(51, 122, 183)'}}
                                size='large' icon='appstore' shape="circle" type='primary'/>
                    </Dropdown>
                </div>
                <Route exact path={'/my-summary'} component={Summary}/>
                <Route path={'/my-summary/edit'} component={Edit}/>
                <Route path={'/my-summary/notification'} component={Notify}/>
                <Route path={'/my-summary/message'} component={Message}/>
                <Route path={'/my-summary/setting'} component={Setting}/>
            </div>
        )
    }
}

export default MyProfile

