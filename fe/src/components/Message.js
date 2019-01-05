import React from 'react'
import {
    Modal,
    Form,
    Button,
    Breadcrumb,
    Tooltip,
    Input,
    Tabs,
    Collapse,
} from 'antd';
import {Link, Redirect} from 'react-router-dom'
import moment from 'moment/min/moment-with-locales';
import axios from 'axios'
import qs from 'qs'
import {error, success} from "../utilities"

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const CollectionCreateForm = Form.create()(
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onCreate, form, receiver
            } = this.props;
            const {getFieldDecorator} = form;
            const {TextArea} = Input;
            return (
                <Modal
                    visible={visible}
                    title="创建私信"
                    okText="发送"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="收信人">
                            {
                                getFieldDecorator(
                                    'nickname',
                                    {
                                        rules: [{required: true, message: '请输入收信人!'}],
                                        initialValue: receiver
                                    },
                                )
                                (<Input/>)
                            }
                        </FormItem>
                        <FormItem label="私信标题">
                            {
                                getFieldDecorator(
                                    'title',
                                    {
                                        rules: [{required: true, message: '请输入标题!'}],
                                    }
                                )
                                (<Input/>)
                            }
                        </FormItem>
                        <FormItem label="私信内容">
                            {
                                getFieldDecorator(
                                    'content',
                                    {
                                        rules: [{required: true, message: '请输入私信内容!'}],
                                    }
                                )
                                (<TextArea style={{resize: 'none'}} rows={3}/>)}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

class Message extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            received: [],
            sended: [],
            receiver: null,
            redirect: null
        }
    }

    showModal = () => {
        this.setState({visible: true});
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            receiver: null,
        });
    }

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                error('出现异常，请稍候重试')
                return;
            }
            axios.post('http://0.0.0.0:2000/api/create-message', qs.stringify(values))
                .then((response) => {
                    if (response.data === false) {
                        error('发送失败，请稍候重试！')
                    } else if (response.data === 'no user') {
                        error('该用户不存在！')
                    } else if (response.data === 'unvalid') {
                        error('不能给自己发私信！')
                    } else {
                        success('发送成功！')
                        let send = this.state.sended
                        send.unshift(
                            {
                                receive_name: values.nickname,
                                ct: new Date().getTime() / 1000,
                                title: values.title,
                                content: values.content
                            }
                        )
                        this.setState(
                            {
                                visible: false,
                                sended: send,
                            }
                        );
                        form.resetFields();
                    }
                })
                .catch((err) => {
                    error('糟糕，出现未知异常，请稍候重试！')
                    console.log(err)
                })
        });
        this.setState({
            receiver: null
        })
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    readClick = (mid) => {
        let msg = this.state.received
        for (let i = 0; i < msg.length; i++) {
            if (msg[i].mid === mid) {
                if (msg[i].read === true) {
                    break
                } else {
                    msg[i].read = true
                    axios.get(`http://0.0.0.0:2000/api/read-msg/${mid}`)
                        .then((response) => {
                            if (response.data !== 'fail') {
                                this.setState({
                                    received: msg
                                })
                            }
                        })
                        .catch((err) => {
                            error('糟糕，出现未知异常！请稍候重试')
                            console.log(err)
                        })
                    break
                }
            }
        }
    }

    reply = (receiver) => {
        this.setState({
            receiver: receiver
        })
        this.showModal()
    }

    componentDidMount() {
        axios.get('http://0.0.0.0:2000/api/received-msg')
            .then((response) => {
                if (response.data === false) {
                    this.setState({
                        redirect: 'redirect'
                    })
                    return null
                } else {
                    response.data.reverse()
                    this.setState({
                        received: response.data
                    })
                }
            })
            .catch((err) => {
                error('糟糕，出现未知异常，请稍候重试')
                console.log(err)
            })
        axios.get('http://0.0.0.0:2000/api/sended-msg')
            .then((response) => {
                if (response.data === false) {
                    this.setState({
                        redirect: 'redirect'
                    })
                } else {
                    response.data.reverse()
                    this.setState({
                        sended: response.data
                    })
                }
            })
            .catch((err) => {
                error('糟糕，出现未知异常，请稍候重试')
                console.log(err)
            })
    }

    render() {
        if (this.state.redirect === 'redirect') {
            return <Redirect to={'/'}/>
        }
        return (
            <div className={'content profile'}>
                <Breadcrumb style={{marginTop: '5px'}}>
                    <Breadcrumb.Item><Link to={'/'}>Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to={'/my-summary'}>用户主页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>用户私信</Breadcrumb.Item>
                </Breadcrumb>
                <div>

                </div>
                <div className={'message'}>
                    <Button onClick={this.showModal} type={'primary'} size={'large'}>发起私信</Button>
                    <CollectionCreateForm
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        receiver={this.state.receiver}
                    />
                    <div className={'message-tabs'}>
                        <Tabs tabPosition={'left'} size={'large'}>
                            <TabPane tab="收信箱" key="1">
                                {
                                    this.state.received.length > 0 ?
                                        <Collapse accordion>
                                            {
                                                this.state.received.map((value, index) => {
                                                    let receive_head = (
                                                        <div className={'panel-head'}
                                                             onClick={() => this.readClick(value.mid)}>
                                                            <span>
                                                                <span className={'status'}>
                                                                    {value.read ? '已读' : '未读'}
                                                                </span>
                                                                来自『{value.send_name}』的私信&nbsp;----&nbsp;{value.title}
                                                            </span>
                                                            <Tooltip placement="top"
                                                                     title={moment(value.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                                                <span style={{marginRight: '20px'}}>
                                                                    {moment(value.ct * 1000).fromNow()}
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    )
                                                    return (
                                                        <Panel key={index + 1} header={receive_head}>
                                                            <p style={{fontSize: '20px'}}>{value.content}</p>
                                                            <div style={{textAlign: 'right'}}>
                                                                <Button style={{marginRight: '10px'}}
                                                                        onClick={() => this.reply(value.send_name)}
                                                                        type={'primary'} size={'large'}>回复</Button>
                                                            </div>
                                                        </Panel>
                                                    )
                                                })
                                            }
                                        </Collapse> :
                                        <div className={'none-notify'}>
                                            暂时没有收到私信。
                                        </div>
                                }
                            </TabPane>
                            <TabPane tab="已发送" key="2">
                                {
                                    this.state.sended.length > 0 ?
                                        <Collapse accordion>
                                            {
                                                this.state.sended.map((value, index) => {
                                                    let send_head = (
                                                        <div className={'panel-head'}>
                                                            <span>
                                                                发送给『{value.receive_name}』的私信&nbsp;----&nbsp;{value.title}
                                                            </span>
                                                            <Tooltip placement="top"
                                                                     title={moment(value.ct * 1000).format('YYYY年M月D日Ah点mm分')}>
                                                                <span style={{marginRight: '20px'}}>
                                                                    {moment(value.ct * 1000).fromNow()}
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    )
                                                    return (
                                                        <Panel key={index + 1} header={send_head}>
                                                            <p style={{fontSize: '20px'}}>{value.content}</p>
                                                        </Panel>
                                                    )
                                                })
                                            }
                                        </Collapse> :
                                        <div className={'none-notify'}>
                                            暂无已发送的私信。
                                        </div>
                                }
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default Message