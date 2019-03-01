// 通用寄存器
let ax = {h: '00', l: '00'}, bx = {h: '00', l: '00'}, cx = {h: '00', l: '00'}, dx = {h: '00', l: '00'}
let si = '0000', di = '0000', bp = '0000', sp = '0000'

// 段寄存器
let cs = '0000', ds = '0000', es = '0000', ss = '0000'

// 标志位
let cf = 0, zf = 0

// 合法16位寄存器
let reg88 = {ax: ax, bx: bx, cx: cx, dx: dx}
let reg16 = {di: di, si: si, bp: bp, sp: sp}

// 合法8位寄存器
let reg8 = {ah: ax.h, al: ax.l, bl: bx.l, bh: bx.h, ch: cx.h, cl: cx.l, dh: dx.h, dl: dx.l}

// 合法段寄存器
let sreg = {cs: cs, ds: ds, es: es, ss: ss}

// 内存堆
let memories = {}

// 堆栈数组
let stack = []

// 非法符号
const invalid = '`~！!@#￥$%^…；：;…&*()_——=【】{}、|『』，:「」"\'『』《》<>？、/,'

// 指令字典
let instructions = {
    mov: funcMov,
    push: funcPush,
    pop: funcPop,
    xchg: funcXchg,
    lea: funcLea,
    add: funcAdd,
    sub: funcSub,
}

// 检查非法字符
function checkParam(code) {
    for (let i = 0; i < invalid.length; i++) {
        if (code.includes(invalid[i])) {
            return 'invalid'
        }
    }
}

// 检查立即数
function checkImmediate(immediate) {
    let re2 = /^[a-fA-F\d]{1,2}[hH]$/
    let re4 = /^[a-fA-F\d]{3,4}[hH]$/
    let bin8 = /^[01]{8}[bB]$/
    let bin16 = /^[01]{16}[bB]$/
    if (re2.test(immediate)) {
        return 'immediate-l'
    } else if (re4.test(immediate)) {
        return 'immediate-h'
    } else if (bin8.test(immediate)) {
        return 'bin8'
    } else if (bin16.test(immediate)) {
        return 'bin16'
    } else {
        return null
    }
}

// 检查内存块
function checkMemory(memory) {
    memory = memory.slice(1, -1)
    memory = memory.split('+')
    let validAddress = ['bx', 'si', 'di', 'bp']
    let address = 0
    for (let i = 0; i < memory.length; i++) {
        let addr = memory[i].toLowerCase()
        if (validAddress.includes(addr)) {
            if (addr === 'bx') {
                address += parseInt(reg88.bx.h + reg88.bx.l, 16)
            } else {
                address += parseInt(reg16[addr], 16)
            }
        } else {
            return 'error'
        }
    }
    if (address === 0) {
        address = '0000'
    } else {
        address = address.toString(16)
    }
    console.log(memories)
    return 'memory:' + address
}

// 检查目标操作数
function checkDst(dst, ins) {
    switch (ins) {
        case 'mov':
            if (dst in reg16) {
                return 'reg16'
            } else if (dst in reg88) {
                return 'reg88'
            } else if (dst in reg8) {
                return 'reg8'
            } else if (dst in sreg && dst !== 'cs') {
                return 'sreg'
            } else if (dst.startsWith('[') && dst.endsWith(']')) {
                return checkMemory(dst) === 'error' ? 'error' : checkMemory(dst)
            } else {
                return 'error'
            }
        case 'xchg':
            if (dst in reg16) {
                return 'reg16'
            } else if (dst in reg88) {
                return 'reg88'
            } else if (dst in reg8) {
                return 'reg8'
            } else if (dst.startsWith('[') && dst.endsWith(']')) {
                return checkMemory(dst) === 'error' ? 'error' : checkMemory(dst)
            } else {
                return 'error'
            }
        case 'lea':
            if (dst in reg16) {
                return 'reg16'
            } else if (dst in reg88) {
                return 'reg88'
            } else if (dst in sreg) {
                return 'sreg'
            } else {
                return 'error'
            }
        case 'add':
            if (dst in reg16) {
                return 'reg16'
            } else if (dst in reg88) {
                return 'reg88'
            } else if (dst in reg8) {
                return 'reg8'
            } else if (dst.startsWith('[') && dst.endsWith(']')) {
                return checkMemory(dst) === 'error' ? 'error' : checkMemory(dst)
            } else {
                return 'error'
            }
        case 'sub':
            if (dst in reg16) {
                return 'reg16'
            } else if (dst in reg88) {
                return 'reg88'
            } else if (dst in reg8) {
                return 'reg8'
            } else if (dst.startsWith('[') && dst.endsWith(']')) {
                return checkMemory(dst) === 'error' ? 'error' : checkMemory(dst)
            } else {
                return 'error'
            }
        default:
            return '其它指令'
    }
}

// 检查源操作数
function checkSrc(src, ins) {
    switch (ins) {
        case 'mov':
            if (src in reg16) {
                return 'reg16'
            } else if (src in reg88) {
                return 'reg88'
            } else if (src in reg8) {
                return 'reg8'
            } else if (src in sreg) {
                return 'sreg'
            } else if (src.startsWith('[') && src.endsWith(']')) {
                return checkMemory(src) === 'error' ? 'error' : checkMemory(src)
            } else if (checkImmediate(src)) {
                return checkImmediate(src)
            } else {
                return 'error'
            }
        case 'xchg':
            if (src in reg16) {
                return 'reg16'
            } else if (src in reg88) {
                return 'reg88'
            } else if (src in reg8) {
                return 'reg8'
            } else if (src.startsWith('[') && src.endsWith(']')) {
                return checkMemory(src) === 'error' ? 'error' : checkMemory(src)
            } else {
                return 'error'
            }
        case 'lea':
            if (src.startsWith('[') && src.endsWith(']')) {
                return checkMemory(src) === 'error' ? 'error' : checkMemory(src)
            } else {
                return 'error'
            }
        case 'add':
            if (src in reg16) {
                return 'reg16'
            } else if (src in reg88) {
                return 'reg88'
            } else if (src in reg8) {
                return 'reg8'
            } else if (src.startsWith('[') && src.endsWith(']')) {
                return checkMemory(src) === 'error' ? 'error' : checkMemory(src)
            } else if (checkImmediate(src)) {
                return checkImmediate(src)
            } else {
                return 'error'
            }
        case 'sub':
            if (src in reg16) {
                return 'reg16'
            } else if (src in reg88) {
                return 'reg88'
            } else if (src in reg8) {
                return 'reg8'
            } else if (src.startsWith('[') && src.endsWith(']')) {
                return checkMemory(src) === 'error' ? 'error' : checkMemory(src)
            } else if (checkImmediate(src)) {
                return checkImmediate(src)
            } else {
                return 'error'
            }
        default:
            return '其它指令'
    }
}

// MOV指令函数
function funcMov(cmdLine, lineNum) {
    if (!cmdLine.includes(',')) {
        console.log(`第${lineNum}行语法错误!`)
        return 'error'
    }
    // 去两边空格、注释、逗号获得命令主体
    cmdLine = cmdLine.trim().split(';')[0]
    cmdLine = cmdLine.replace(',', ' ')
    if (!(cmdLine.split(/\s+/g).length === 3 || cmdLine.split(/\s+/g).length === 4)) {
        console.log(`第${lineNum}行语法错误!`, cmdLine)
        return 'error'
    }
    // 检查非法字符
    if (checkParam(cmdLine) === 'invalid') {
        console.log(`第${lineNum}行含有非法字符!`)
        return 'error'
    }
    // 取目标寄存器或目标内存单元
    let dst = cmdLine.split(/\s+/g)[1].toLowerCase()
    let src = cmdLine.split(/\s+/g)[2].toLowerCase()
    let typeDst = checkDst(dst, 'mov')
    let typeSrc = checkSrc(src, 'mov')
    if (typeDst === 'error') {
        console.log(`第${lineNum}行含有非法操作符${dst}!`)
        return 'error'
    } else if (typeSrc === 'error') {
        console.log(`第${lineNum}行含有非法操作符${src}!`)
        return 'error'
    }
    console.log(typeDst, typeSrc)
    // 执行相应mov操作
    // dst => reg16 reg88 reg8 sreg memory
    // src => reg16 reg88 reg8 sreg memory immediate-l immediate-h bin8 bin16
    if (typeDst === 'reg16') {
        if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16).toString(16)
            src = '0'.repeat(4 - src.length) + src
            reg16[dst] = src
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2).toString(16)
            src = '0'.repeat(4 - src.length) + src
            reg16[dst] = src
        } else if (typeSrc === typeDst) {
            reg16[dst] = reg16[src]
        } else if (typeSrc === 'sreg') {
            reg16[dst] = sreg[src]
        } else if (typeSrc === 'reg88') {
            reg16[dst] = reg88[src].h + reg88[src].l
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = '0'.repeat(4 - src.length) + src
            } else {
                src = '0000'
            }
            reg16[dst] = src
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else if (typeDst === 'reg88') {
        if (typeSrc === typeDst) {
            reg88[dst].h = reg88[src].h
            reg88[dst].l = reg88[src].l
        } else if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16).toString(16)
            src = '0'.repeat(4 - src.length) + src
            let h = src.slice(0, 2)
            let l = src.slice(2, 4)
            reg88[dst].h = h
            reg88[dst].l = l
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2).toString(16)
            src = '0'.repeat(4 - src.length) + src
            let h = src.slice(0, 2)
            let l = src.slice(2, 4)
            reg88[dst].h = h
            reg88[dst].l = l
        } else if (typeSrc === 'sreg') {
            src = sreg[src]
            src = '0'.repeat(4 - src.length) + src
            let h = src.slice(0, 2)
            let l = src.slice(2, 4)
            reg88[dst].h = h
            reg88[dst].l = l
        } else if (typeSrc === 'reg16') {
            src = reg16[src]
            src = '0'.repeat(4 - src.length) + src
            let h = src.slice(0, 2)
            let l = src.slice(2, 4)
            reg88[dst].h = h
            reg88[dst].l = l
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = '0'.repeat(4 - src.length) + src
            } else {
                src = '0000'
            }
            let h = src.slice(0, 2)
            let l = src.slice(2, 4)
            reg88[dst].h = h
            reg88[dst].l = l
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else if (typeDst === 'reg8') {
        if (typeSrc === typeDst) {
            reg88[dst[0] + 'x'][dst[1]] = reg88[src[0] + 'x'][src[1]]
        } else if (typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16).toString(16)
            src = '0'.repeat(2 - src.length) + src
            reg88[dst[0] + 'x'][dst[1]] = src
        } else if (typeSrc === 'bin8') {
            src = parseInt(src, 2).toString(16)
            src = '0'.repeat(2 - src.length) + src
            reg88[dst[0] + 'x'][dst[1]] = src
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = '0'.repeat(4 - src.length) + src
                src = src.slice(2, 4)
            } else {
                src = '00'
            }
            reg88[dst[0] + 'x'][dst[1]] = src
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else if (typeDst === 'sreg') {
        if (typeSrc === typeDst) {
            sreg[dst] = sreg[src]
        } else if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16).toString(16)
            src = '0'.repeat(4 - src.length) + src
            sreg[dst] = src
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2).toString(16)
            src = '0'.repeat(4 - src.length) + src
            sreg[dst] = src
        } else if (typeSrc === 'reg88') {
            sreg[dst] = reg88[src].h + reg88[src].l
        } else if (typeSrc === 'sreg') {
            sreg[dst] = reg16[src]
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = '0'.repeat(4 - src.length) + src
            } else {
                src = '0000'
            }
            sreg[dst] = src
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else {
        if (typeSrc === 'reg16') {
            src = reg16[src]
            src = '0'.repeat(4 - src.length) + src
            memories[typeDst.split(':')[1]] = src
        } else if (typeSrc === 'reg88') {
            memories[typeDst.split(':')[1]] = reg88[src].h + reg88[src].l
        } else if (typeSrc === 'sreg') {
            src = sreg[src]
            src = '0'.repeat(4 - src.length) + src
            memories[typeDst.split(':')[1]] = src
        } else if (typeSrc === 'reg8') {
            src = reg88[src[0] + 'x'][src[1]]
            src = '0'.repeat(4 - src.length) + src
            memories[typeDst.split(':')[1]] = src
        } else if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16).toString(16)
            src = '0'.repeat(4 - src.length) + src
            memories[typeDst.split(':')[1]] = src
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2).toString(16)
            src = '0'.repeat(4 - src.length) + src
            memories[typeDst.split(':')[1]] = src
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    }
    console.log(cmdLine.split(/\s+/g))
}

// PUSH指令函数
function funcPush(cmdLine, lineNum) {
    let src = cmdLine.trim().split(';')[0].slice(4).split(/\s+/)[1]
    if (src in reg16) {
        stack.push(reg16[src])
    } else if (src in reg88) {
        stack.push(reg88[src].h + reg88[src].l)
    } else if (src in sreg) {
        stack.push(sreg[src])
    } else if (checkMemory(src).includes('memory')) {
        let value = memories[checkMemory(src).split(':')[1]]
        if (value) {
            stack.push(value)
        } else {
            stack.push('0000')
        }
    } else {
        console.log(`第${lineNum}行语法错误`)
        return 'error'
    }
    console.log(stack)
    console.log(cmdLine)
}

// POP指令函数
function funcPop(cmdLine, lineNum) {
    let src = cmdLine.trim().split(';')[0].slice(3).split(/\s+/)[1]
    if (stack.length === 0) {
        console.log('当前堆栈为空！')
        return 'error'
    }
    if (src in reg16) {
        reg16[src] = stack.pop()
    } else if (src in reg88) {
        let value = stack.pop()
        reg88[src].h = value.slice(0, 2)
        reg88[src].l = value.slice(2, 4)
    } else if (src in sreg) {
        sreg[src] = stack.pop()
    } else if (checkMemory(src).includes('memory')) {
        memories[checkMemory(src).split(':')[1]] = stack.pop()
    } else {
        console.log(`第${lineNum}行语法错误`)
        return 'error'
    }
    console.log(stack)
    console.log(cmdLine)
}

// XCHG指令函数
function funcXchg(cmdLine, lineNum) {
    if (!cmdLine.includes(',')) {
        console.log(`第${lineNum}行语法错误!`)
        return 'error'
    }
    // 去两边空格、注释、逗号获得命令主体
    cmdLine = cmdLine.trim().split(';')[0]
    cmdLine = cmdLine.replace(',', ' ')
    if (!(cmdLine.split(/\s+/g).length === 3 || cmdLine.split(/\s+/g).length === 4)) {
        console.log(`第${lineNum}行语法错误!`, cmdLine)
        return 'error'
    }
    // 检查非法字符
    if (checkParam(cmdLine) === 'invalid') {
        console.log(`第${lineNum}行含有非法字符!`)
        return 'error'
    }
    let dst = cmdLine.split(/\s+/g)[1].toLowerCase()
    let src = cmdLine.split(/\s+/g)[2].toLowerCase()
    let typeDst = checkDst(dst, 'xchg')
    let typeSrc = checkSrc(src, 'xchg')
    // 具体类型具体操作
    // src dst reg88 reg8 reg16 memory 
    if (typeDst === 'reg8') {
        if (typeSrc === 'reg8') {
            let transfer = reg88[dst[0] + 'x'][dst[1]]
            reg88[dst[0] + 'x'][dst[1]] = reg88[src[0] + 'x'][src[1]]
            reg88[src[0] + 'x'][src[1]] = transfer
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = src.slice(-2)
            } else {
                src = '00'
            }
            let transfer = reg88[dst[0] + 'x'][dst[1]]
            reg88[dst[0] + 'x'][dst[1]] = src
            memories[typeSrc.split(':')[1]] = '0'.repeat(4 - transfer.length) + transfer
        } else {
            console.log(`第${lineNum}行语法错误,请确认类型是否匹配!`)
            return 'error'
        }
    } else if (typeDst === 'reg16') {
        if (typeSrc === typeDst) {
            let transfer = reg16[dst]
            reg16[dst] = reg16[src]
            reg16[src] = transfer
        } else if (typeSrc === 'reg88') {
            let transfer = reg16[dst]
            reg16[dst] = reg88[src].h + reg88[src].l
            reg88[src].h = transfer.slice(0, 2)
            reg88[src].l = transfer.slice(2, 4)
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = '0'.repeat(4 - src.length) + src
            } else {
                src = '0000'
            }
            let transfer = reg16[dst]
            reg16[dst] = src
            memories[typeSrc.split(':')[1]] = transfer
        } else {
            console.log(`第${lineNum}行语法错误,请确认类型是否匹配!`)
            return 'error'
        }
    } else if (typeDst === 'reg88') {
        if (typeSrc === typeDst) {
            let transfer = reg88[dst].h + reg88[dst].l
            reg88[dst].h = reg88[src].h
            reg88[dst].l = reg88[src].l
            reg88[src].h = transfer.slice(0, 2)
            reg88[src].l = transfer.slice(2, 4)
        } else if (typeSrc === 'reg16') {
            let transfer = reg88[dst].h + reg88[dst].l
            reg88[dst].h = reg16[src].slice(0, 2)
            reg88[dst].l = reg16[src].slice(2, 4)
            reg16[src] = transfer
        } else if (typeSrc.includes('memory')) {
            let transfer = reg88[dst].h + reg88[dst].l
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = '0'.repeat(4 - src.length) + src
            } else {
                src = '0000'
            }
            reg88[dst].h = src.slice(0, 2)
            reg88[dst].l = src.slice(2, 4)
            memories[typeSrc.split(':')[1]] = transfer
        } else {
            console.log(`第${lineNum}行语法错误,请确认类型是否匹配!`)
            return 'error'
        }
    } else {
        if (typeSrc === 'reg88') {
            let transfer = memories[typeDst.split(':')[1]]
            memories[typeDst.split(':')[1]] = reg88[src].h + reg88[src].l
            reg88[src].h = transfer.slice(0, 2)
            reg88[src].l = transfer.slice(2, 4)
        } else if (typeSrc === 'reg16') {
            let transfer = memories[typeDst.split(':')[1]]
            memories[typeDst.split(':')[1]] = reg16[src]
            reg16[src] = transfer
        } else if (typeSrc.includes('memory')) {
            let transfer = memories[typeDst.split(':')[1]]
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = '0'.repeat(4 - src.length) + src
            } else {
                src = '0000'
            }
            memories[typeDst.split(':')[1]] = src
            memories[typeSrc.split(':')[1]] = transfer
        }
    }
    console.log(dst, src)
}

// LEA指令函数
function funcLea(cmdLine, lineNum) {
    if (!cmdLine.includes(',')) {
        console.log(`第${lineNum}行语法错误!`)
        return 'error'
    }
    // 去两边空格、注释、逗号获得命令主体
    cmdLine = cmdLine.trim().split(';')[0]
    cmdLine = cmdLine.replace(',', ' ')
    if (!(cmdLine.split(/\s+/g).length === 3 || cmdLine.split(/\s+/g).length === 4)) {
        console.log(`第${lineNum}行语法错误!`, cmdLine)
        return 'error'
    }
    // 检查非法字符
    if (checkParam(cmdLine) === 'invalid') {
        console.log(`第${lineNum}行含有非法字符!`)
        return 'error'
    }
    let dst = cmdLine.split(/\s+/g)[1].toLowerCase()
    let src = cmdLine.split(/\s+/g)[2].toLowerCase()
    let typeDst = checkDst(dst, 'lea')
    let typeSrc = checkSrc(src, 'lea')
    console.log(typeDst, typeSrc)
    if (typeDst === 'reg16') {
        if (typeSrc.includes('memory')) {
            let address = typeSrc.split(':')[1]
            if (address.length > 4) {
                address = address.slice(-4)
            }
            reg16[dst] = address
        } else {
            console.log(`第${lineNum}错误！源操作数必须是内存块。`)
            return 'error'
        }
    } else if (typeDst === 'sreg') {
        if (typeSrc.includes('memory')) {
            let address = typeSrc.split(':')[1]
            if (address.length > 4) {
                address = address.slice(-4)
            }
            sreg[dst] = address
        } else {
            console.log(`第${lineNum}错误！源操作数必须是内存块。`)
            return 'error'
        }
    } else if (typeDst === 'reg88') {
        if (typeSrc.includes('memory')) {
            let address = typeSrc.split(':')[1]
            if (address.length > 4) {
                address = address.slice(-4)
            }
            reg88[dst].h = address.slice(0, 2)
            reg88[dst].l = address.slice(2, 4)
        } else {
            console.log(`第${lineNum}错误！源操作数必须是内存块。`)
            return 'error'
        }
    }
}

// ADD指令函数
function funcAdd(cmdLine, lineNum) {
    if (!cmdLine.includes(',')) {
        console.log(`第${lineNum}行语法错误!`)
        return 'error'
    }
    // 去两边空格、注释、逗号获得命令主体
    cmdLine = cmdLine.trim().split(';')[0]
    cmdLine = cmdLine.replace(',', ' ')
    if (!(cmdLine.split(/\s+/g).length === 3 || cmdLine.split(/\s+/g).length === 4)) {
        console.log(`第${lineNum}行语法错误!`, cmdLine)
        return 'error'
    }
    // 检查非法字符
    if (checkParam(cmdLine) === 'invalid') {
        console.log(`第${lineNum}行含有非法字符!`)
        return 'error'
    }
    let dst = cmdLine.split(/\s+/g)[1].toLowerCase()
    let src = cmdLine.split(/\s+/g)[2].toLowerCase()
    let typeDst = checkDst(dst, 'add')
    let typeSrc = checkSrc(src, 'add')
    // 执行相应add操作
    // dst => reg16 reg88 reg8 memory
    // src => reg16 reg88 reg8 memory immediate-l immediate-h bin8 bin16
    if (typeDst === 'reg16') {
        if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16)
            reg16[dst] = (parseInt(reg16[dst], 16) + src).toString(16).slice(-4)
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2)
            reg16[dst] = (parseInt(reg16[dst], 16) + src).toString(16).slice(-4)
        } else if (typeSrc === typeDst) {
            reg16[dst] = (parseInt(reg16[dst], 16) + parseInt(reg16[src], 16)).toString(16).slice(-4)
        } else if (typeSrc === 'reg88') {
            reg16[dst] = (parseInt(reg16[dst], 16) + parseInt(reg88[src].h + reg88[src].l, 16)).toString(16).slice(-4)
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                reg16[dst] = (parseInt(reg16[dst], 16) + parseInt(src, 16)).toString(16).slice(-4)
            }
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else if (typeDst === 'reg88') {
        if (typeSrc === typeDst) {
            let value = (parseInt(reg88[dst].h + reg88[dst].l, 16) + parseInt(reg88[src].h + reg88[src].l, 16)).toString(16).slice(-4)
            reg88[dst].h = value.slice(0, 2)
            reg88[dst].l = value.slice(2, 4)
        } else if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16)
            let value = (parseInt(reg88[dst].h + reg88[dst].l, 16) + src).toString(16).slice(-4)
            reg88[dst].h = value.slice(0, 2)
            reg88[dst].l = value.slice(2, 4)
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2)
            let value = (parseInt(reg88[dst].h + reg88[dst].l, 16) + src).toString(16).slice(-4)
            reg88[dst].h = value.slice(0, 2)
            reg88[dst].l = value.slice(2, 4)
        } else if (typeSrc === 'reg16') {
            src = reg16[src]
            let value = (parseInt(reg88[dst].h + reg88[dst].l, 16) + parseInt(src, 16)).toString(16).slice(-4)
            reg88[dst].h = value.slice(0, 2)
            reg88[dst].l = value.slice(2, 4)
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                let value = (parseInt(reg88[dst].h + reg88[dst].l, 16) + parseInt(src, 16)).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
            }
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else if (typeDst === 'reg8') {
        if (typeSrc === typeDst) {
            reg88[dst[0] + 'x'][dst[1]] = (parseInt(reg88[dst[0] + 'x'][dst[1]], 16) + parseInt(reg88[src[0] + 'x'][src[1]], 16)).toString(16).slice(-2)
        } else if (typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            reg88[dst[0] + 'x'][dst[1]] = (parseInt(reg88[dst[0] + 'x'][dst[1]], 16) + parseInt(src, 16)).toString(16).slice(-2)
        } else if (typeSrc === 'bin8') {
            reg88[dst[0] + 'x'][dst[1]] = (parseInt(reg88[dst[0] + 'x'][dst[1]], 16) + parseInt(src, 2)).toString(16).slice(-2)
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                reg88[dst[0] + 'x'][dst[1]] = (parseInt(reg88[dst[0] + 'x'][dst[1]], 16) + parseInt(src, 16)).toString(16).slice(-2)
            }
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else {
        if (typeSrc === 'reg16') {
            src = reg16[src]
            memories[typeDst.split(':')[1]] = (parseInt(src, 16) + parseInt(memories[typeDst.split(':')[1]], 16)).toString(16).slice(-4)
        } else if (typeSrc === 'reg88') {
            memories[typeDst.split(':')[1]] = (parseInt(reg88[src].h + reg88[src].l, 16) + parseInt(memories[typeDst.split(':')[1]], 16)).toString(16).slice(-4)
        } else if (typeSrc === 'reg8') {
            src = reg88[src[0] + 'x'][src[1]]
            memories[typeDst.split(':')[1]] = (parseInt(src, 16) + parseInt(memories[typeDst.split(':')[1]], 16)).toString(16).slice(-4)
        } else if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            memories[typeDst.split(':')[1]] = (parseInt(src, 16) + parseInt(memories[typeDst.split(':')[1]], 16)).toString(16).slice(-4)
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            memories[typeDst.split(':')[1]] = (parseInt(src, 2) + parseInt(memories[typeDst.split(':')[1]], 16)).toString(16).slice(-4)
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    }
    console.log(cmdLine.split(/\s+/g))
}

// SUB指令函数
function funcSub(cmdLine, lineNum) {
    if (!cmdLine.includes(',')) {
        console.log(`第${lineNum}行语法错误!`)
        return 'error'
    }
    // 去两边空格、注释、逗号获得命令主体
    cmdLine = cmdLine.trim().split(';')[0]
    cmdLine = cmdLine.replace(',', ' ')
    if (!(cmdLine.split(/\s+/g).length === 3 || cmdLine.split(/\s+/g).length === 4)) {
        console.log(`第${lineNum}行语法错误!`, cmdLine)
        return 'error'
    }
    // 检查非法字符
    if (checkParam(cmdLine) === 'invalid') {
        console.log(`第${lineNum}行含有非法字符!`)
        return 'error'
    }
    let dst = cmdLine.split(/\s+/g)[1].toLowerCase()
    let src = cmdLine.split(/\s+/g)[2].toLowerCase()
    let typeDst = checkDst(dst, 'sub')
    let typeSrc = checkSrc(src, 'sub')
    // 执行相应sub操作
    // dst => reg16 reg88 reg8 memory
    // src => reg16 reg88 reg8 memory immediate-l immediate-h bin8 bin16
    if (typeDst === 'reg16') {
        if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16)
            if (parseInt(reg16[dst], 16) > src) {
                reg16[dst] = (parseInt(reg16[dst], 16) - src).toString(16).slice(-4)
            } else {
                reg16[dst] = (parseInt('1' + reg16[dst], 16) - src).toString(16).slice(-4)
                cf = 1
            }
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2)
            if (parseInt(reg16[dst], 16) > src) {
                reg16[dst] = (parseInt(reg16[dst], 16) - src).toString(16).slice(-4)
            } else {
                reg16[dst] = (parseInt('1' + reg16[dst], 16) - src).toString(16).slice(-4)
                cf = 1
            }
        } else if (typeSrc === typeDst) {
            if (parseInt(reg16[dst], 16) > parseInt(reg16[src], 16)) {
                reg16[dst] = (parseInt(reg16[dst], 16) - parseInt(reg16[src], 16)).toString(16).slice(-4)
            } else {
                reg16[dst] = (parseInt('1' + reg16[dst], 16) - parseInt(reg16[src], 16)).toString(16).slice(-4)
                cf = 1
            }
        } else if (typeSrc === 'reg88') {
            let value = parseInt(reg88[src].h + reg88[src].l, 16)
            if (parseInt(reg16[dst], 16) > src) {
                reg16[dst] = (parseInt(reg16[dst], 16) - value).toString(16).slice(-4)
            } else {
                reg16[dst] = (parseInt('1' + reg16[dst], 16) - value).toString(16).slice(-4)
                cf = 1
            }
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                if (parseInt(reg16[dst], 16) > parseInt(src, 16)) {
                    reg16[dst] = (parseInt(reg16[dst], 16) - parseInt(src, 16)).toString(16).slice(-4)
                } else {
                    reg16[dst] = (parseInt('1' + reg16[dst], 16) - parseInt(src, 16)).toString(16).slice(-4)
                    cf = 1
                }
            }
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else if (typeDst === 'reg88') {
        if (typeSrc === typeDst) {
            let valueSrc = parseInt(reg88[src].h + reg88[src].l, 16)
            let valueDst = parseInt(reg88[dst].h + reg88[dst].l, 16)
            if (valueDst > valueSrc) {
                let value = (valueDst - valueSrc).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
            } else {
                let value = (parseInt('1' + reg88[dst].h + reg88[dst].l, 16) - valueSrc).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
                cf = 1
            }
        } else if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16)
            let valueDst = parseInt(reg88[dst].h + reg88[dst].l, 16)
            if (valueDst > src) {
                let value = (valueDst - src).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
            } else {
                let value = (parseInt('1' + reg88[dst].h + reg88[dst].l, 16) - src).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
                cf = 1
            }
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2)
            let valueDst = parseInt(reg88[dst].h + reg88[dst].l, 16)
            if (valueDst > src) {
                let value = (valueDst - src).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
            } else {
                let value = (parseInt('1' + reg88[dst].h + reg88[dst].l, 16) - src).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
                cf = 1
            }
        } else if (typeSrc === 'reg16') {
            src = reg16[src]
            let valueDst = parseInt(reg88[dst].h + reg88[dst].l, 16)
            if (valueDst > src) {
                let value = (valueDst - parseInt(src, 16)).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
            } else {
                let value = (parseInt('1' + reg88[dst].h + reg88[dst].l, 16) - parseInt(src, 16)).toString(16).slice(-4)
                reg88[dst].h = value.slice(0, 2)
                reg88[dst].l = value.slice(2, 4)
                cf = 1
            }
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            let valueDst = parseInt(reg88[dst].h + reg88[dst].l, 16)
            if (src) {
                if (valueDst > parseInt(src, 16)) {
                    let value = (valueDst - parseInt(src, 16)).toString(16).slice(-4)
                    reg88[dst].h = value.slice(0, 2)
                    reg88[dst].l = value.slice(2, 4)
                } else {
                    let value = (parseInt('1' + reg88[dst].h + reg88[dst].l, 16) - parseInt(src, 16)).toString(16).slice(-4)
                    reg88[dst].h = value.slice(0, 2)
                    reg88[dst].l = value.slice(2, 4)
                    cf = 1
                }
            }
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else if (typeDst === 'reg8') {
        if (typeSrc === typeDst) {
            src = parseInt(reg88[src[0] + 'x'][src[1]], 16)
            let valueDst = parseInt(reg88[dst[0] + 'x'][dst[1]], 16)
            if (valueDst > src) {
                reg88[dst[0] + 'x'][dst[1]] = (valueDst - src).toString(16).slice(-2)
            } else {
                reg88[dst[0] + 'x'][dst[1]] = (parseInt('1' + reg88[dst[0] + 'x'][dst[1]], 16) - src).toString(16).slice(-2)
                cf = 1
            }
        } else if (typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16)
            let valueDst = parseInt(reg88[dst[0] + 'x'][dst[1]], 16)
            if (valueDst > src) {
                reg88[dst[0] + 'x'][dst[1]] = (valueDst - src).toString(16).slice(-2)
            } else {
                reg88[dst[0] + 'x'][dst[1]] = (parseInt('1' + reg88[dst[0] + 'x'][dst[1]], 16) - src).toString(16).slice(-2)
                cf = 1
            }
        } else if (typeSrc === 'bin8') {
            src = parseInt(src, 2)
            let valueDst = parseInt(reg88[dst[0] + 'x'][dst[1]], 16)
            if (valueDst > src) {
                reg88[dst[0] + 'x'][dst[1]] = (valueDst - src).toString(16).slice(-2)
            } else {
                reg88[dst[0] + 'x'][dst[1]] = (parseInt('1' + reg88[dst[0] + 'x'][dst[1]], 16) - src).toString(16).slice(-2)
                cf = 1
            }
        } else if (typeSrc.includes('memory')) {
            src = memories[typeSrc.split(':')[1]]
            if (src) {
                src = parseInt(src.slice(-2), 16)
                let valueDst = parseInt(reg88[dst[0] + 'x'][dst[1]], 16)
                if (valueDst > src) {
                    reg88[dst[0] + 'x'][dst[1]] = (valueDst - src).toString(16).slice(-2)
                } else {
                    reg88[dst[0] + 'x'][dst[1]] = (parseInt('1' + reg88[dst[0] + 'x'][dst[1]], 16) - src).toString(16).slice(-2)
                    cf = 1
                }
            }
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else {
        if (typeSrc === 'reg16') {
            src = reg16[src]
            src = parseInt(src, 16)
            let valueDst = parseInt(memories[typeDst.split(':')[1]], 16)
            if (valueDst > src) {
                memories[typeDst.split(':')[1]] = (valueDst - src).toString(16).slice(-4)
            } else {
                memories[typeDst.split(':')[1]] = (parseInt('1' + memories[typeDst.split(':')[1]], 16) - src).toString(16).slice(-4)
                cf = 1
            }
        } else if (typeSrc === 'reg88') {
            src = parseInt(reg88[src].h + reg88[src].l, 16)
            let valueDst = parseInt(memories[typeDst.split(':')[1]], 16)
            if (valueDst > src) {
                memories[typeDst.split(':')[1]] = (valueDst - src).toString(16).slice(-4)
            } else {
                memories[typeDst.split(':')[1]] = (parseInt('1' + memories[typeDst.split(':')[1]], 16) - src).toString(16).slice(-4)
                cf = 1
            }
        } else if (typeSrc === 'reg8') {
            src = reg88[src[0] + 'x'][src[1]]
            src = parseInt(src, 16)
            let valueDst = parseInt(memories[typeDst.split(':')[1]], 16)
            if (valueDst > src) {
                memories[typeDst.split(':')[1]] = (valueDst - src).toString(16).slice(-4)
            } else {
                memories[typeDst.split(':')[1]] = (parseInt('1' + memories[typeDst.split(':')[1]], 16) - src).toString(16).slice(-4)
                cf = 1
            }
        } else if (typeSrc === 'immediate-h' || typeSrc === 'immediate-l') {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16)
            let valueDst = parseInt(memories[typeDst.split(':')[1]], 16)
            if (valueDst > src) {
                memories[typeDst.split(':')[1]] = (valueDst - src).toString(16).slice(-4)
            } else {
                memories[typeDst.split(':')[1]] = (parseInt('1' + memories[typeDst.split(':')[1]], 16) - src).toString(16).slice(-4)
                cf = 1
            }
        } else if (typeSrc === 'bin8' || typeSrc === 'bin16') {
            src = parseInt(src, 2)
            let valueDst = parseInt(memories[typeDst.split(':')[1]], 16)
            if (valueDst > src) {
                memories[typeDst.split(':')[1]] = (valueDst - src).toString(16).slice(-4)
            } else {
                memories[typeDst.split(':')[1]] = (parseInt('1' + memories[typeDst.split(':')[1]], 16) - src).toString(16).slice(-4)
                cf = 1
            }
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    }
    console.log(cmdLine.split(/\s+/g))
}

// 初始化
function reset() {
    // 通用寄存器
    ax = {h: '00', l: '00'}
    bx = {h: '00', l: '00'}
    cx = {h: '00', l: '00'}
    dx = {h: '00', l: '00'}
    si = '0000'
    di = '0000'
    bp = '0000'
    sp = '0000'
    // 段寄存器
    cs = '0000'
    ds = '0000'
    es = '0000'
    ss = '0000'
    reg88 = {ax: ax, bx: bx, cx: cx, dx: dx}
    reg16 = {di: di, si: si, bp: bp, sp: sp}
    // 合法8位寄存器
    reg8 = {ah: ax.h, al: ax.l, bl: bx.l, bh: bx.h, ch: cx.h, cl: cx.l, dh: dx.h, dl: dx.l}
    // 合法段寄存器
    sreg = {cs: cs, ds: ds, es: es, ss: ss}
    // 内存堆
    memories = {}

// 堆栈数组
    stack = []
}

// 编译入口
export function compile(rawCode) {
    reset()
    console.log('编译执行中，请稍候...')
    // 获取指令序列
    let codeLines = rawCode.trim().split(/\n+/)
    // 判断每行指令
    for (let i = 0; i < codeLines.length; i++) {
        // 取具体指令
        let ins = codeLines[i].trim().split(/\s+/)[0]
        console.log(`第${i + 1}行指令为:【${codeLines[i]}】指令头为:【${ins}】`)
        if (ins.toLowerCase() in instructions) {
            // 指令存在则执行相应操作
            let res = instructions[ins.toLowerCase()](codeLines[i], i + 1)
            if (res === 'error') {
                break
            }
        } else if (ins.startsWith(';')) {
            // 纯注释行则无动作
            console.log(`第${i + 1}行为纯注释行!`)
        }
        else {
            // 指令不存在则报错
            console.log(`第${i + 1}行指令错误！`)
            break
        }
    }
    console.log('执行完毕！')
}

// 寄存器显示
export function display() {
    return {
        AX: String(reg88.ax.h) + String(reg88.ax.l),
        BX: String(reg88.bx.h) + String(reg88.bx.l),
        CX: String(reg88.cx.h) + String(reg88.cx.l),
        DX: String(reg88.dx.h) + String(reg88.dx.l),
        SP: reg16.sp,
        BP: reg16.bp,
        SI: reg16.si,
        DI: reg16.di,
        DS: sreg.ds,
        ES: sreg.es,
        SS: sreg.ss,
        CS: sreg.cs
    }
}
