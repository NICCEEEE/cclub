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
import {compile, display, stateDis} from '../coreCompile';
import '../assets/css/Asm.css'
import {Link} from 'react-router-dom'
import '../assets/css/Question.css'
import {Icon, Tabs, Menu, Dropdown, Button} from 'antd'
import CodeBlock from "../code-block"
import Markdown from 'react-markdown'


/*
Todo:
1.创建管理员题库添加组件，用于添加题目描述、解答，构建数据库和api
2.添加支持的汇编指令的相关文档
 */

const experiment = `#### 一、实验目的

1. 熟悉8086常用指令

2. 掌握Wdm86集成操作软件的操作指令


#### 二、实验内容

 1. 在右侧虚拟编辑环境下输入下列程序片段，单击**执行代码**按钮并记录结果。


----
 - 程序段1

\`\`\`语种
MOV  AX, 2000H
MOV  DS, AX    ;DS=
MOV  DX, 0100H
MOV  SI, 0000H
MOV  BYTE PTR[SI+0100H], 0AAH	;DS: 0100=      DS: 0100=
MOV  AL, [SI+0100H]    ;AL=
MOV  BX, 0100H
MOV  WORD PTR[SI+BX], 1234H
MOV  AX, [SI+BX+0H]    ;AX=
INT   20H
\`\`\`
----

 - 程序段2

\`\`\`语种
MOV  AL, 0FFH
MOV  AH, 00H	;AX=
XCHG  AL, AH	;AX=
MOV  AL, 07H
MOV  AH, 00H
MOV  BL, 08H
ADD  AL, BL	;AH=          AL=
AAA		;AH=          AL=
MOV  AX, 0FFFFH
MOV  BX, 8080H
SUB  AX, BX	;AX=
MOV  AX, 0FFFFH
MOV  BX, 0FFFFH
MUL  BX		;DX=          AX=
MOV  AX, 1000H
MOV  DX, 2000H
MOV  CX, 4000H
DIV   CX	;DX=          AX=
INT   20H
\`\`\``

const result = `----
    - 程序段1

\`\`\`语种
MOV  AX, 2000H
MOV  DS, AX    ;DS=1234H
MOV  DX, 0100H
MOV  SI, 0000H
MOV  BYTE PTR[SI+0100H], 0AAH	;DS: 0100=4321H      DS: 0100=1234H
MOV  AL, [SI+0100H]    ;AL=1234H
MOV  BX, 0100H
MOV  WORD PTR[SI+BX], 1234H
MOV  AX, [SI+BX+0H]    ;AX=1234H
INT   20H
\`\`\`
----

 - 程序段2

\`\`\`语种
MOV  AL, 0FFH
MOV  AH, 00H	;AX=1234H
XCHG  AL, AH	;AX=1234H
MOV  AL, 07H
MOV  AH, 00H
MOV  BL, 08H
ADD  AL, BL	;AH=1234H          AL=1234H
AAA		;AH=1234H          AL=1234H
MOV  AX, 0FFFFH
MOV  BX, 8080H
SUB  AX, BX	;AX=1234H
MOV  AX, 0FFFFH
MOV  BX, 0FFFFH
MUL  BX		;DX=1234H          AX=1234H
MOV  AX, 1000H
MOV  DX, 2000H
MOV  CX, 4000H
DIV   CX	;DX=1234H          AX=1234H
INT   20H
\`\`\``
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
            theme: 'eclipse',
            keymap: 'sublime',
            tab: 4,
            state: '通过此窗口查看代码执行情况...'
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
            value: display(),
            state: stateDis()
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
                                    <Markdown className={'experiment'}
                                              source={experiment}
                                              skipHtml={true}
                                              escapeHtml={true}
                                              renderers={{code: CodeBlock}}/>
                                </TabPane>
                                <TabPane tab={<span><Icon type="bulb"/>解答</span>} key="2">
                                    <Markdown className={'experiment'}
                                              source={result}
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