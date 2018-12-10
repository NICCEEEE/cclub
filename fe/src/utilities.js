import {message} from 'antd';
import axios from 'axios'

// 处理成功通知
export const success = (words) => {
    message.config({
        top: '6%',
        duration: 3,
    })
    message.success(words)
};

// 处理失败通知
export const error = (words) => {
    message.config({
        top: '6%',
        duration: 3,
    })
    message.error(words)
};

// 改变页面标题
export const changeTitle = (title) => {
    document.title = `${title} | CCLUB`
}

// 函数节流
export const debounce = (fn, delay) => {
    let timer
    return function (event) {
        clearTimeout(timer)
        timer = setTimeout(fn.bind(this, event.target), delay)
    }
}

// 生成验证码
export function getCodeword() {
    axios.get('http://0.0.0.0:2000/api/codeword')
        .then((response) => {
            let data = response.data
            this.setState({
                problem: data
            })
        })
        .catch((error) => {
            console.log(error)
        })
}

// 刷新验证码
export function changeCodeword() {
    this.setState((state) => ({degree: state.degree === 0 ? 360 : state.degree + 360}))
    getCodeword.bind(this)()
}