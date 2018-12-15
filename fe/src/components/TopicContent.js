import React from 'react'
import '../assets/css/TopicContent.css'
import {Breadcrumb, Icon, Avatar, Tag, Button, Tooltip, Menu, Dropdown, Spin, Modal, notification, Comment} from 'antd';
import {Link} from 'react-router-dom'
import Markdown from 'react-markdown'
import CodeBlock from '../code-block'
import axios from 'axios'
import TopicBox from "./TopicBox"
import {error} from "../utilities"
import {Redirect} from 'react-router-dom'
import moment from 'moment';

axios.defaults.withCredentials = true;
const confirm = Modal.confirm;
const openNotificationWithIcon = (type) => {
    notification[type]({
        message: '复制成功 🎉',
        description: '链接链接复制成功，快去分享吧：）',
    });
};

class TopicContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            content: null,
            drawerVisible: false,
            parent: 'TopicContent',
            isVote: 'rgb(200, 200, 200)',
        }
    }

    showConfirm = (word) => {
        let w = word ? word : '回复'
        confirm({
            title: '亲，你还没有登录哦！',
            content: `只有登录的用户才可以${w}呢，是否要去登录呢？`,
            cancelText: '再逛逛',
            okText: '去登录',
            okButtonProps: {href: 'http://localhost:3000/login'},
            onOk() {
                return <Redirect to={'/login'}/>
            },
        })
    }
    replyBox = () => {
        axios.get('http://0.0.0.0:2000/api/user')
            .then((response) => {
                if (response.data === 'fail') {
                    this.showConfirm()
                } else {
                    this.setState({
                        drawerVisible: true
                    })
                }
            })
            .catch((err) => {
                error('糟糕，出现未知异常，请稍候尝试！')
                console.log(err)
            })
    }
    copyUrl = (e) => {
        let Url = document.location.href
        let oInput = document.createElement('input');
        oInput.value = Url;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.remove()
        e.target.style.color = 'brown'
        e.target.style.transition = 'all .5s'
        openNotificationWithIcon('success')
    }
    isVoteUp = () => {
        let tid = this.props.location.state ? this.props.location.state : this.props.location.pathname.split('/').reverse()[0]
        axios.get(`http://0.0.0.0:2000/api/upVote/${tid}`)
            .then((response) => {
                if (response.data === true) {
                    this.setState({
                        isVote: '#fd971f'
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    componentDidMount() {
        let tid = this.props.location.state ? this.props.location.state : this.props.location.pathname.split('/').reverse()[0]
        axios.get(`http://0.0.0.0:2000/topic/${tid}`)
            .then((response) => {
                this.setState({
                    content: response.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
        this.isVoteUp()
    }

    upVote = () => {
        let tid = this.props.location.state ? this.props.location.state : this.props.location.pathname.split('/').reverse()[0]
        axios.get(`http://0.0.0.0:2000/upvote/${tid}`)
            .then((response) => {
                if (response.data === 'fail') {
                    this.showConfirm('点赞')
                } else {
                    let icon = document.querySelectorAll('.anticon-like path')[1]
                    icon.style.fill = '#fd971f'
                    icon.style.transition = 'all .5s'
                }
            })
            .catch((err) => {
                console.log(err)
            })
        console.log('click')
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">正序</Menu.Item>
                <Menu.Item key="2">倒序</Menu.Item>
            </Menu>
        )
        if (this.state.content === null) {
            return <Spin size="large"/>
        } else {
            return (
                <div className={'content TopicPage'}>
                    <Breadcrumb style={{marginTop: '15px', flexBasis: '75%'}}>
                        <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={'/'}>{this.state.content.board}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.content.title}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={'content-title'}>
                        <Icon type="tags" theme="filled"/>&nbsp;{this.state.content.title}
                    </div>
                    <div className={'author-block'}>
                        <Avatar size={70} className={'userHead'}
                                style={{color: '#8ACF00', backgroundColor: 'honeydew'}}>N</Avatar>
                        <div className={'content-detail'}>
                            <div className={'topicInfo'}>
                                <div className={'info-left'}>
                                    <Tag color="cyan">楼主</Tag><a>{this.state.content.author}</a>&nbsp;•&nbsp;
                                    <span>{this.state.content.ct}</span>&nbsp;•&nbsp;发布于&nbsp;<Tag
                                    color="geekblue">{this.state.content.board}</Tag>
                                </div>
                                <div className={'info-right'}>
                                    <div className={'vote'}>
                                        <span className={'count'}>{this.state.content.vote}</span><br/><span
                                        className={'countTitle'}>点赞</span>
                                    </div>
                                    <div className={'comments'}>
                                        <span className={'count'}>{this.state.content.comments}</span><br/><span
                                        className={'countTitle'}>回复</span>
                                    </div>
                                    <div className={'views'}>
                                        <span className={'count'}>{this.state.content.views}</span><br/><span
                                        className={'countTitle'}>浏览</span>
                                    </div>
                                </div>
                            </div>
                            <Markdown className={'content-article'}
                                      source={this.state.content.content}
                                      skipHtml={true}
                                      escapeHtml={true}
                                      renderers={{code: CodeBlock}}/>
                            <div className={'bottom-info'}>
                                <div className={'bottom-left'}>
                                    <Button onClick={this.replyBox} size={'large'} type="primary">回复主题</Button>
                                    <Dropdown overlay={menu}>
                                        <Button size={'large'} style={{marginLeft: '5px'}}>
                                            排序<Icon type="down"/>
                                        </Button>
                                    </Dropdown>
                                </div>
                                <div className={'bottom-right'}>
                                    <Tooltip placement="bottom" title={'点赞'}>
                                    <span><Icon onClick={this.upVote} style={{fontSize: '25px'}} type="like"
                                                theme="twoTone"
                                                twoToneColor={this.state.isVote}/></span>
                                    </Tooltip>
                                    <Tooltip placement="top" title={'分享'}>
                                    <span><Icon onClick={this.copyUrl}
                                                style={{fontSize: '25px', color: 'rgb(200, 200, 200)'}}
                                                type="share-alt"/></span>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.content.comment.map( (value, index) => {
                            return (
                                <div key={index} className={'comment-block'}>
                                    <Avatar size={70} className={'userHead'}
                                            style={{color: '#8ACF00', backgroundColor: 'honeydew'}}>N</Avatar>
                                    <div className={'comment-detail'}>
                                        <div className={'comment-top'}>
                                            <div className={'comment-top-left'}>
                                                {
                                                    value.uid === this.state.content.uid ? <Tag color="cyan">楼主</Tag> : null
                                                }
                                                <a>{value.username}</a>&nbsp;•&nbsp;
                                                <Tooltip placement="top" title={new Date(value.ct * 1000).toDateString()}>
                                                    <span>{moment(value.ct * 1000).fromNow()}</span>
                                                </Tooltip>
                                            </div>
                                            <div className={'comment-top-right'}>
                                                {value.floor}&nbsp;楼
                                            </div>
                                        </div>
                                        <Markdown className={'comment-article'}
                                                  source={value.content}
                                                  skipHtml={true}
                                                  escapeHtml={true}
                                                  renderers={{code: CodeBlock}}/>
                                        <div className={'comment-bottom'}>
                                            <div className={'comment-dislike'}>
                                                <Tooltip placement="bottom" title={'不支持'}>
                                                    <Icon type="dislike" theme="twoTone" twoToneColor="rgb(200, 200, 200)"/>
                                                </Tooltip>
                                                <span className={'dislikeCount'} style={{color: 'firebrick'}}>{value.dislike}</span>
                                            </div>
                                            <div className={'comment-like'}>
                                                <span className={'likeCount'} style={{color: 'limegreen'}}>{value.like}</span>
                                                <Tooltip placement="top" title={'支持'}>
                                                    <Icon type="like" theme="twoTone" twoToneColor="rgb(200, 200, 200)"/>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <TopicBox Parent={this}/>
                </div>
            )
        }
    }
}

export default TopicContent
// ﻿"comment" : [
//     {
//         "username" : "gua123",
//         "uid" : 10000,
//         "content" : "记录，创作，整理，阅读文稿的同时，我们不仅希望它是一个有力的工具，更希望您的思想和知识通过这个平台，连同优质的阅读体验，将他们分享给有相同志趣的人，进而鼓励更多的人来到这里记录分享他们的思想和知识，尝试点击",
//         "like" : 0,
//         "dislike" : 0,
//         "ct" : 1544885783.04244,
//         "floor" : 1
//     },
//     {
//         "username" : "gua123",
//         "uid" : 10001,
//         "content" : "更希望您的思想和知识通过这个平台，连同优质的阅读体验，将他们分享给有相同志趣的人，进而鼓励更多的人来到这里记录分享他们的思想和知识，尝试点击",
//         "like" : 0,
//         "dislike" : 0,
//         "ct" : 1544885883.04244,
//         "floor" : 2
//     }
// ]