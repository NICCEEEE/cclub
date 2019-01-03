import React from 'react'
import {Button, Spin} from 'antd';
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import {error, success} from "../utilities"

class RootPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rooter: null
        }
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
            <div style={{marginTop: '100px'}}>
                <div className={'essenceTopic'}>
                    <Button onClick={this.essence} type="primary">帖子加精</Button>
                    <input ref={'essenceId'} placeholder={'输入帖子ID'}/>
                </div>
                <hr/>
                <div className={'delTopic'}>
                    <Button onClick={this.delTopic} type="primary">删除帖子</Button>
                    <input ref={'delTopicId'} placeholder={'输入帖子ID'}/>
                </div>
            </div>
        )
    }
}

export default RootPage