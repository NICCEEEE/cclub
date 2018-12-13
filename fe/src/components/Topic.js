import React from 'react'
import {Avatar, Icon, Tooltip} from 'antd';
import '../assets/css/Topic.css'
// {
//     author: "Nicceeee"
//     board: "用户交流"
//     comments: 33
//     content: ""
//     ct: "2018-12-10 21:21:57"
//     last_comment_author: "游客1"
//     last_comment_content: "有shopify的插件，不过现在阶段还不是很成熟。我们 qtdream.com 做的效果类似有shopify的插件，不过现在阶段还不是很成熟。我们 qtdream.com 做的效果类似"
//     last_comment_time: ""
//     title: "未登录状态下用户的帖子不可见，请问是什么原因？我应该怎么做才能修复呢请老哥们教教我？"
//     views: 112
//     vote: 34
// }
class Topic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let board = this.props.detail.board
        let icon
        let color
        if (board === '灌水交流') {
            color = '#8ACF00'
            icon = <Icon type="message" theme="twoTone" twoToneColor={color}/>
        } else if (board === '技术讨论') {
            color = "#f92672"
            icon = <Icon type="rocket" theme="twoTone" twoToneColor={color}/>
        } else {
            color = "#0092FF"
            icon = <Icon type="setting" theme="twoTone" twoToneColor={color}/>
        }
        return (
            <div className={'topicBox'}>
                <Tooltip placement="left" title={this.props.detail.author}>
                    <Avatar size={70} className={'userHead'}
                            style={{color: '#f56a00', backgroundColor: '#fde3cf'}}>U</Avatar>
                </Tooltip>
                <div className={'topicBox-1'}>
                    <p className={'topicTitle'}><a>{this.props.detail.title}</a></p>
                    <p className={'topicBottom'}>
                        <span className={'topicBoard'}>
                            {icon}<a onClick={() => this.props.Home.handleBoardTab(this.props.tab)}>&nbsp;{board}</a>
                        </span>&nbsp;•&nbsp;
                        <span className={'topicTime'}>{this.props.detail.ct}</span>&nbsp;•&nbsp;
                        <span className={'topicAuthor'}><a>{this.props.detail.author}</a></span>
                    </p>
                </div>
                <div className={'topicBox-2'}>
                    <div className={'vote'}>
                        <span className={'count'} style={{color: color}}>{this.props.detail.vote}</span><br/><span
                        className={'countTitle'}>点赞</span>
                    </div>
                    <div className={'comments'}>
                        <span className={'count'} style={{color: color}}>{this.props.detail.comments}</span><br/><span
                        className={'countTitle'}>回复</span>
                    </div>
                    <div className={'views'}>
                        <span className={'count'} style={{color: color}}>{this.props.detail.views}</span><br/><span
                        className={'countTitle'}>浏览</span>
                    </div>
                </div>
                <div className={'topicBox-3'} style={{borderLeft: color.concat(' 3px solid')}}>
                    <p>
                        <Tooltip placement="top" title={this.props.detail.last_comment_author}>
                            <Avatar className={'lastCommentAuthor'} size="small" style={{backgroundColor: '#87d068'}}
                                    icon="user"/>
                        </Tooltip>
                        <span className={'lastCommentTime'} style={{paddingLeft: '5px'}}>大约5小时之前</span>
                    </p>
                    <p className={'commentPreview'} style={{overflow: 'hidden'}}>
                        {this.props.detail.last_comment_content}
                    </p>
                    {/*<p className={'commentPreview'} style={{overflow: 'hidden'}}>*/}
                    {/*尚无回复*/}
                    {/*</p>*/}
                </div>
            </div>
        )
    }
}

export default Topic