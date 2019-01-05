import React from 'react'
import '../assets/css/TopicContent.css'
import {
    Breadcrumb,
    Icon,
    Avatar,
    Tag,
    Button,
    Tooltip,
    Menu,
    Dropdown,
    Spin,
    Modal,
    notification,
    Pagination
} from 'antd';
import {Link} from 'react-router-dom'
import Markdown from 'react-markdown'
import CodeBlock from '../code-block'
import axios from 'axios'
import TopicBox from "./TopicBox"
import {error} from "../utilities"
import {Redirect} from 'react-router-dom'
import moment from 'moment/min/moment-with-locales';
import {changeTitle} from "../utilities"

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
            topicContent: null,
            drawerVisible: false,
            parent: 'TopicContent',
            isVote: 'rgb(200, 200, 200)',
            order: null,
            likeStatus: null,
            commentsToSee: [],
            reOrdered: null,
            ordered: null,
            page: 1,
        }
    }

    handleMenuClick = (e) => {
        this.setState({
            order: e.item.props.children
        })
        if (e.item.props.children === '倒序') {
            this.setState({
                commentsToSee: this.state.reOrdered.slice((this.state.page - 1) * 15, (this.state.page - 1) * 15 + 15)
            })
        } else {
            this.setState({
                commentsToSee: this.state.ordered.slice((this.state.page - 1) * 15, (this.state.page - 1) * 15 + 15)
            })
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
    getLikeStatus = () => {
        let tid = this.props.location.state ? this.props.location.state : this.props.location.pathname.split('/').reverse()[0]
        axios.get(`http://0.0.0.0:2000/api/likeStatus/${tid}`)
            .then((response) => {
                if (response.data !== false) {
                    this.setState({
                        likeStatus: response.data
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    dislikeCom = (value) => {
        axios.get(`http://0.0.0.0:2000/dislikeCom/${value.value.cid}`)
            .then((response) => {
                if (response.data === 'not login') {
                    this.showConfirm('点赞')
                } else if (response.data === 'fail') {
                    error('糟糕，出现未知异常，请稍候尝试！')
                } else if (response.data === 'exist') {
                    const openNotificationWithIcon = (type) => {
                        notification[type]({
                            message: '您已经反对过啦~',
                            description: '您已经反对过啦，再到处看看吧：）',
                        });
                    };
                    openNotificationWithIcon('warning')
                } else {
                    // 清除支持状态
                    if (this.state.likeStatus.like[value.value.floor - 1] === true) {
                        let status = this.state.likeStatus
                        status.like[value.value.floor - 1] = false
                        this.setState({
                            likeStatus: status
                        })
                        let likeCount = document.querySelector(`#id-comment-${value.value.cid} .likeCount`)
                        likeCount.innerHTML = parseInt(likeCount.innerHTML) - 1
                    }
                    // 增加反对状态
                    let status = this.state.likeStatus
                    status.dislike[value.value.floor - 1] = true
                    this.setState({
                        likeStatus: status
                    })
                    let likeCount = document.querySelector(`#id-comment-${value.value.cid} .dislikeCount`)
                    likeCount.innerHTML = parseInt(likeCount.innerHTML) + 1
                    console.log('反对成功')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    likeCom = (value) => {
        axios.get(`http://0.0.0.0:2000/likeCom/${value.value.cid}`)
            .then((response) => {
                if (response.data === 'not login') {
                    this.showConfirm('点赞')
                } else if (response.data === 'fail') {
                    error('糟糕，出现未知异常，请稍候尝试！')
                } else if (response.data === 'exist') {
                    const openNotificationWithIcon = (type) => {
                        notification[type]({
                            message: '您已经赞过啦~',
                            description: '您已经赞过啦，非常感谢您的支持，再到处看看吧：）',
                        });
                    };
                    openNotificationWithIcon('warning')
                } else {
                    // 清除反对状态
                    if (this.state.likeStatus.dislike[value.value.floor - 1] === true) {
                        let status = this.state.likeStatus
                        status.dislike[value.value.floor - 1] = false
                        this.setState({
                            likeStatus: status
                        })
                        let likeCount = document.querySelector(`#id-comment-${value.value.cid} .dislikeCount`)
                        likeCount.innerHTML = parseInt(likeCount.innerHTML) - 1
                    }
                    // 增加支持状态
                    let status = this.state.likeStatus
                    status.like[value.value.floor - 1] = true
                    this.setState({
                        likeStatus: status
                    })
                    let likeCount = document.querySelector(`#id-comment-${value.value.cid} .likeCount`)
                    likeCount.innerHTML = parseInt(likeCount.innerHTML) + 1
                    console.log('支持成功')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    upVote = () => {
        let tid = this.props.location.state ? this.props.location.state : this.props.location.pathname.split('/').reverse()[0]
        axios.get(`http://0.0.0.0:2000/upvote/${tid}`)
            .then((response) => {
                if (response.data === 'fail') {
                    this.showConfirm('点赞')
                } else if (response.data === 'exist') {
                    const openNotificationWithIcon = (type) => {
                        notification[type]({
                            message: '您已经赞过啦~',
                            description: '您已经赞过该评论啦，非常感谢您的支持，再到处看看吧：）',
                        });
                    };
                    openNotificationWithIcon('warning')
                } else {
                    let icon = document.querySelectorAll('.anticon-like path')[1]
                    icon.style.fill = '#fd971f'
                    icon.style.transition = 'all .5s'
                    let count = document.querySelector('.info-right .vote .count')
                    count.innerHTML = parseInt(count.innerHTML) + 1
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    changeComments = (pageNumber) => {
        pageNumber = pageNumber - 1
        if (this.state.order === null || this.state.order === '正序') {
            this.setState({
                page: pageNumber + 1,
                commentsToSee: this.state.ordered.slice(pageNumber * 15, pageNumber * 15 + 15)
            })
        } else {
            this.setState({
                page: pageNumber + 1,
                commentsToSee: this.state.reOrdered.slice(pageNumber * 15, pageNumber * 15 + 15)
            })
        }

        window.scrollTo(0, 0)
    }

    componentDidMount() {
        let tid = this.props.location.state ? this.props.location.state : this.props.location.pathname.split('/').reverse()[0]
        axios.get(`http://0.0.0.0:2000/topic/${tid}`)
            .then((response) => {
                this.setState({
                    topicContent: response.data,
                })
                changeTitle(this.state.topicContent.board)
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get(`http://0.0.0.0:2000/api/comment/${tid}`)
            .then((response) => {
                let reverseCopy = response.data.concat()
                reverseCopy.reverse()
                this.setState({
                    ordered: response.data,
                    reOrdered: reverseCopy,
                    commentsToSee: response.data.slice(0, 15)
                })
            })
        this.isVoteUp()
        this.getLikeStatus()
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">正序</Menu.Item>
                <Menu.Item key="2">倒序</Menu.Item>
            </Menu>
        )
        if (this.state.topicContent === null || this.state.likeStatus === null) {
            return <Spin style={{marginTop: '90px'}} size="large"/>
        } else {
            return (
                <div className={'content TopicPage'}>
                    <Breadcrumb style={{marginTop: '15px', flexBasis: '75%'}}>
                        <Breadcrumb.Item>
                            <Link to={'/'}>
                                Home
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to={'/'}>
                                {this.state.topicContent.board}
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {this.state.topicContent.title}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={'content-title'}>
                        <Icon type="tags" theme="filled"/>&nbsp;{this.state.topicContent.title}
                    </div>
                    <div className={'author-block'}>
                        <Avatar src={`http://0.0.0.0:2000/avatar_by_id/${this.state.topicContent.uid}`}
                                className={'userHead'}/>
                        <div className={'content-detail'}>
                            <div className={'topicInfo'}>
                                <div className={'info-left'}>
                                    <Tag color="cyan">
                                        楼主
                                    </Tag>
                                    <Link to={{
                                        pathname: `/user-summary-${this.state.topicContent.author}-${this.state.topicContent.uid}`,
                                        state: {
                                            username: this.state.topicContent.author,
                                            uid: this.state.topicContent.uid
                                        }
                                    }}>
                                        {this.state.topicContent.author}
                                    </Link>&nbsp;•&nbsp;
                                    <Tooltip placement="top"
                                             title={moment(this.state.topicContent.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                        <span>
                                            {moment(this.state.topicContent.ct * 1000).fromNow()}
                                            </span>
                                    </Tooltip>
                                    &nbsp;•&nbsp;发布于&nbsp;
                                    <Tag color="geekblue">
                                        {this.state.topicContent.board}
                                    </Tag>
                                </div>
                                <div className={'info-right'}>
                                    <div className={'vote'}>
                                        <span className={'count'}>
                                            {this.state.topicContent.vote}
                                            </span><br/>
                                        <span className={'countTitle'}>
                                            点赞
                                        </span>
                                    </div>
                                    <div className={'comments'}>
                                        <span className={'count'}>
                                            {this.state.topicContent.comments}
                                            </span><br/>
                                        <span className={'countTitle'}>
                                            回复
                                        </span>
                                    </div>
                                    <div className={'views'}>
                                        <span className={'count'}>
                                            {this.state.topicContent.views}
                                            </span><br/>
                                        <span className={'countTitle'}>
                                            浏览
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Markdown className={'content-article'}
                                      source={this.state.topicContent.content}
                                      skipHtml={true}
                                      escapeHtml={true}
                                      renderers={{code: CodeBlock}}/>
                            <div className={'bottom-info'}>
                                <div className={'bottom-left'}>
                                    <Button icon={'mail'} onClick={this.replyBox}
                                            type="primary">
                                        回复主题
                                    </Button>
                                    <Dropdown overlay={menu}>
                                        <Button>
                                            {this.state.order ? this.state.order : '排序'}<Icon type="down"/>
                                        </Button>
                                    </Dropdown>
                                </div>
                                <div className={'bottom-right'}>
                                    <Tooltip placement="bottom" title={'点赞'}>
                                        <span>
                                            <Icon onClick={this.upVote} style={{fontSize: '25px'}} type="like"
                                                  theme="twoTone"
                                                  twoToneColor={this.state.isVote}/>
                                        </span>
                                    </Tooltip>
                                    <Tooltip placement="top" title={'分享'}>
                                        <span>
                                            <Icon onClick={this.copyUrl}
                                                  style={{fontSize: '25px', color: 'rgb(200, 200, 200)'}}
                                                  type="share-alt"/>
                                        </span>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.commentsToSee.map((value, index) => {
                            return (
                                <div id={`id-comment-${value.cid}`} key={index} className={'comment-block'}>
                                    <Avatar src={`http://0.0.0.0:2000/avatar_by_id/${value.uid}`}
                                            icon={'user'} className={'userHead'}/>
                                    <div className={'comment-detail'}>
                                        <div className={'comment-top'}>
                                            <div className={'comment-top-left'}>
                                                {
                                                    value.uid === this.state.topicContent.uid ?
                                                        <Tag color="cyan">
                                                            楼主
                                                        </Tag> : null
                                                }
                                                <Link to={{
                                                    pathname: `/user-summary-${value.nickname}-${value.uid}`,
                                                    state: value.uid
                                                }}>
                                                    {value.nickname}
                                                </Link>&nbsp;•&nbsp;
                                                <Tooltip placement="top"
                                                         title={moment(value.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                                    <span>
                                                        {moment(value.ct * 1000).fromNow()}
                                                        </span>
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
                                                    <Icon onClick={this.dislikeCom.bind(this, {value})} type="dislike"
                                                          theme="twoTone"
                                                          twoToneColor={this.state.likeStatus.dislike[value.floor - 1] ? "crimson" : "rgb(200, 200, 200)"}/>
                                                </Tooltip>
                                                <span className={'dislikeCount'} style={{color: 'firebrick'}}>
                                                    {value.dislike}
                                                    </span>
                                            </div>
                                            <div className={'comment-like'}>
                                                <span className={'likeCount'} style={{color: 'limegreen'}}>
                                                    {value.like}
                                                    </span>
                                                <Tooltip placement="top" title={'支持'}>
                                                    <Icon onClick={this.likeCom.bind(this, {value})} type="like"
                                                          theme="twoTone"
                                                          twoToneColor={this.state.likeStatus.like[value.floor - 1] ? "lightseagreen" : "rgb(200, 200, 200)"}/>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        this.state.reOrdered.length > 0 ? <div className={'topic-bottom'}>
                            <Pagination defaultPageSize={15} showQuickJumper defaultCurrent={1}
                                        total={this.state.reOrdered.length} onChange={this.changeComments}/>
                            <div className={'topic-bottom-right'}>
                                <Button icon={'mail'} onClick={this.replyBox}
                                        type="primary">
                                    回复主题
                                </Button>
                                <Dropdown overlay={menu}>
                                    <Button>
                                        {this.state.order ? this.state.order : '排序'}<Icon type="down"/>
                                    </Button>
                                </Dropdown>
                            </div>
                        </div> : null
                    }
                    <TopicBox Parent={this}/>
                </div>
            )
        }
    }
}

export default TopicContent
