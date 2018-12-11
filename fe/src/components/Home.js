import React from 'react'
import {changeTitle} from '../utilities'
import Topic from "./Topic"
import {Pagination, Tag, Spin, Tabs, Button} from 'antd';
import '../assets/css/Home.css'
import axios from 'axios'

const TabPane = Tabs.TabPane;

const operations = <Button type="primary" size={'large'} >发表新帖</Button>;
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            topics: [],
            topicsToSee: [],
        }
    }

    componentWillMount() {
        changeTitle('Home')
    }

    componentDidMount() {
        axios.get('http://0.0.0.0:2000/api/topic')
            .then((response) => {
                console.log(response)
                this.setState({
                    topics: response.data,
                    topicsToSee: response.data.slice(0, 10)
                })
            })
    }

    onChange = (pageNumber) => {
        pageNumber = pageNumber - 1
        this.setState({
            topicsToSee: this.state.topics.slice(pageNumber * 10, pageNumber * 10 + 10)
        })
        window.scrollTo(0, 0)
    }

    render() {
        let loading = null
        if (this.state.topics.length < 1) {
            loading = <Spin size="large"/>
        } else {
            loading = null
        }
        return (
            <div className={'content homePage'}>
                {/*<div className={'board'}>*/}
                    {/*<Tag color="green">全部</Tag>*/}
                    {/*<Tag color="cyan">全部</Tag>*/}
                    {/*<Tag color="red">精华</Tag>*/}
                    {/*<Tag color="blue">用户交流</Tag>*/}
                    {/*<Tag color="orange">技术分享</Tag>*/}
                    {/*<Tag color="geekblue">geekblue</Tag>*/}
                    {/*<Tag color="purple">反馈与意见</Tag>*/}
                {/*</div>*/}
                <Tabs tabBarExtraContent={operations} size={'large'} style={{flexBasis: '100%'}}>
                    <TabPane tab="全部" key="1" style={{display:'flex', flexDirection:"column", alignItems: 'center'}}>
                        {loading}
                        {
                            this.state.topicsToSee.map((value, index) => {
                                return <Topic key={index} detail={value}/>
                            })
                        }
                        <Pagination style={{marginBottom: '20px'}} hideOnSinglePage showQuickJumper defaultCurrent={1}
                                    total={this.state.topics.length} onChange={this.onChange}/>
                    </TabPane>
                    <TabPane tab="精华" key="2">Content of tab 2</TabPane>
                    <TabPane tab="灌水交流" key="3">Content of tab 3</TabPane>
                    <TabPane tab="技术讨论" key="4">Content of tab 3</TabPane>
                    <TabPane tab="建议&反馈" key="5">Content of tab 3</TabPane>
                </Tabs>


            </div>
        )
    }
}

export default Home