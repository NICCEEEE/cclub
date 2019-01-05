import React from 'react'
import {Breadcrumb, Spin, Tooltip, Timeline} from 'antd';
import {Link, Redirect} from 'react-router-dom'
import moment from 'moment/min/moment-with-locales';
import {changeTitle, error} from "../utilities"
import axios from 'axios'

class Summary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: null,
            redirect: null
        }
    }

    checkTopicTime = (topicTime) => {
        let currentTime = new Date().getTime() / 1000
        let lastTime = currentTime - 604800
        return topicTime > lastTime
    }

    componentDidMount() {
        axios.get(`http://0.0.0.0:2000/my-summary`)
            .then((response) => {
                if (response.data !== false) {
                    this.setState({
                        summary: response.data
                    })
                    changeTitle('用户主页')
                } else {
                    this.setState({
                        redirect: 'redirect'
                    })
                }
            })
            .catch((err) => {
                error('糟糕！出现了未知异常，请稍候重试！')
                console.log(err)
            })
    }

    render() {
        if (this.state.redirect === 'redirect') {
            return <Redirect to={'/'}/>
        }
        if (this.state.summary === null) {
            return <Spin style={{marginTop: '90px'}} size="large"/>
        } else {
            let recent_topices = []
            for (let t = 0; t < this.state.summary.publish_topices.length; t++) {
                if (this.checkTopicTime(parseFloat(this.state.summary.publish_topices[t].ct))) {
                    recent_topices.push(this.state.summary.publish_topices[t])
                }
            }
            recent_topices.reverse()
            return (
                <div className={'content profile'}>
                    <Breadcrumb style={{marginTop: '5px'}}>
                        <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>用户主页</Breadcrumb.Item>
                    </Breadcrumb>
                    <span className={'account-name'}>{this.state.summary.username}</span>
                    <strong style={{margin: '15px 0px', fontSize: '20px'}}
                            className={'account-nickname'}>@{this.state.summary.nickname}</strong>
                    <div className={'account-status'}>
                        <div className={'topic-count'}>
                            <span className={'count'}>{this.state.summary.topices}</span><br/><span
                            className={'countTitle'}>发布主题</span>
                        </div>
                        <div className={'reply-count'}>
                            <span className={'count'}>{this.state.summary.replies}</span><br/><span
                            className={'countTitle'}>回复主题</span>
                        </div>
                        <div className={'read-count'}>
                            <span className={'count'}>{this.state.summary.views}</span><br/><span
                            className={'countTitle'}>浏览主题</span>
                        </div>
                        <div className={'give-count'}>
                            <span className={'count'}>{this.state.summary.give_votes}</span><br/><span
                            className={'countTitle'}>送出的赞</span>
                        </div>
                        <div className={'receive-count'}>
                            <span className={'count'}>{this.state.summary.receive_votes}</span><br/><span
                            className={'countTitle'}>收到的赞</span>
                        </div>
                    </div>
                    <div className={'account-info'}>
                        <Tooltip placement="top"
                                 title={moment(this.state.summary.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                <span className={'register-time'}>注册时间&nbsp;<span
                                    style={{fontWeight: 'bold'}}>{moment(this.state.summary.ct * 1000).fromNow()}</span></span>
                        </Tooltip>
                        <Tooltip placement="top"
                                 title={moment(this.state.summary.active_time * 1000).format('YYYY年M月D日Ah点mm分')}>
                                <span style={{marginLeft: '20px'}} className={'register-time'}>最后活动&nbsp;<span
                                    style={{fontWeight: 'bold'}}>{moment(this.state.summary.active_time * 1000).fromNow()}</span></span>
                        </Tooltip>
                    </div>
                    <div className={'account-topics'}>
                        <span className={'account-name'}>{this.state.summary.username}&nbsp;最近发布的帖子</span>
                        {
                            recent_topices.length > 0 ? null : <div className={'topic-info'}>
                                此用户最近未进行发言。
                            </div>
                        }
                        {
                            recent_topices.length > 0 ?
                                <Timeline mode="alternate" className={'recent-topic'}>
                                    {
                                        recent_topices.map((value, index) => {
                                            return (
                                                <Timeline.Item key={index} color={['blue', 'green', 'red'][index % 3]}>
                                                    <Link to={{pathname: `/topic/${value.tid}`, state: value.tid}}>
                                                        <Tooltip placement="top"
                                                                 title={moment(value.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                                            <span
                                                                style={{color: 'black'}}>{moment(value.ct * 1000).fromNow()}</span><br/>
                                                        </Tooltip>
                                                        {value.title}
                                                    </Link>
                                                </Timeline.Item>
                                            )
                                        })
                                    }
                                </Timeline>
                                : null
                        }
                    </div>
                </div>
            )
        }

    }
}

export default Summary