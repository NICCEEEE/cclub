import React from 'react'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/keymap/vim';
import 'codemirror/keymap/emacs';
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/theme/the-matrix.css';
import {compile, display} from '../coreCompile';
import '../assets/css/Asm.css'
import {Link} from 'react-router-dom'
import '../assets/css/Question.css'
import {Icon, Tabs, Menu, Dropdown, Button} from 'antd'

const code = `MOV AX, 0B800h    　　; 将ax设置为 B800h.
MOV DS, AX        　　　; 将 AX 值拷贝到 DS.
MOV CH, 01011111b 　　; 将ch设置为二进制的01011111b
MOV BX, 15Eh     　　　 ;  将 BX 设置成 15Eh.
MOV [BX], CX    　　  ; 将 CX 放到 bx 指出的内存单元 B800:015E`

const TabPane = Tabs.TabPane;

class Question extends React.Component {
    constructor() {
        super()
        this.state = {
            mask: false,
            font: '14px',
            theme: 'mdn-like',
            keymap: 'sublime',
            tab: 4
        }
    }

    handleMenuClick(type, event) {
        switch (type) {
            case 'font':
                this.setState({
                    font: event.item.props.children
                })
                let code = document.querySelector('.CodeMirror')

                code.style.fontSize = event.item.props.children
                break
            case 'theme':
                this.setState({
                    theme: event.item.props.children
                })
                break
            case 'keymap':
                this.setState({
                    keymap: event.item.props.children
                })
                break
            case 'tab':
                this.setState({
                    tab: event.item.props.children[0]
                })
                break
            default:
                break
        }
        console.log('click', type, event.item.props.children);
    }

    codeSetting = () => {
        this.setState({
            mask: true
        })
    }

    settingClose = () => {
        this.setState({
            mask: false
        })
    }
    runCode = () => {
        let rawCode = this.refs.editor.editor.getValue()
        compile(rawCode)
        this.setState({
            value: display()
        })
    }

    render() {
        const fontMenu = (
            <Menu name={'font'} style={{width: '200px'}} onClick={this.handleMenuClick.bind(this, 'font')}>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="1">14px</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="2">16px</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="3">18px</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="4">20px</Menu.Item>
            </Menu>
        );

        const themeMenu = (
            <Menu style={{width: '200px'}} onClick={this.handleMenuClick.bind(this, 'theme')}>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="1">eclipse</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="2">cobalt</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="3">lucario</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="4">mbo</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="5">mdn-like</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="6">rubyblue</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="7">the-matrix</Menu.Item>
            </Menu>
        );

        const keyMenu = (
            <Menu style={{width: '200px'}} onClick={this.handleMenuClick.bind(this, 'keymap')}>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="1">sublime</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="2">vim</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="3">emacs</Menu.Item>
            </Menu>
        );

        const tabMenu = (
            <Menu style={{width: '200px'}} onClick={this.handleMenuClick.bind(this, 'tab')}>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="1">2个空格</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="2">4个空格</Menu.Item>
                <Menu.Item style={{fontSize: '20px', margin: '3px 0'}} key="3">8个空格</Menu.Item>
            </Menu>
        );

        const mask = <div className={'mask'}>
            <div className={'settingBox'}>
                <div className={'settingHead'}>
                    <span>代码编辑器设置</span>
                    <Icon onClick={this.settingClose} type="close"/>
                </div>
                <div className={'settingFont'}>
                    <div>
                        <div>
                            字体设置
                        </div>
                        <div>
                            调整适合你的字体大小。
                        </div>
                    </div>
                    <Dropdown overlay={fontMenu}>
                        <Button style={{marginLeft: 8}}>
                            {this.state.font} <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
                <div className={'settingTheme'}>
                    <div>
                        <div>
                            主题设置
                        </div>
                        <div>
                            切换不同的代码编辑器主题，选择适合你的语法高亮。
                        </div>
                    </div>
                    <Dropdown overlay={themeMenu}>
                        <Button style={{marginLeft: 8}}>
                            {this.state.theme} <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
                <div className={'settingKeymap'}>
                    <div>
                        <div>
                            键位绑定
                        </div>
                        <div>
                            想要练习使用 Vim 或者 Emacs？你可以在这里切换这些预设的键位绑定。
                        </div>
                    </div>
                    <Dropdown overlay={keyMenu}>
                        <Button style={{marginLeft: 8}}>
                            {this.state.keymap} <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
                <div className={'settingTab'}>
                    <div>
                        <div>
                            Tab 长度
                        </div>
                        <div>
                            选择你想要的 Tab 长度，默认设置为4个空格。
                        </div>
                    </div>
                    <Dropdown overlay={tabMenu}>
                        <Button style={{marginLeft: 8}}>
                            {this.state.tab.toString() + '个空格'} <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
            </div>
        </div>
        return (
            <div className={'questionContainer'}>
                <div className={'questionHeader'}>
                    <div className={'leftBox'}>
                        <div className={'title'}>1.简单汇编调试</div>
                        <ul className={'titleDetail'}>
                            <li className={'difficulty'}>
                                难度&nbsp;<span>&nbsp;简单</span>
                            </li>
                            <li className={'share'}>
                                <Icon style={{fontSize: '16px'}} type="export"/>&nbsp;分享
                            </li>
                        </ul>
                    </div>
                    <div className={'rightBox'}>
                        <div className={'acceptCount'}>
                            <div className={'countType'}>通过次数</div>
                            <div className={'count'}>257205</div>
                        </div>
                        <div className={'submitCount'}>
                            <div className={'countType'}>提交次数</div>
                            <div className={'count'}>574280</div>
                        </div>
                    </div>
                </div>
                <div className={'questionBody'}>
                    <div className={'questionDetail'}>
                        <div className="card-container">
                            <Tabs type="card" size={'large'}>
                                <TabPane tab={<span><Icon type="profile"/>描述</span>} key="1">
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                    <p>Content of Tab Pane 1</p>
                                </TabPane>
                                <TabPane tab={<span><Icon type="bulb"/>解答</span>} key="2">
                                    <p>Content of Tab Pane 3</p>
                                    <p>Content of Tab Pane 3</p>
                                    <p>Content of Tab Pane 3</p>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                    <div className={'codeBox'}>
                        <div className={'codeHead'}>
                            <span onClick={this.codeSetting}><Icon type="setting"/> 编辑器设置</span>
                        </div>
                        <div className={'codeMirror'}>
                            <CodeMirror
                                height={'540px'}
                                value={code}
                                options={{
                                    theme: this.state.theme,
                                    keyMap: this.state.keymap,
                                    mode: 'plain',
                                    tabSize: this.state.tab
                                }}
                                ref='editor'
                            />
                        </div>
                    </div>
                    <div className={'registerScope'}>
                        <div className={'scopeHead'}>
                            <span><Icon style={{fontSize: '15px'}} type="bars"/> 寄存器查看器</span>
                        </div>
                        <div className={'scope'}>
                            <ul>
                                <li>
                                    <div>AX</div>
                                    <div>{this.state.value ? this.state.value.AX.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>BX</div>
                                    <div>{this.state.value ? this.state.value.BX.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>CX</div>
                                    <div>{this.state.value ? this.state.value.CX.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>DX</div>
                                    <div>{this.state.value ? this.state.value.DX.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>SP</div>
                                    <div>{this.state.value ? this.state.value.SP.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>BP</div>
                                    <div>{this.state.value ? this.state.value.BP.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>SI</div>
                                    <div>{this.state.value ? this.state.value.SI.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>DI</div>
                                    <div>{this.state.value ? this.state.value.DI.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>DS</div>
                                    <div>{this.state.value ? this.state.value.DS.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>ES</div>
                                    <div>{this.state.value ? this.state.value.ES.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>SS</div>
                                    <div>{this.state.value ? this.state.value.SS.toUpperCase() : '0000'}</div>
                                </li>
                                <li>
                                    <div>CS</div>
                                    <div>{this.state.value ? this.state.value.CS.toUpperCase() : '0000'}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={'consoleContainer'}>
                    <div className={'consoleHead'}>
                        <span className={'headLeft'}><Icon type={'tool'}/> 控制台</span>
                        <div>
                            <Button onClick={this.runCode} size={'large'} type="primary" ghost>执行代码</Button>
                            <Button size={'large'} type="danger" ghost>提交代码</Button>
                        </div>
                    </div>
                    <div className={'consoleBox'}>
                        <div className={'consoleContent'}>
                            <p>通过此窗口查看代码执行情况...</p>
                        </div>
                    </div>
                </div>
                {
                    this.state.mask ? mask : null
                }
            </div>
        )
    }
}

export default Question