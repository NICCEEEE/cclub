import React from 'react'
import {Button, Spin, Input, Modal, Tabs, Icon} from 'antd';
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import {error, success} from "../utilities"
import '../assets/css/RootPage.css'
import qs from 'qs'

const {TextArea} = Input;
const confirm = Modal.confirm;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class RootPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rooter: null
        }
    }

    clear = () => {
        confirm({
            title: '确定要重置码？',
            content: '重置后，所有已编辑内容将被清空！',
            okText: '确认清空',
            cancelText: '取消',
            onOk() {
                let inputs = [...document.querySelectorAll('.ant-input')].slice(1)
                inputs.forEach((value, index) => {
                    inputs[index].value = ''
                })
            },
        });
    }

    submit = () => {
        let data = {
            title: document.querySelector('.ant-input[name=acm-title]').value,
            difficult: document.querySelector('.ant-input[name=acm-difficult]').value,
            content: document.querySelector('.ant-input[name=acm-content]').value,
            answer: document.querySelector('.ant-input[name=acm-answer]').value
        }
        for (let key in data) {
            if (data[key].length === 0) {
                error('请补全内容后再提交！')
                return
            }
        }
        axios.post('http://0.0.0.0:2000/api/create-test', qs.stringify(data))
            .then((res) => {
                if (res.data === 'success') {
                    success('创建成功!')
                    let inputs = [...document.querySelectorAll('.ant-input')].slice(1)
                    inputs.forEach((value, index) => {
                        inputs[index].value = ''
                    })
                } else {
                    return Promise.reject('提交异常!请稍候重试')
                }
            })
            .catch((err) => {
                error('提交异常!请稍候重试')
                console.log(err)
            })
    }

    essence = () => {
        let tid = this.refs.essenceId.value
        const valid = /^[0-9]{5,12}$/
        if (valid.test(tid)) {
            axios.get(`http://0.0.0.0:2000/api/essence/${tid}`)
                .then((response) => {
                    if (response.data === false) {
                        error('加精失败')
                    } else {
                        success('加精成功')
                        this.refs.essenceId.value = null
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            error('帖子ID有误')
        }
        console.log(this.refs.essenceId.value)
    }

    delTopic = () => {
        let tid = this.refs.delTopicId.value
        const valid = /^[0-9]{5,12}$/
        if (valid.test(tid)) {
            axios.get(`http://0.0.0.0:2000/api/delTopic/${tid}`)
                .then((response) => {
                    if (response.data === false) {
                        error('删除失败')
                    } else {
                        success('删除成功')
                        this.refs.delTopicId.value = null
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            error('帖子ID有误')
        }
        console.log(this.refs.delTopicId.value)
    }

    componentDidMount() {
        axios.get('http://0.0.0.0:2000/api/isRooter')
            .then((response) => {
                if (response.data === false) {
                    this.setState({
                        rooter: 'redirect'
                    })
                } else {
                    this.setState({
                        rooter: 'rooter'
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        if (this.state.rooter === null) {
            return <Spin style={{marginTop: '90px'}} size="large"/>
        } else if (this.state.rooter === 'redirect') {
            return <Redirect to={'/'}/>
        }
        return (
            <div className={'rootPage'} style={{marginTop: '100px'}}>
                <div className={'essenceTopic'}>
                    <Button onClick={this.essence} type="primary">帖子加精</Button>
                    <input ref={'essenceId'} placeholder={'输入帖子ID'}/>
                </div>
                <hr/>
                <div className={'delTopic'}>
                    <Button onClick={this.delTopic} type="primary">删除帖子</Button>
                    <input ref={'delTopicId'} placeholder={'输入帖子ID'}/>
                </div>
                <form className={'createTest'}>
                    <h2>创建新的实验题目</h2>
                    <div className={'form-acm-title'}>
                        <label htmlFor={'acm-title'}>实验标题：</label>
                        <Input name={'acm-title'} size="large" placeholder="请输入实验标题..." required/>
                    </div>
                    <div className={'form-acm-difficult'}>
                        <label htmlFor={'acm-difficult'}>实验难度：</label>
                        <Input name={'acm-difficult'} size="large" placeholder="请输入实验难度..." required/>
                    </div>
                    <div className={'form-acm-content'}>
                        <label htmlFor={'acm-content'}>实验描述：</label>
                        <TextArea name={'acm-content'} rows={6} placeholder="请输入实验内容...(支持markdown语法)" required/>
                    </div>
                    <div className={'form-acm-answer'}>
                        <label htmlFor={'acm-answer'}>实验解答：</label>
                        <TextArea name={'acm-answer'} rows={6} placeholder="请输入实验解答...(支持markdown语法)" required/>
                    </div>
                    <Button onClick={this.clear} size={'large'} type="danger" ghost>重置内容</Button>
                    <Button onClick={this.submit} size={'large'} type="primary" ghost>提交创建</Button>
                </form>
            </div>
        )
    }
}

export default RootPage