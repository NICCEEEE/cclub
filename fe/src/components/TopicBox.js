import React from 'react'
import '../assets/css/Markdown.css'
import {Drawer, Input, Icon, Switch, Tooltip, Button, Menu, Dropdown} from 'antd';
import {error, debounce} from '../utilities'
import Markdown from 'react-markdown'
import CodeBlock from '../code-block'

class TopicBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            placement: 'bottom',
            selectedBoard: null,
            preview: true,
            fullScreen: false,
            markdown: '',
        }
    }

    handleMenuClick = (e) => {
        console.log(e.item.props.children);
        this.setState({
            selectedBoard: e.item.props.children
        })
    }
    onClose = () => {
        this.props.Home.setState({
            drawerVisible: false,
        })
        this.setState({
            selectedBoard: null,
            preview: true,
            fullScreen: false,
            markdown: '',
        })
    };
    switchBox = (checked) => {
        console.log(`switch to ${checked}`);
        this.setState({
            preview: !this.state.preview
        })
    }
    changeScreen = () => {
        this.setState({
            fullScreen: !this.state.fullScreen
        })
    }
    getTextRange = () => {
        let rangeData = {
            text: "",
            start: 0,
            end: 0
        }
        let textBox = document.querySelector("textarea[name='inputTopic']")
        textBox.focus();
        let range = textBox.setSelectionRange
        rangeData.start = textBox.selectionStart;
        rangeData.end = textBox.selectionEnd;
        rangeData.text = (rangeData.start != rangeData.end) ? textBox.value.substring(rangeData.start, rangeData.end) : "";
        return rangeData
    }
    fontBold = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        if (rangeData.start === rangeData.end) {
            let t1 = value.slice(0, rangeData.end)
            let t2 = value.slice(rangeData.end, value.length)
            value = t1 + '**粗体文本**' + t2
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 2, rangeData.end + 6)
        } else {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.start, rangeData.end)
            let t3 = value.slice(rangeData.end, value.length)
            value = t1 + '**' + t2 + '**' + t3
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 2, rangeData.end + 2)
        }
        this.renderMarkdown()
    }
    fontItalic = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        if (rangeData.start === rangeData.end) {
            let t1 = value.slice(0, rangeData.end)
            let t2 = value.slice(rangeData.end, value.length)
            value = t1 + '*斜体文本*' + t2
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 1, rangeData.end + 5)
        } else {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.start, rangeData.end)
            let t3 = value.slice(rangeData.end, value.length)
            value = t1 + '*' + t2 + '*' + t3
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 1, rangeData.end + 1)
        }
        this.renderMarkdown()
    }
    lineThrough = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        if (rangeData.start === rangeData.end) {
            let t1 = value.slice(0, rangeData.end)
            let t2 = value.slice(rangeData.end, value.length)
            value = t1 + '~~删除线~~' + t2
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 2, rangeData.end + 5)
        } else {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.start, rangeData.end)
            let t3 = value.slice(rangeData.end, value.length)
            value = t1 + '~~' + t2 + '~~' + t3
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 2, rangeData.end + 2)
        }
        this.renderMarkdown()
    }
    addList = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        if (rangeData.start === rangeData.end) {
            let t1 = value.slice(0, rangeData.end)
            let t2 = value.slice(rangeData.end, value.length)
            value = t1 + '\n - 列表项' + t2
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 4, rangeData.end + 7)
        } else {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.start, rangeData.end)
            let t3 = value.slice(rangeData.end, rangeData.length)
            value = t1 + '\n - ' + t2 + t3
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 4, rangeData.end + 4)
        }
        this.renderMarkdown()
    }
    addOrderedList = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        if (rangeData.start === rangeData.end) {
            let t1 = value.slice(0, rangeData.end)
            let t2 = value.slice(rangeData.end, value.length)
            value = t1 + '\n 1. 列表项' + t2
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 5, rangeData.end + 8)
        } else {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.start, rangeData.end)
            let t3 = value.slice(rangeData.end, rangeData.length)
            value = t1 + '\n 1. ' + t2 + t3
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 5, rangeData.end + 5)
        }
        this.renderMarkdown()
    }
    addUnderline = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        let t1 = value.slice(0, rangeData.end)
        let t2 = value.slice(rangeData.end, value.length)
        value = t1 + '\n\n----\n' + t2
        textBox.value = value
        textBox.setSelectionRange(rangeData.end, rangeData.end)
        this.renderMarkdown()
    }
    addHead = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        if (rangeData.start === rangeData.end) {
            let t1 = value.slice(0, rangeData.end)
            let t2 = value.slice(rangeData.end, value.length)
            value = t1 + '\n## 小标题\n' + t2
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 4, rangeData.end + 8)
        } else {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.start, rangeData.end)
            let t3 = value.slice(rangeData.end, rangeData.length)
            value = t1 + '\n## ' + t2 + t3
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 4, rangeData.end + 4)
        }
        this.renderMarkdown()
    }
    addLink = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        if (rangeData.start === rangeData.end) {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.end, value.length)
            value = t1 + '[链接文本](链接地址)' + t2
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 7, rangeData.end + 11)
        } else {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.start, rangeData.end)
            let t3 = value.slice(rangeData.end, rangeData.length)
            value = t1 + '[' + t2 + '](链接地址)' + t3
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + t2.length + 3, rangeData.start + t2.length + 7)
        }
        this.renderMarkdown()
    }
    addTable = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        let t1 = value.slice(0, rangeData.start)
        let t2 = value.slice(rangeData.start, rangeData.end)
        let t3 = value.slice(rangeData.end, rangeData.length)
        value = t1 + t2 + '\n\n| 表头一 | 表头二 | 表头三 |\n| ----- | ----- | ----- |\n| 单元格 | 单元格 | 单元格 |\n| 单元格 | 单元格 | 单元格 |\n' + t3
        textBox.value = value
        textBox.setSelectionRange(rangeData.start + t2.length + 4, rangeData.start + t2.length + 7)
        this.renderMarkdown()
    }
    addPicture = () => {
        let rangeData = this.getTextRange()
        let textBox = document.querySelector("textarea[name='inputTopic']")
        let value = textBox.value
        if (rangeData.start === rangeData.end) {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.end, value.length)
            value = t1 + '![替代文字](图片地址)' + t2
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + 8, rangeData.end + 12)
        } else {
            let t1 = value.slice(0, rangeData.start)
            let t2 = value.slice(rangeData.start, rangeData.end)
            let t3 = value.slice(rangeData.end, rangeData.length)
            value = t1 + '![' + t2 + '](图片地址)' + t3
            textBox.value = value
            textBox.setSelectionRange(rangeData.start + t2.length + 4, rangeData.start + t2.length + 8)
        }
        this.renderMarkdown()
    }
    publish = () => {
        let title = document.querySelector("input[name='topicTitle']")
        let board = this.state.selectedBoard
        let content = document.querySelector("textarea[name='inputTopic']")
        if (title.value.length < 8 || title.length > 40) {
            error('标题字数不符')
        } else if (board === null) {
            error('尚未选择发布板块')
        } else if (content.value.length < 1) {
            error('帖子内容不能为空')
        } else {
            let topicData = {
                title: title.value,
                board: board,
                content: content.value
            }
            console.log(topicData)
            title.value = ''
            content.value = ''
            this.setState({
                selectedBoard: null
            })
        }
    }
    renderMarkdown = () => {
        let content = document.querySelector("textarea[name='inputTopic']")
        this.setState({
            markdown: content.value
        })
    }
    syncScroll = (e) => {
        let previewBox = document.querySelector('.markdownPreview')
        let top = e.target.scrollTop
        previewBox.scrollTo(0, top)
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">灌水交流</Menu.Item>
                <Menu.Item key="2">技术讨论</Menu.Item>
                <Menu.Item key="3">建议反馈</Menu.Item>
            </Menu>
        );
        let height = window.innerHeight
        height = this.state.fullScreen ? height * 0.9 : height * 0.5
        return (
            <div className={'createTopic'}>
                <Drawer
                    title="新建主题帖（支持Markdown语法）"
                    maskClosable={false}
                    destroyOnClose={true}
                    placement={this.state.placement}
                    closable={false}
                    visible={this.props.Home.state.drawerVisible}
                    height={height}
                >
                    <div className={'titleBox'}>
                        <Input name={'topicTitle'} addonBefore="您的标题:" size="large"
                               placeholder="标题字数不能少于8个字符且不能超过40个字符"/>
                        <Dropdown overlay={menu}>
                            <Button size={'large'}>
                                {this.state.selectedBoard ? this.state.selectedBoard : '选择板块'}<Icon type="down"/>
                            </Button>
                        </Dropdown>
                        <Button size={'large'} type="primary" onClick={this.publish}>发表</Button>
                        <Tooltip placement="topRight" title={'关闭后您的输入将被清空！'}>
                            <Button size={'large'} type="danger" onClick={this.onClose}>关闭</Button>
                        </Tooltip>
                    </div>
                    <ul className={'toolBox'}>
                        <li onClick={this.fontBold} title={'加粗'}><Icon type="bold"/></li>
                        <li onClick={this.fontItalic} title={'斜体'}><Icon type="italic"/></li>
                        <li onClick={this.lineThrough} title={'删除线'}><Icon type="strikethrough"/></li>
                        <li onClick={this.addList} title={'无序列表'}><Icon type="bars"/></li>
                        <li onClick={this.addOrderedList} title={'有序列表'}><Icon type="ordered-list"/></li>
                        <li onClick={this.addUnderline} title={'添加分割线'}><Icon type="dash"/></li>
                        <li onClick={this.addHead} title={'添加小标题'}><Icon type="edit"/></li>
                        <li onClick={this.addLink} title={'添加链接'}><Icon type="link"/></li>
                        <li onClick={this.addTable} title={'添加表格'}><Icon type="table"/></li>
                        <li onClick={this.addPicture} title={'插入网络图片'}><Icon type="picture"/></li>
                        {
                            this.state.fullScreen ?
                                <li title={'退出高屏'} onClick={this.changeScreen}><Icon type="caret-down"/></li> :
                                <li title={'高屏显示'} onClick={this.changeScreen}><Icon type="caret-up"/></li>

                        }
                        <li className={'switch'}>
                            <Tooltip placement="top" title={'文本预览'}>
                                <Switch onChange={(checked) => this.switchBox(checked)} checkedChildren="开"
                                        unCheckedChildren="关" defaultChecked/>
                            </Tooltip>
                        </li>
                    </ul>
                    <div className={'writingBox'}>
                        <div style={{height: this.state.fullScreen ? (height - 169) * 0.97 : (height - 169) * 0.95}}
                             className={this.state.preview ? 'inputBox' : 'noPreview inputBox'}>
                            <Input.TextArea onScroll={this.syncScroll}
                                            onChange={debounce(this.renderMarkdown, 500).bind(this)} name={'inputTopic'}
                                            style={{height: 'inherit'}}/>
                        </div>
                        <div style={{height: this.state.fullScreen ? (height - 169) * 0.97 : (height - 169) * 0.95}}
                             className={this.state.preview ? 'previewBox' : 'noPreview previewBox'}>
                            {/*<Input.TextArea style={{backgroundColor: 'snow', height: 'inherit'}}*/}
                            {/*readOnly={true}/>*/}
                            <Markdown className={'markdownPreview'}
                                      source={this.state.markdown}
                                      skipHtml={false}
                                      escapeHtml={false}
                                      renderers={{code: CodeBlock}}/>,
                        </div>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default TopicBox