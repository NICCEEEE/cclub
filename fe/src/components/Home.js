import React from 'react'
import {changeTitle} from '../utilities'
import Topic from "./Topic"
import {Pagination, Spin, Tabs, Button, Modal} from 'antd';
import {Redirect} from 'react-router-dom';
import '../assets/css/Home.css'
import axios from 'axios'
import Markdown from "./Markdown"


const confirm = Modal.confirm;

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            topics: [],
            boardAll: [],
            essence: [],
            boardEssence: [],
            talk: [],
            boardTalk: [],
            tech: [],
            boardTech: [],
            bug: [],
            boardBug: [],
            tabKey: '1',
            drawerVisible: false,
        }
    }

    componentWillMount() {
        changeTitle('Home')
    }

    componentDidMount() {
        axios.get('http://0.0.0.0:2000/api/topic')
            .then((response) => {
                let essence = this.state.essence
                let talk = this.state.talk
                let tech = this.state.tech
                let bug = this.state.bug
                for (let i = 0; i < response.data.length; i++) {
                    let data = response.data[i]
                    if (data.board === '灌水交流') {
                        talk.push(data)
                    } else if (data.board === '技术讨论') {
                        tech.push(data)
                    } else if (data.board === '建议&反馈') {
                        bug.push(data)
                    }
                    if (data.essence === true) {
                        essence.push(data)
                    }
                }
                this.setState({
                    topics: response.data,
                    essence: essence,
                    talk: talk,
                    tech: tech,
                    bug: bug,
                    boardAll: response.data.slice(0, 15),
                    boardEssence: this.state.essence.slice(0, 15),
                    boardTalk: this.state.talk.slice(0, 15),
                    boardTech: this.state.tech.slice(0, 15),
                    boardBug: this.state.bug.slice(0, 15)
                })
            })
    }

    onChangeAll = (pageNumber) => {
        pageNumber = pageNumber - 1
        console.log(pageNumber)
        this.setState({
            boardAll: this.state.topics.slice(pageNumber * 15, pageNumber * 15 + 15)
        })
        window.scrollTo(0, 0)
    }
    onChangeEssence = (pageNumber) => {
        pageNumber = pageNumber - 1
        this.setState({
            boardEssence: this.state.essence.slice(pageNumber * 15, pageNumber * 15 + 15)
        })
        window.scrollTo(0, 0)
    }
    onChangeTalk = (pageNumber) => {
        pageNumber = pageNumber - 1
        this.setState({
            boardTalk: this.state.talk.slice(pageNumber * 15, pageNumber * 15 + 15)
        })
        window.scrollTo(0, 0)
    }
    onChangeTech = (pageNumber) => {
        pageNumber = pageNumber - 1
        this.setState({
            boardTech: this.state.tech.slice(pageNumber * 15, pageNumber * 15 + 15)
        })
        window.scrollTo(0, 0)
    }
    onChangeBug = (pageNumber) => {
        pageNumber = pageNumber - 1
        this.setState({
            boardBug: this.state.bug.slice(pageNumber * 15, pageNumber * 15 + 15)
        })
        window.scrollTo(0, 0)
    }
    showConfirm = () => {
        confirm({
            title: '亲，你还没有登录哦！',
            content: '只有登录的用户才可以发帖呢，是否要去登录呢？',
            cancelText: '再逛逛',
            okText: '去登录',
            okButtonProps: {href: 'http://localhost:3000/login'},
            onOk() {
                console.log('OK');
                return <Redirect to={'/login'}/>
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }
    handleBoardTab = (key) => {
        window.scrollTo(0, 0)
        this.setState({
            tabKey: key
        })
    }

    createTopic = () => {
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
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        const operations = <Button onClick={this.createTopic} type="primary" size={'large'}>发表新帖</Button>;
        const TabPane = Tabs.TabPane;
        let loading = null
        if (this.state.topics.length < 1) {
            loading = <Spin size="large"/>
        } else {
            loading = null
        }
        return (
            <div className={'content homePage'}>
                <Tabs animated={{inkBar: true, tabPane: false}} activeKey={this.state.tabKey}
                      onTabClick={key => this.handleBoardTab(key)} tabBarExtraContent={operations} size={'large'}>
                    <TabPane tab="全部" key="1">
                        {loading}
                        <div>
                            {
                                this.state.boardAll.map((value, index) => {
                                    let tabKey = '1'
                                    if (value.board === '灌水交流') {
                                        tabKey = '3'
                                    } else if (value.board === '技术讨论') {
                                        tabKey = '4'
                                    } else if (value.board === '建议&反馈') {
                                        tabKey = '5'
                                    }
                                    return <Topic tab={tabKey} Home={this} key={index} detail={value}/>
                                })
                            }
                        </div>
                        <Pagination defaultPageSize={15} hideOnSinglePage showQuickJumper defaultCurrent={1}
                                    total={this.state.topics.length} onChange={this.onChangeAll}/>
                    </TabPane>
                    <TabPane tab="精华" key="2">
                        {loading}
                        <div>
                            {
                                this.state.boardEssence.map((value, index) => {
                                    return <Topic tab={'2'} Home={this} key={index} detail={value}/>
                                })
                            }
                        </div>
                        <Pagination defaultPageSize={15} hideOnSinglePage showQuickJumper defaultCurrent={1}
                                    total={this.state.essence.length} onChange={this.onChangeEssence}/>
                    </TabPane>
                    <TabPane tab="灌水交流" key="3">
                        {loading}
                        <div>
                            {
                                this.state.boardTalk.map((value, index) => {
                                    return <Topic tab={'3'} Home={this} key={index} detail={value}/>
                                })
                            }
                        </div>
                        <Pagination defaultPageSize={15} hideOnSinglePage showQuickJumper defaultCurrent={1}
                                    total={this.state.talk.length} onChange={this.onChangeTalk}/>
                    </TabPane>
                    <TabPane tab="技术讨论" key="4">
                        {loading}
                        <div>
                            {
                                this.state.boardTech.map((value, index) => {
                                    return <Topic tab={'4'} Home={this} key={index} detail={value}/>
                                })
                            }
                        </div>
                        <Pagination defaultPageSize={15} hideOnSinglePage showQuickJumper defaultCurrent={1}
                                    total={this.state.tech.length} onChange={this.onChangeTech}/>
                    </TabPane>
                    <TabPane tab="建议&反馈" key="5">
                        {loading}
                        <div>
                            {
                                this.state.boardBug.map((value, index) => {
                                    return <Topic tab={'5'} Home={this} key={index} detail={value}/>
                                })
                            }
                        </div>
                        <Pagination defaultPageSize={15} hideOnSinglePage showQuickJumper defaultCurrent={1}
                                    total={this.state.bug.length} onChange={this.onChangeBug}/>
                    </TabPane>
                </Tabs>
                <Markdown Home={this}/>
            </div>
        )
    }
}

export default Home