import React from 'react'
import {Avatar, Button, DatePicker, Breadcrumb, Input, Menu, Dropdown, Icon, Spin, Tooltip, Timeline} from 'antd';
import {Link} from 'react-router-dom'
import moment from 'moment/min/moment-with-locales';
import axios from 'axios'
import qs from 'qs'
import {error, success} from "../utilities"

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

function onChange(date, dateString) {
    console.log(dateString);
}

class Edit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: null
        }
    }

    componentDidMount() {
        axios.get('http://0.0.0.0:2000/my-summary')
            .then((response) => {
                if (response.data === 'false') {
                    error('载入错误')
                } else {
                    this.setState({
                        summary: response.data
                    })
                }
            })
            .catch((err) => {
                error('糟糕，出现了未知错误，请稍候重试！')
                console.log(err)
            })
    }

    saveProfile = (e) => {
        e.preventDefault()
        let website = document.querySelector("input[name='website']")
        let job = document.querySelector("input[name='job']")
        let location = document.querySelector("input[name='location']")
        let birthday = document.querySelector(".ant-calendar-picker-input")
        let github = document.querySelector("input[name='github']")
        let steam = document.querySelector("input[name='steam']")
        let twitter = document.querySelector("input[name='twitter']")
        let data = {
            website: website.value,
            job: job.value,
            location: location.value,
            birthday: birthday.value,
            github: github.value,
            steam: steam.value,
            twitter: twitter.value,
        }
        axios.post('http://0.0.0.0:2000/save-profile', qs.stringify(data))
            .then((response) => {
                if (response.data === 'fail') {
                    error('更新错误，请稍候重试！')
                } else {
                    success('更新成功')
                    document.location.reload()
                }
            })
            .catch((err) => {
                error('糟糕，出现了未知错误，请稍候重试！')
                console.log(err)
            })
    }

    render() {
        if (this.state.summary === null) {
            return <Spin style={{marginTop: '90px'}} size="large"/>
        } else {
            let website = this.state.summary.website
            let job = this.state.summary.job
            let location = this.state.summary.location
            let birthday = this.state.summary.birthday
            let github = this.state.summary.github
            let steam = this.state.summary.steam
            let twitter = this.state.summary.twitter
            return (
                <div className={'content profile'}>
                    <Breadcrumb style={{marginTop: '5px'}}>
                        <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={'/my-summary'}>用户主页</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>资料编辑</Breadcrumb.Item>
                    </Breadcrumb>
                    <form action={'/save-profile'} method={'post'} className={'edit-container'}>
                        <div>
                            <label>
                                <Icon type="user"/>&nbsp;用户名：
                            </label><Input size="large" disabled={true} defaultValue={this.state.summary.username}/>
                        </div>
                        <div>
                            <label>
                                <Icon type="mail"/>&nbsp;邮箱：
                            </label><Input size="large" disabled={true} defaultValue={this.state.summary.email}/>
                        </div>
                        <div>
                            <label htmlFor="website"><Icon type="global"/>&nbsp;网站：</label><Input name={'website'}
                                                                                                  size="large"
                                                                                                  defaultValue={website ? website : null}
                                                                                                  placeholder="个人网站"/>
                        </div>
                        <div>
                            <label htmlFor="job"><Icon type="tool"/>&nbsp;工作：</label><Input name={'job'} size="large"
                                                                                            defaultValue={job ? job : null}
                                                                                            placeholder="目前工作"/>
                        </div>
                        <div>
                            <label htmlFor="location"><Icon type="environment"/>&nbsp;地区：</label><Input
                            name={'location'}
                            size="large"
                            defaultValue={location ? location : null}
                            placeholder="所在地区"/>
                        </div>
                        <div>
                            <label htmlFor="birthday"><Icon type="clock-circle"/>&nbsp;生日：</label><DatePicker
                            defaultValue={birthday ? moment(birthday, 'YYYY-MM-DD') : null}
                            name={'birthday'} placeholder="选择日期"
                            size='large' onChange={onChange}/>
                        </div>
                        <div>
                            <label htmlFor="github"><img alt={'github'}
                                                         src={require('../assets/images/github.png')}/>&nbsp;Github：</label><Input
                            defaultValue={github ? github : null}
                            name={'github'} size="large" placeholder="Github ID"/>
                        </div>
                        <div>
                            <label htmlFor="steam"><img alt={'steam'}
                                                        src={require('../assets/images/steam.png')}/>&nbsp;Steam：</label><Input
                            defaultValue={steam ? steam : null}
                            name={'steam'} size="large" placeholder="Steam ID"/>
                        </div>
                        <div>
                            <label htmlFor="twitter"><img alt={'twitter'}
                                                          src={require('../assets/images/twitter.png')}/>&nbsp;Twitter：</label><Input
                            defaultValue={twitter ? twitter : null}
                            name={'twitter'} size="large"
                            placeholder="推特 ID"/>
                        </div>
                        <div>
                            <label><Button onClick={this.saveProfile} htmlType={'submit'}
                                           type="primary">保存更改</Button></label>
                        </div>
                    </form>
                </div>
            )
        }
    }
}

export default Edit