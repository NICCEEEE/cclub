import React from 'react'
// const ReactMarkdown = require('react-markdown');
import '../assets/css/Markdown.css'
import {Drawer, Input, Icon, Switch, Tooltip, Button, Menu, Dropdown} from 'antd';


class Markdown extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            placement: 'bottom',
            selectedBoard: null,
            preview: true,
            fullScreen: false,
        }
    }

    handleMenuClick = (e) => {
        console.log(e.item.props.children);
        this.setState({
            selectedBoard: e.item.props.children
        })
    }

    onClose = () => {
        this.props.Home.setState({
            drawerVisible: false,
        })
        this.setState({
            selectedBoard: null,
            preview: true,
            fullScreen: false,
        })
    };

    switchBox = (checked) => {
        console.log(`switch to ${checked}`);
        this.setState({
            preview: !this.state.preview
        })
    }

    changeScreen = () => {
        this.setState({
            fullScreen: !this.state.fullScreen
        })
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">灌水交流</Menu.Item>
                <Menu.Item key="2">技术讨论</Menu.Item>
                <Menu.Item key="3">建议反馈</Menu.Item>
            </Menu>
        );
        return (
            <div className={'createTopic'}>
                <Drawer
                    title="新建主题帖"
                    maskClosable={false}
                    destroyOnClose={true}
                    placement={this.state.placement}
                    closable={false}
                    visible={this.props.Home.state.drawerVisible}
                    height={this.state.fullScreen ? 1024 : 512}
                >
                    <div className={'titleBox'}>
                        <Input name={'topicTitle'} addonBefore="您的标题:" size="large" placeholder="标题字数不能超过32个字符"/>
                        <Dropdown overlay={menu}>
                            <Button size={'large'}>
                                {this.state.selectedBoard ? this.state.selectedBoard : '选择板块'}<Icon type="down"/>
                            </Button>
                        </Dropdown>
                        <Button size={'large'} type="primary">发表</Button>
                        <Tooltip placement="topRight" title={'关闭后您的输入将被清空！'}>
                            <Button size={'large'} type="danger" onClick={this.onClose}>关闭</Button>
                        </Tooltip>
                    </div>
                    <ul className={'toolBox'}>
                        <li title={'加粗'}><Icon type="bold"/></li>
                        <li title={'斜体'}><Icon type="italic"/></li>
                        <li title={'删除线'}><Icon type="strikethrough"/></li>
                        <li title={'无序列表'}><Icon type="bars"/></li>
                        <li title={'有序列表'}><Icon type="ordered-list"/></li>
                        <li title={'添加链接'}><Icon type="link"/></li>
                        <li title={'插入图片'}><Icon type="picture"/></li>
                        {
                            this.state.fullScreen ?
                                <li title={'退出高屏'} onClick={this.changeScreen}><Icon type="caret-down" /></li> :
                                <li title={'高屏显示'} onClick={this.changeScreen}><Icon type="caret-up" /></li>

                        }
                        <li className={'switch'}>
                            <Tooltip placement="top" title={'文本预览'}>
                                <Switch onChange={(checked) => this.switchBox(checked)} checkedChildren="开"
                                        unCheckedChildren="关" defaultChecked/>
                            </Tooltip>
                        </li>
                    </ul>
                    <div className={'writingBox'}>
                        <div className={this.state.preview ? 'inputBox' : 'noPreview inputBox'}>
                            <Input.TextArea rows={this.state.fullScreen ? 27 : 10}/>
                        </div>
                        <div className={this.state.preview ? 'previewBox' : 'noPreview previewBox'}>
                            <Input.TextArea style={{backgroundColor: 'snow'}} rows={this.state.fullScreen ? 27 : 10} readOnly={true}/>
                        </div>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default Markdown