import React from 'react'
import {
    Avatar,
    Button,
    Breadcrumb,
    Menu,
    Dropdown,
    Icon,
    Spin,
    Tooltip,
    Timeline,
    Upload,
    message,
    Tabs,
    Input
} from 'antd';
import {Link} from 'react-router-dom'
import {changeTitle, debounce, error ,success} from "../utilities"
import axios from 'axios'
import qs from 'qs'

const TabPane = Tabs.TabPane;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    console.log(file)
    console.log(file.type)
    const isJPG = file.type === 'image/jpeg' || 'image/png'
    if (!isJPG) {
        message.error('仅支持上传JPG及PNG图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片大小不能超过2MB!');
    }
    return isJPG && isLt2M;
}

class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmState: null,
            currentState: null,
            newState: null,
            nickState: null,
            nickname: null
        }
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }

    componentDidMount() {
        changeTitle('用户设置')
        axios.get('http://0.0.0.0:2000/api/get-nickname')
            .then((response) => {
                if (response.data !== false) {
                    this.setState({
                        nickname: response.data
                    })
                }
            })
            .catch((err) => {
                error('昵称获取失败，请稍候重试！')
                console.log(err)
            })
    }

    logout = () => {
        console.log('logout')
        this.props.history.push('/login')
        document.location.reload()
    }

    change = (target) => {
        let name = target.name
        let value = target.value
        let pattern
        switch (name) {
            case 'currentPwd':
                pattern = /^[A-Za-z0-9]{6,15}$/
                if (pattern.test(value)) {
                    this.setState({
                        currentState: {background: 'rgb(230, 255, 237)'}
                    })
                } else {
                    this.setState({
                        currentState: {background: 'rgb(255, 238, 240)'}
                    })
                }
                break
            case 'newPwd':
                pattern = /^[A-Za-z0-9]{6,15}$/
                let current = document.querySelector("input[name='currentPwd']")
                if (pattern.test(value)) {
                    if (value === current.value) {
                        this.setState({
                            newState: {background: 'rgb(255, 238, 240)'}
                        })
                        error('新密码不能与当前密码相同！')
                    } else {
                        this.setState({
                            newState: {background: 'rgb(230, 255, 237)'}
                        })
                    }
                } else {
                    this.setState({
                        newState: {background: 'rgb(255, 238, 240)'}
                    })
                }
                break
            case 'nickname':
                pattern = /^[\d\w\u4e00-\u9fa5_]{2,12}$/
                if (pattern.test(value)) {
                    this.setState({
                        nickState: {background: 'rgb(230, 255, 237)'}
                    })
                } else {
                    this.setState({
                        nickState: {background: 'rgb(255, 238, 240)'}
                    })
                }
                break
            default:
                let pwd = document.querySelector("input[name='newPwd']")
                if (value !== pwd.value && value.length > 6) {
                    this.setState({
                        confirmState: {background: 'rgb(255, 238, 240)'}
                    })
                } else {
                    this.setState({
                        confirmState: {background: 'rgb(230, 255, 237)'}
                    })
                }
        }
    }

    submit = (e) => {
        e.preventDefault()
        let current = document.querySelector("input[name='currentPwd']")
        let newPwd = document.querySelector("input[name='newPwd']")
        let confirm = document.querySelector("input[name='confirmNewPwd']")
        let changeData = {
            current: current.value,
            newPwd: newPwd.value,
            confirm: confirm.value
        }
        axios.post('http://0.0.0.0:2000/api/checkChange', qs.stringify(changeData))
            .then((response) => {
                if (response.data === 'fail') {
                    error('更改失败，请稍候重试！')
                } else {
                    success('密码更新成功')
                    setTimeout(() => this.logout(), 1000)
                }
            })
            .catch((err) => {
                error('糟糕，出现未知错误，请稍候重试！')
                console.log(err)
            })
    }

    changeNickname = () => {
        let name = document.querySelector("input[name='nickname']")
        if (name.value.length < 2 || name.value.length > 12) {
            error('昵称长度不符！')
            this.setState({
                nickState: {background: 'rgb(255, 238, 240)'}
            })
        } else {
            let nickname = {nickname: name.value}
            axios.post('http://0.0.0.0:2000/api/change-nickname', qs.stringify(nickname))
                .then((response) => {
                    if (response.data !== 'fail') {
                        success('昵称修改成功')
                        this.setState({
                            nickState: null,
                            nickname: name.value
                        })
                        name.value = ''
                    } else {
                        error('修改失败，请稍候重试')
                    }
                })
                .catch((err) => {
                    error('糟糕，出现未知错误，请稍候重试！')
                    console.log(err)
                })
        }
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return (
            <div className={'content profile'}>
                <Breadcrumb style={{marginTop: '5px'}}>
                    <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to={'/my-summary'}>用户主页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>用户设置</Breadcrumb.Item>
                </Breadcrumb>
                <div className={'setting-tabs'}>
                    <Tabs tabPosition={'left'} size={'large'}>
                        <TabPane tab="头像设置" key="1">
                            <div className={'upload-tab'}>
                                <span className={'title'}>上传头像</span>
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="http://0.0.0.0:2000/upload-head"
                                    beforeUpload={beforeUpload}
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img style={{width: '100px', height: '100px'}} src={imageUrl}
                                                     alt="avatar"/> : uploadButton}
                                </Upload>
                                <ul>
                                    <li>
                                        仅支持上传JPG、PNG格式的图片。
                                    </li>
                                    <li>
                                        图片大小不能超过2M。
                                    </li>
                                </ul>
                            </div>
                        </TabPane>
                        <TabPane tab="修改密码" key="2">
                            <form method={'post'}>
                                <span className={'title'}>修改密码</span><br/>
                                <label htmlFor={'currentPwd'}>当前密码：</label><Input required={true}
                                                                                  onChange={debounce(this.change, 300).bind(this)}
                                                                                  name={'currentPwd'} size="large"
                                                                                  type={'password'}
                                                                                  style={this.state.currentState}
                                                                                  placeholder="请输入当前密码。"/>
                                <label htmlFor={'newPwd'}>新密码：</label><Input required={true}
                                                                             onChange={debounce(this.change, 300).bind(this)}
                                                                             name={'newPwd'}
                                                                             size="large"
                                                                             type={'password'}
                                                                             style={this.state.newState}
                                                                             placeholder="新密码由数字或字母组成，长度6~15位。"/>
                                <label htmlFor={'newPwd'}>确认密码：</label><Input required={true}
                                                                              onChange={debounce(this.change, 300).bind(this)}
                                                                              name={'confirmNewPwd'} size="large"
                                                                              type={'password'}
                                                                              style={this.state.confirmState}
                                                                              placeholder="请再次确认您的密码。"/>
                                <Button type={'primary'} size={'large'} htmlType={'submit'}
                                        onClick={this.submit}>提交更改</Button>
                            </form>
                        </TabPane>
                        <TabPane tab="昵称更改" key="3">
                            <div className={'update-nickname'}>
                                <span className={'title'}>更改昵称</span><br/>
                                <span style={{fontSize: '17px', marginBottom: '20px'}}>当前昵称：<strong className={'nickname'}>{this.state.nickname}</strong></span>
                                <label htmlFor={'nickname'}>新的昵称：</label><Input required={true}
                                                                                style={this.state.nickState}
                                                                                onChange={debounce(this.change, 300).bind(this)}
                                                                                name={'nickname'} size="large"
                                                                                placeholder="新昵称由2-12个字符组成，只能包含中文、数字、字母及下划线 _ "/>
                                <Button type={'primary'} size={'large'}
                                        onClick={this.changeNickname}>提交更改</Button>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
export default Setting