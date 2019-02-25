// 通用寄存器
let ax = {h: 0, l: 0}, bx = {h: 0, l: 0}, cx = {h: 0, l: 0}, dx = {h: 0, l: 0}
let si = 0, di = 0, bp = 0, sp = 0

// 段寄存器
let cs = 0, ds = 0, es = 0, ss = 0

// 合法16位寄存器
let reg88 = {ax: ax, bx: bx, cx: cx, dx: dx}
let reg16 = {di: di, si: si, bp: bp, sp: sp}

// 合法8位寄存器
let reg8 = {ah: ax.h, al: ax.l, bl: bx.l, bh: bx.h, ch: cx.h, cl: cx.l, dh: dx.h, dl: dx.l}

// 合法段寄存器
let sreg = {cs: cs, ds: ds, es: es, ss: ss}

// 非法符号
const invalid = '`~！!@#￥$%^……&*()_——=【】{}、|：「」"\'『』《》<>？、/,'

// 指令字典
let instructions = {
    mov: funcMov,
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
                return 'memory'
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
                return 'memory'
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
    cmdLine = cmdLine.trim().split(';')[0].replace(',', ' ')
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
    // 执行相应mov操作
    // dst => reg16 reg88 reg8 sreg memory
    // src => reg16 reg88 reg8 sreg memory immediate-l immediate-h bin8 bin16
    if (typeDst === 'reg16') {
        if (typeSrc === ('immediate-h' || 'immediate-l')) {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16).toString(16)
            reg16[dst] = src
        } else if (typeSrc === ('bin8' || 'bin16')) {
            src = parseInt(src, 2).toString(16)
            reg16[dst] = src
        } else if (typeSrc === typeDst) {
            reg16[dst] = reg16[src]
        } else if (typeSrc === 'sreg')  {
            reg16[dst] = sreg[src]
        } else if (typeSrc === 'reg88') {
            reg16[dst] = reg88[src].h + reg88[src].l
        } else {
            console.log(`第${lineNum}行语法错误!`)
            return 'error'
        }
    } else if (typeDst === 'reg88') {
        if (typeSrc === typeDst) {
            reg88[dst].h = reg88[src].h
            reg88[dst].l = reg88[src].l
        } else if (typeSrc === ('immediate-h' || 'immediate-l')) {
            src = src.split(/[hH]/)[0]
            src = parseInt(src, 16).toString(16)

        }

    }
    console.log(cmdLine.split(/\s+/g))
}

// 寄存器初始化
function reset() {
    // 通用寄存器
    ax = {h: 0, l: 0}
    bx = {h: 0, l: 0}
    cx = {h: 0, l: 0}
    dx = {h: 0, l: 0}
    si = 0
    di = 0
    bp = 0
    sp = 0
    // 段寄存器
    cs = 0
    ds = 0
    es = 0
    ss = 0
    reg88 = {ax: ax, bx: bx, cx: cx, dx: dx}
    reg16 = {di: di, si: si, bp: bp, sp: sp}
    // 合法8位寄存器
    reg8 = {ah: ax.h, al: ax.l, bl: bx.l, bh: bx.h, ch: cx.h, cl: cx.l, dh: dx.h, dl: dx.l}
    // 合法段寄存器
    sreg = {cs: cs, ds: ds, es: es, ss: ss}
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
        let ins = codeLines[i].trim().split(' ')[0]
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
        AX: String(reg8.ah) + String(reg8.al),
        BX: String(reg8.bh) + String(reg8.bl),
        CX: String(reg8.ch) + String(reg8.cl),
        DX: String(reg8.dh) + String(reg8.dl),
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

// // 检验目标操作符类型, typeDst作为类型标志
// switch (typeDst) {
//     case 'reg16':
//         console.log('16位寄存器', dst)
//         break
//     case 'reg8':
//         console.log('8位寄存器', dst)
//         break
//     case 'sreg':
//         console.log('段寄存器', dst)
//         break
//     case 'memory':
//         console.log('内存块', dst)
//         break
//     default:
//         console.log(`第${lineNum}行含有非法操作符${dst}!`)
//         return 'error'
// }
// // 检验源操作符类型
// switch (typeSrc) {
//     case 'reg16':
//         console.log('16位寄存器', src)
//         break
//     case 'reg8':
//         console.log('8位寄存器', src)
//         break
//     case 'sreg':
//         console.log('段寄存器', src)
//         break
//     case 'immediate-l':
//         console.log('8位立即数', src)
//         break
//     case 'immediate-h':
//         console.log('16位立即数', src)
//         break
//     case 'memory':
//         console.log('内存块', src)
//         break
//     case 'bin8':
//         console.log('8位2进制数', src)
//         break
//     case 'bin16':
//         console.log('16位2进制数', src)
//         break
//     default:
//         console.log(`第${lineNum}行含有非法操作符${src}!`)
//         return 'error'
// }