import React from 'react'
import {Link} from 'react-router-dom'
import {Avatar, Icon, Tooltip} from 'antd';
import '../assets/css/Topic.css'
import moment from 'moment/min/moment-with-locales';


class Topic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            author_head: null,
            last_head: null,
        }
    }


    render() {
        let board = this.props.detail.board
        let icon
        let color
        let bgc
        if (board === '灌水交流') {
            color = '#8ACF00'
            bgc = 'honeydew'
            icon = <Icon type="message" theme="twoTone" twoToneColor={color}/>
        } else if (board === '技术讨论') {
            color = "#f92672"
            bgc = 'lavenderblush'
            icon = <Icon type="rocket" theme="twoTone" twoToneColor={color}/>
        } else if (board === '建议&反馈') {
            color = "#0092FF"
            bgc = 'azure'
            icon = <Icon type="setting" theme="twoTone" twoToneColor={color}/>
        }
        return (
            <div className={'topicBox'}>
                <Tooltip placement="left" title={this.props.detail.author}>
                    <Avatar size={70} src={`http://0.0.0.0:2000/avatar_by_id/${this.props.detail.uid}`}
                            icon="user" className={'userHead'}/>
                </Tooltip>
                <div className={'topicBox-1'}>
                    <p className={'topicTitle'}><Link style={{wordBreak: 'break-word'}}
                                                      to={{
                                                          pathname: `/topic/${this.props.detail.tid}`,
                                                          state: this.props.detail.tid
                                                      }}>{this.props.detail.title}</Link>
                    </p>
                    <p className={'topicBottom'}>
                        <span className={'topicBoard'}>
                            {icon}<span style={{cursor: 'pointer', color: 'dodgerblue', fontWeight: 'bold'}}
                                        onClick={() => this.props.Home.handleBoardTab(this.props.tab)}>&nbsp;{board}</span>
                        </span>&nbsp;•&nbsp;
                        <Tooltip placement="top" title={moment(this.props.detail.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                            <span>{moment(this.props.detail.ct * 1000).fromNow()}</span>
                        </Tooltip>&nbsp;•&nbsp;
                        <span style={{fontWeight: 'bold'}} className={'topicAuthor'}><Link to={{
                            pathname: `/user-summary-${this.props.detail.author}`,
                            state: {username: this.props.detail.author, uid: this.props.detail.uid}
                        }}>{this.props.detail.author}</Link></span>
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
                <div className={'topicBox-3'} style={{borderLeft: color.concat(' 3px solid'), backgroundColor: bgc}}>
                    {
                        this.props.detail.last_comment_author ? (<p>
                            <Tooltip placement="top" title={this.props.detail.last_comment_author}>
                                <Avatar className={'lastCommentAuthor'} size="small"
                                        icon="user"
                                        src={`http://0.0.0.0:2000/avatar_by_id/${this.props.detail.last_comment_id}`}/>
                            </Tooltip>
                            <Tooltip placement="top"
                                     title={moment(this.props.detail.last_comment_time * 1000).format('YYYY年M月D日Ah点mm分')}>
                                <span className={'lastCommentTime'}
                                      style={{paddingLeft: '5px'}}>{moment(this.props.detail.last_comment_time * 1000).fromNow()}</span>
                            </Tooltip>
                        </p>) : null
                    }
                    <p className={'commentPreview'} style={{overflow: 'hidden'}}>
                        {this.props.detail.last_comment_content ? this.props.detail.last_comment_content : '尚无回复'}
                    </p>
                </div>
            </div>
        )
    }
}

export default Topic