import React from 'react'
import {Card, Breadcrumb} from 'antd';
import {Link} from 'react-router-dom'
import '../assets/css/Command.css'

class Command extends React.Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        return (
            <div className={'content'}>
                <Breadcrumb style={{margin: '15px 0px', flexBasis: '100%'}}>
                    <Breadcrumb.Item>
                        <Link to={'/'}>
                            Home
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        汇编指令面板
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={'typeBox'}>
                    <p name="type">数据传送指令：</p>
                    <Card title="MOV指令" bordered={true}>
                        <p>描述：赋值指令</p>
                        <p>格式：MOV DST,SRC</p>
                        <p>功能：将SRC赋值给DST</p>
                    </Card>
                    <Card title="PUSH指令" bordered={true}>
                        <p>描述：入栈指令</p>
                        <p>格式：PUSH SRC</p>
                        <p>功能：将SRC入栈</p>
                    </Card>
                    <Card title="POP指令" bordered={true}>
                        <p>描述：出栈指令</p>
                        <p>格式：POP DST</p>
                        <p>功能：将栈顶元素出栈赋值给DST</p>
                    </Card>
                    <Card title="XCHG指令" bordered={true}>
                        <p>描述：数据交换指令</p>
                        <p>格式：XCHG DST,SRC</p>
                        <p>功能：将DST.SRC的值进行交换</p>
                    </Card>
                    <Card title="LEA指令" bordered={true}>
                        <p>描述：取址指令</p>
                        <p>格式：LEA REG,MEM</p>
                        <p>功能：取MEM的偏移地址送到REG中。</p>
                    </Card>
                </div>
                <hr/>
                <div className={'typeBox'}>
                    <p name="type">算术指令：</p>
                    <Card title="ADD指令" bordered={true}>
                        <p>描述：加法指令</p>
                        <p>格式：ADD DST,SRC</p>
                        <p>功能：将DST + REC赋给DST</p>
                    </Card>
                    <Card title="SUB指令" bordered={true}>
                        <p>描述：减法指令</p>
                        <p>格式：SUB DST SRC</p>
                        <p>功能：将DST - REC赋给DST</p>
                    </Card>
                    <Card title="MUL指令" bordered={true}>
                        <p>描述：无符号数乘法</p>
                        <p>格式：MUL SRC</p>
                        <p>功能：将DST * SRC赋给DST</p>
                    </Card>
                    <Card title="DIV指令" bordered={true}>
                        <p>描述：无符号数除法</p>
                        <p>格式：DIV SRC</p>
                        <p>功能：将DST / SRC赋给DST</p>
                    </Card>
                    <Card title="INC指令" bordered={true}>
                        <p>描述：自增指令</p>
                        <p>格式：INC DST</p>
                        <p>功能：将DST + 1赋给DST</p>
                    </Card>
                    <Card title="DEC指令" bordered={true}>
                        <p>描述：自减指令</p>
                        <p>格式：DEC DST</p>
                        <p>功能：将DST - 1赋给DST</p>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Command