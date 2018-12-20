import React from 'react'
import {
    Modal,
    Form,
    Avatar,
    Button,
    Breadcrumb,
    Menu,
    Dropdown,
    Icon,
    Spin,
    Tooltip,
    Timeline,
    Input,
    Tabs
} from 'antd';
import {Link} from 'react-router-dom'

const operations = <Button>Extra Action</Button>;
const TabPane = Tabs.TabPane;

function callback(key) {
    console.log(key);
}

class Message extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className={'content profile'}>
                <Breadcrumb style={{marginTop: '5px'}}>
                    <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to={'/my-summary'}>用户主页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>用户私信</Breadcrumb.Item>
                </Breadcrumb>
                <Button type={'primary'} size={'large'}>发起私信</Button>
                <div className={'message-tabs'}>
                    <Tabs tabPosition={'left'} size={'large'}>
                        <TabPane tab="收件箱" key="1">收信箱</TabPane>
                        <TabPane tab="已发送" key="2">已发送</TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default Message