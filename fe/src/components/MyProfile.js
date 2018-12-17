import React from 'react'
import '../assets/css/MyProfile.css'
import { Avatar, Button, Breadcrumb } from 'antd';
import {Link} from 'react-router-dom'

class MyProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className={'profile-container'}>
                <div className={'head'}>
                    <img className={'cover'} src={require('../assets/images/back3.png')}/>
                    <Avatar size={128} style={{ color: 'white', fontSize: '70px', backgroundColor: '#2196f3' }}>N</Avatar>
                    <Button size='large' icon='appstore' shape="circle" type='primary'/>
                </div>
                <div className={'content profile'}>
                    <Breadcrumb style={{marginTop: '5px'}}>
                        <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>个人主页</Breadcrumb.Item>
                    </Breadcrumb>
                    <span className={'username'}>{this.props.location.state.username}</span>
                </div>
            </div>
        )
    }
}

export default MyProfile