import React from 'react'
import {Button, Breadcrumb, Menu, Dropdown, Icon, Tooltip, Collapse} from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios'
import {error, success} from "../utilities"
import moment from 'moment/min/moment-with-locales';

const Panel = Collapse.Panel;
const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
};

class Notify extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: '所有消息',
            all: [],
            system: [],
            reply: [],
            vote: []
        }
    }

    handleMenuClick = (e) => {
        this.setState({
            selected: e.item.props.children
        })
    }

    readAll = () => {
        let cuurent = this.state.selected
        switch (cuurent) {
            case '系统消息':
                let system = this.state.system
                for (let i = 0; i < system.length; i++) {
                    system[i].read = true
                }
                axios.get(`http://0.0.0.0:2000/api/read-all?type=system`)
                    .then((response) => {
                        if (response.data !== 'fail') {
                            this.setState({
                                system: system
                            })
                        }
                    })
                    .catch((err) => {
                        error('糟糕，出现未知异常，请稍候重试！')
                        console.log(err)
                    })
                break
            case '用户回帖':
                let reply = this.state.reply
                for (let i = 0; i < reply.length; i++) {
                    reply[i].read = true
                }
                axios.get(`http://0.0.0.0:2000/api/read-all?type=reply`)
                    .then((response) => {
                        if (response.data !== 'fail') {
                            this.setState({
                                reply: reply
                            })
                        }
                    })
                    .catch((err) => {
                        error('糟糕，出现未知异常，请稍候重试！')
                        console.log(err)
                    })
                break
            case '用户点赞':
                let vote = this.state.vote
                for (let i = 0; i < vote.length; i++) {
                    vote[i].read = true
                }
                axios.get(`http://0.0.0.0:2000/api/read-all?type=upvote`)
                    .then((response) => {
                        if (response.data !== 'fail') {
                            this.setState({
                                vote: vote
                            })
                        }
                    })
                    .catch((err) => {
                        error('糟糕，出现未知异常，请稍候重试！')
                        console.log(err)
                    })
                break
            default:
                let all = this.state.all
                for (let i = 0; i < all.length; i++) {
                    all[i].read = true
                }
                axios.get(`http://0.0.0.0:2000/api/read-all?type=all`)
                    .then((response) => {
                        if (response.data !== 'fail') {
                            this.setState({
                                all: all
                            })
                        }
                    })
                    .catch((err) => {
                        error('糟糕，出现未知异常，请稍候重试！')
                        console.log(err)
                    })
        }
    }

    componentDidMount() {
        axios.get('http://0.0.0.0:2000/notification')
            .then((response) => {
                if (response.data !== 'fail') {
                    let system = []
                    let reply = []
                    let vote = []
                    response.data.reverse()
                    for (let i = 0; i < response.data.length; i++) {
                        let type = response.data[i].type
                        if (type === 'system') {
                            system.push(response.data[i])
                        } else if (type === 'reply') {
                            reply.push(response.data[i])
                        } else if (type === 'vote') {
                            vote.push(response.data[i])
                        }
                    }
                    this.setState({
                        all: response.data,
                        system: system,
                        reply: reply,
                        vote: vote
                    })
                }
            })
            .catch((err) => {
                error('获取消息列表失败，请稍候重试')
                console.log(err)
            })
    }

    readClick = (nid) => {
        let all = this.state.all
        for (let i = 0; i < all.length; i++) {
            if (all[i].nid === nid) {
                if (all[i].read === true) {
                    break
                } else {
                    all[i].read = true
                    axios.get(`http://0.0.0.0:2000/api/read-notify/${nid}`)
                        .then((response) => {
                            if (response.data !== 'fail') {
                                this.setState({
                                    all: all
                                })
                            }
                        })
                        .catch((err) => {
                            error('糟糕，出现未知异常！请稍候重试')
                            console.log(err)
                        })
                    break
                }
            }
        }
    }

    removeNotify = (nid) => {
        axios.get(`http://0.0.0.0:2000/api/remove-notify/${nid}`)
            .then((response) => {
                if (response.data === false) {
                    error('删除失败，请稍候重试！')
                } else {
                    let all = this.state.all
                    for (let i = 0; i < all.length; i++) {
                        if (all[i].nid === nid) {
                            all.splice(i, 1)
                            this.setState({
                                all: all
                            })
                            break
                        }
                    }
                    success('通知删除成功！')
                }
            })
            .catch((err) => {
                error('糟糕，出现未知异常，请稍候重试！')
                console.log(err)
            })
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">所有消息</Menu.Item>
                <Menu.Item key="2">系统消息</Menu.Item>
                <Menu.Item key="3">用户回帖</Menu.Item>
                <Menu.Item key="4">用户点赞</Menu.Item>
            </Menu>
        );
        let detail = null
        switch (this.state.selected) {
            case '系统消息':
                if (this.state.system.length === 0) {
                    detail = (
                        <div className={'none-notify'}>
                            暂无通知
                        </div>
                    )
                } else {
                    detail = (
                        <Collapse accordion className={'notify-detail'} bordered={false}>
                            {
                                this.state.system.map((value, index) => {
                                    let head = (
                                        <div className={'panel-head'}>
                                            <span>
                                                <span className={'status'}>
                                                    {value.read ? '已读' : '未读'}
                                                    </span>
                                                {value.title}
                                                </span>
                                            <Tooltip placement="top"
                                                     title={moment(value.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                                <span
                                                    style={{marginRight: '20px'}}>{moment(value.ct * 1000).fromNow()}</span>
                                            </Tooltip>
                                        </div>
                                    )
                                    return (
                                        <Panel header={head} key={index} style={customPanelStyle}>
                                            <p>{value.detail}</p>
                                            <div style={{textAlign: 'right'}}>
                                                <Button onClick={() => this.removeNotify(value.nid)} type={'primary'}
                                                        shape={'circle'} size={'large'} icon={'delete'}/>
                                            </div>
                                        </Panel>
                                    )
                                })
                            }
                        </Collapse>
                    )
                }
                break
            case '用户回帖':
                if (this.state.reply.length === 0) {
                    detail = (
                        <div className={'none-notify'}>
                            暂无通知
                        </div>
                    )
                } else {
                    detail = (
                        <Collapse accordion className={'notify-detail'} bordered={false}>
                            {
                                this.state.reply.map((value, index) => {
                                    let head = (
                                        <div onClick={() => this.readClick(value.nid)}
                                             className={'panel-head'}><span><span
                                            className={'status'}>{value.read ? '已读' : '未读'}</span>{value.title}</span>
                                            <Tooltip placement="top"
                                                     title={moment(value.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                                <span
                                                    style={{marginRight: '20px'}}>{moment(value.ct * 1000).fromNow()}</span>
                                            </Tooltip>
                                        </div>
                                    )
                                    return (
                                        <Panel header={head} key={index} style={customPanelStyle}>
                                            <p>{value.detail}</p>
                                            <div style={{textAlign: 'right'}}>
                                                <Button onClick={() => this.removeNotify(value.nid)} type={'primary'}
                                                        shape={'circle'} size={'large'} icon={'delete'}/>
                                            </div>
                                        </Panel>
                                    )
                                })
                            }
                        </Collapse>
                    )
                }
                break
            case '用户点赞':
                if (this.state.vote.length === 0) {
                    detail = (
                        <div className={'none-notify'}>
                            暂无通知
                        </div>
                    )
                } else {
                    detail = (
                        <Collapse accordion className={'notify-detail'} bordered={false}>
                            {
                                this.state.vote.map((value, index) => {
                                    let head = (
                                        <div onClick={() => this.readClick(value.nid)}
                                             className={'panel-head'}><span><span
                                            className={'status'}>{value.read ? '已读' : '未读'}</span>{value.title}</span>
                                            <Tooltip placement="top"
                                                     title={moment(value.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                                <span
                                                    style={{marginRight: '20px'}}>{moment(value.ct * 1000).fromNow()}</span>
                                            </Tooltip>
                                        </div>
                                    )
                                    return (
                                        <Panel header={head} key={index} style={customPanelStyle}>
                                            <p>{value.detail}</p>
                                            <div style={{textAlign: 'right'}}>
                                                <Button onClick={() => this.removeNotify(value.nid)} type={'primary'}
                                                        shape={'circle'} size={'large'} icon={'delete'}/>
                                            </div>
                                        </Panel>
                                    )
                                })
                            }
                        </Collapse>
                    )
                }
                break
            default:
                if (this.state.all.length === 0) {
                    detail = (
                        <div className={'none-notify'}>
                            暂无通知
                        </div>
                    )
                } else {
                    detail = (
                        <Collapse accordion className={'notify-detail'} bordered={false}>
                            {
                                this.state.all.map((value, index) => {
                                    let head = (
                                        <div onClick={() => this.readClick(value.nid)}
                                             className={'panel-head'}><span><span
                                            className={'status'}>{value.read ? '已读' : '未读'}</span>{value.title}</span>
                                            <Tooltip placement="top"
                                                     title={moment(value.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                                <span
                                                    style={{marginRight: '20px'}}>{moment(value.ct * 1000).fromNow()}</span>
                                            </Tooltip>
                                        </div>
                                    )
                                    return (
                                        <Panel header={head} key={index} style={customPanelStyle}>
                                            <p>{value.detail}</p>
                                            <div style={{textAlign: 'right'}}>
                                                <Button onClick={() => this.removeNotify(value.nid)} type={'primary'}
                                                        shape={'circle'} size={'large'} icon={'delete'}/>
                                            </div>
                                        </Panel>
                                    )
                                })
                            }
                        </Collapse>
                    )
                }
                break
        }
        return (
            <div className={'content profile'}>
                <Breadcrumb style={{marginTop: '5px'}}>
                    <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to={'/my-summary'}>用户主页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>通知中心</Breadcrumb.Item>
                </Breadcrumb>
                <div className={'notify-tabs'}>
                    <div className={'button-group'}>
                        <Button onClick={this.readAll} size={'large'}>全部标为已读</Button>
                        <Dropdown overlay={menu}>
                            <Button type={'primary'} size={'large'} style={{marginLeft: 8}}>
                                {this.state.selected}<Icon type="down"/>
                            </Button>
                        </Dropdown>
                    </div>
                    {detail}
                </div>
            </div>
        )
    }
}

export default Notify