import React from 'react'
import '../assets/css/Asm.css'
import {Icon, Breadcrumb, Avatar} from 'antd'
import {Link} from 'react-router-dom'

class Asm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            board: '汇编实验楼'
        }
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
                        <Link to={'/'}>
                            {this.state.board}
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={'asmBox'}>
                    <div className={'leftBox'}>
                        <div className={'courseTitle'}>
                            <div className={'title'}>《微型计算机系统原理及应用》杨素行等编著配套汇编语言实验</div>
                            <div>
                                本课程实验是基于《微型计算机系统原理及应用》（杨素行 编著，清华大学出版社）制作，
                                可以配合该教材使用，在CCLUB汇编实验楼环境中完成教材中所有实例及实验。
                            </div>
                            <button>开始实验</button>
                        </div>
                        <div className={'testList'}>
                            <ul>
                                <li>实验列表</li>
                            </ul>
                            <div className={'testItem'}>
                                <Icon style={{'fontSize': '20px', 'margin': '0 15px', 'color': 'lightgray'}} type="check-circle" theme="filled" />
                                <span className={'testIndex'}>实验一</span>
                                <span className={'testName'}>简单汇编程序调试一</span>
                                <Link to={'/Question'}><button>开始实验</button></Link>
                            </div>
                            <div className={'testItem'}>
                                <Icon style={{'fontSize': '20px', 'margin': '0 15px', 'color': 'lightgray'}} type="check-circle" theme="filled" />
                                <span className={'testIndex'}>实验一</span>
                                <span className={'testName'}>简单汇编程序调试一</span>
                                <button>开始实验</button>
                            </div>
                            <div className={'testItem'}>
                                <Icon style={{'fontSize': '20px', 'margin': '0 15px', 'color': 'lightgray'}} type="check-circle" theme="filled" />
                                <span className={'testIndex'}>实验一</span>
                                <span className={'testName'}>简单汇编程序调试一</span>
                                <button>开始实验</button>
                            </div>
                            <div className={'testItem'}>
                                <Icon style={{'fontSize': '20px', 'margin': '0 15px', 'color': 'lightgray'}} type="check-circle" theme="filled" />
                                <span className={'testIndex'}>实验一</span>
                                <span className={'testName'}>简单汇编程序调试一</span>
                                <button>开始实验</button>
                            </div>
                            <div className={'testItem'}>
                                <Icon style={{'fontSize': '20px', 'margin': '0 15px', 'color': 'lightgray'}} type="check-circle" theme="filled" />
                                <span className={'testIndex'}>实验一</span>
                                <span className={'testName'}>简单汇编程序调试一</span>
                                <button>开始实验</button>
                            </div>
                            <div className={'testItem'}>
                                <Icon style={{'fontSize': '20px', 'margin': '0 15px', 'color': 'lightgray'}} type="check-circle" theme="filled" />
                                <span className={'testIndex'}>实验一</span>
                                <span className={'testName'}>简单汇编程序调试一</span>
                                <button>开始实验</button>
                            </div>
                        </div>
                    </div>
                    <aside className={'rightBox'}>
                        <div className={'book'}>
                            <ul>
                                <li>参考书籍</li>
                            </ul>
                            <img src={require('../assets/images/bookCover.png')}/>
                            <div className={'bookDetail'}>
                                <div id={'bookName'}>
                                    书名：《微型计算机系统原理及应用》杨素行等编著教材
                                </div>
                                <div id={'author'}>
                                    作者：杨素行等
                                </div>
                                <div id={'detail'}>
                                    简介：《微型计算机系统原理及应用（第3版）/清华大学计算机基础教育课程系列教材》
                                    主要面向高等院校工科非计算机专业的学生。本次修订注意强化计算机近年来的新
                                    发展和应用的内容，同时删减比较陈旧的内容和非教学重点的内容，进一步加强实用性和教学适用性。
                                </div>
                                <div id={'bookLink'}>
                                    <a href={'https://item.jd.com/12504148.html'}>购书链接>></a>
                                </div>
                            </div>
                        </div>
                        <div className={'teacher'}>
                            <ul>
                                <li>课程教师</li>
                            </ul>
                            <div className={'teacherDetail'}>
                                <div>
                                    <Avatar size={64} src={require('../assets/images/github.png')} />
                                </div>
                                <div className={'profile'}>
                                    <div>杨素行</div>
                                    <div>清华大学</div>
                                    <div>
                                        女，教授，1936年生。江苏南京人。1959年毕业于清华大学自动化系。现任清华大学自
                                        动化系教授。北京电子学会教育委员会委员，电子线路分会理事。
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        )
    }
}

export default Asm