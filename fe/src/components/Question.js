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
import {compile, display, stateDis, stepCompile, step} from '../coreCompile';
import '../assets/css/Asm.css'
import {Link} from 'react-router-dom'
import '../assets/css/Question.css'
import {Icon, Tabs, Menu, Dropdown, Button, notification} from 'antd'
import CodeBlock from "../code-block"
import Markdown from 'react-markdown'

const openNotificationWithIcon = (type) => {
    notification[type]({
        message: '复制成功 🎉',
        description: '链接链接复制成功，快去分享吧：）',
    });
};

const code = `;在这里你不再需要输入诸如
;	DATA	SEGMENT
;	DATA	ENDS
;	CODE	SEGMENT
;		ASSUME CS: CODE, DS: DATA
;	CODE	ENDS
;		END  START
;等标准头、尾部代码，直接输入START之后的主体代码即可, 如下 ⬇️⬇️⬇️
MOV AX, B800h    　　; 将ax设置为 B800h.
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
            tab: 4,
            state: '通过此窗口查看代码执行情况...',
            name: '',
            isStep: false,
            scope: 'register'
        }
    }

    copyUrl = (e) => {
        let Url = document.location.href
        let oInput = document.createElement('input');
        oInput.value = Url;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.remove()
        e.target.style.color = 'brown'
        e.target.style.transition = 'all .5s'
        openNotificationWithIcon('success')
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
            value: display(),
            state: stateDis()
        })
        let logBox = document.querySelector('.consoleContent')
        setTimeout(() => {
            logBox.scrollTo(0, logBox.scrollHeight)
        }, 0)
    }

    stepMode = () => {
        let rawCode = this.refs.editor.editor.getValue()
        stepCompile(rawCode)
        this.setState({
            state: '开始单步调试，单击『单步执行』按钮继续...',
            isStep: true
        })
    }

    cancelStep = () => {
        if (this.state.line != null) {
            this.refs.editor.editor.removeLineClass(this.state.line - 1, 'background', 'active')
        }
        this.setState({
            isStep: false,
            line: null,
            state: '通过此窗口查看代码执行情况...\n'
        })
    }

    runStep = () => {
        let res = step()
        let logBox = document.querySelector('.consoleContent')
        if (res === 'error') {
            this.setState({
                value: display(),
                state: stateDis(),
                isStep: false
            })
        } else if (res === 'over') {
            this.refs.editor.editor.removeLineClass(this.state.line - 1, 'background', 'active')
            this.setState({
                state: '执行完毕！',
                isStep: false,
                line: null
            })
        } else {
            this.setState({
                value: display(),
                state: stateDis(),
                line: res
            })
            setTimeout(() => {
                logBox.scrollTo(0, logBox.scrollHeight)
            }, 0)
            if (--res === 0) {
                this.refs.editor.editor.addLineClass(res, 'background', 'active')
            } else {
                this.refs.editor.editor.removeLineClass(res - 1, 'background', 'active')
                this.refs.editor.editor.addLineClass(res, 'background', 'active')
            }
        }
    }

    handleScope = (e) => {
        if (this.state.scope !== e.target.getAttribute('name')) {
            this.setState({
                scope: e.target.getAttribute('name')
            })
        }
    }

    render() {
        const detail = this.props.location.state.detail
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
        const cancleButton = <Button onClick={this.cancelStep} size={'large'} disabled={!this.state.isStep}
                                     type="danger">取消单步</Button>
        const stepButton = <Button onClick={this.runStep} size={'large'} disabled={!this.state.isStep}
                                   type="primary">单步执行</Button>
        return (
            <div className={'questionContainer'}>
                <div className={'questionHeader'}>
                    <div className={'leftBox'}>
                        <div className={'title'}>{detail.aid - 59999 + '.' + detail.title}</div>
                        <ul className={'titleDetail'}>
                            <li className={'difficulty'}>
                                难度&nbsp;<span>&nbsp;{detail.difficult}</span>
                            </li>
                            <li onClick={this.copyUrl} className={'share'} style={{cursor: 'pointer'}}>
                                <Icon style={{fontSize: '16px'}} type="export"/>&nbsp;分享
                            </li>
                        </ul>
                    </div>
                    <div className={'rightBox'}>
                        <div className={'acceptCount'}>
                            <div className={'countType'}>通过次数</div>
                            <div className={'count'}>{detail.acceptCount}</div>
                        </div>
                        <div className={'submitCount'}>
                            <div className={'countType'}>提交次数</div>
                            <div className={'count'}>{detail.submitCount}</div>
                        </div>
                    </div>
                </div>
                <div className={'questionBody'}>
                    <div className={'questionDetail'}>
                        <div className="card-container">
                            <Tabs type="card">
                                <TabPane tab={<span><Icon type="profile"/>描述</span>} key="1">
                                    <Markdown className={'experiment'}
                                              source={detail.content}
                                              skipHtml={true}
                                              escapeHtml={true}
                                              renderers={{code: CodeBlock}}/>
                                </TabPane>
                                <TabPane tab={<span><Icon type="bulb"/>解答</span>} key="2">
                                    <Markdown className={'experiment'}
                                              source={detail.answer}
                                              skipHtml={true}
                                              escapeHtml={true}
                                              renderers={{code: CodeBlock}}/>
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
                            <span name="register" onClick={this.handleScope}><Icon style={{fontSize: '15px'}}
                                                                                   type="bars"/> 寄存器查看器</span>
                            <span name="memory" onClick={this.handleScope}><Icon style={{fontSize: '15px'}}
                                                                                 type="bars"/> 内存信息</span>
                            <span name="stack" onClick={this.handleScope}><Icon style={{fontSize: '15px'}} type="bars"/> 堆栈信息</span>
                        </div>
                        <div className={'scope'}>
                            <ul className={this.state.scope !== 'register' ? 'hide' : null}>
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
                            <ul className={this.state.scope !== 'memory' ? 'hide' : null}>
                                <li>
                                    <div>内存地址</div>
                                    <div>内存数据</div>
                                </li>
                                {
                                    this.state.value && Object.keys(this.state.value.memories).map((item, index) => {
                                        return <li key={index}>
                                            <div>{item.toUpperCase()}</div>
                                            <div>{this.state.value.memories[item].toUpperCase()}</div>
                                        </li>
                                    })
                                }
                            </ul>
                            <ul className={this.state.scope !== 'stack' ? 'hide' : null}>
                                <li>
                                    <div>堆栈数据</div>
                                    <div>栈顶到栈底</div>
                                </li>
                                {
                                    this.state.value && this.state.value.stack.map((item, index) => {
                                        return <li key={index}>
                                            <div style={{flexBasis: '100%'}}>{item.toUpperCase()}</div>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={'consoleContainer'}>
                    <div className={'consoleHead'}>
                        <span className={'headLeft'}><Icon type={'tool'}/> 控制台</span>
                        <div>
                            {
                                this.state.isStep ? stepButton : null
                            }
                            {
                                this.state.isStep ? cancleButton : null
                            }
                            <Button disabled={this.state.isStep} onClick={this.stepMode} size={'large'} type="danger"
                                    ghost>单步调试</Button>
                            <Button disabled={this.state.isStep} onClick={this.runCode} size={'large'} type="primary"
                                    ghost>执行代码</Button>
                        </div>
                    </div>
                    <div className={'consoleBox'}>
                        <div className={'consoleContent'}>
                            {
                                typeof this.state.state === 'string' ? <p>{this.state.state}</p> :
                                    this.state.state.map((value, index) => {
                                        return <p key={index}>{value.toString()}</p>
                                    })
                            }
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
