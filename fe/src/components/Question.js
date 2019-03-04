import React from 'react'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/mdn-like.css';
import {compile, display} from '../coreCompile';
import '../assets/css/Asm.css'
import {Link} from 'react-router-dom'
import '../assets/css/Question.css'

const code = `MOV AX, 0B800h    　　; 将ax设置为 B800h.
MOV DS, AX        　　　; 将 AX 值拷贝到 DS.
MOV CH, 01011111b 　　; 将ch设置为二进制的01011111b
MOV BX, 15Eh     　　　 ;  将 BX 设置成 15Eh.
MOV [BX], CX    　　  ; 将 CX 放到 bx 指出的内存单元 B800:015E`

class Question extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    runCode = () => {
        let rawCode = this.refs.editor.editor.getValue()
        compile(rawCode)
        this.setState({
            value: display()
        })
    }

    render() {
        return (
            <div style={{margin: '60px auto'}}>
                
            </div>
        )
    }
}

export default Question

/*
            <div style={{margin: '60px auto'}}>
                {
                    this.state.value ? <ul>
                        <li>AX: {this.state.value.AX.toUpperCase()}</li>
                        <li>BX: {this.state.value.BX.toUpperCase()}</li>
                        <li>CX: {this.state.value.CX.toUpperCase()}</li>
                        <li>DX: {this.state.value.DX.toUpperCase()}</li>
                        <li>SP: {this.state.value.SP.toUpperCase()}</li>
                        <li>BP: {this.state.value.BP.toUpperCase()}</li>
                        <li>SI: {this.state.value.SI.toUpperCase()}</li>
                        <li>DI: {this.state.value.DI.toUpperCase()}</li>
                        <li>DS: {this.state.value.DS.toUpperCase()}</li>
                        <li>ES: {this.state.value.ES.toUpperCase()}</li>
                        <li>SS: {this.state.value.SS.toUpperCase()}</li>
                        <li>CS: {this.state.value.CS.toUpperCase()}</li>
                    </ul> : <ul>
                        <li>AX: 0000</li>
                        <li>BX: 0000</li>
                        <li>CX: 0000</li>
                        <li>DX: 0000</li>
                        <li>SP: 0000</li>
                        <li>BP: 0000</li>
                        <li>SI: 0000</li>
                        <li>DI: 0000</li>
                        <li>DS: 0000</li>
                        <li>ES: 0000</li>
                        <li>SS: 0000</li>
                        <li>CS: 0000</li>
                    </ul>
                }
                <CodeMirror
                    width='500px'
                    height='500px'
                    value={code}
                    options={{
                        theme: 'mdn-like',
                        keyMap: 'sublime',
                        mode: 'plain',
                    }}
                    ref='editor'
                />
                <button onClick={this.runCode}>运行</button>
            </div>
            */