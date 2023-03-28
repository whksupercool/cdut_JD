// 负责管理所有的自定义指令
// 只负责导出指令对象
// 变量名称就是指令名称
export const imgerror = {
    // 指令对象 会在当前的dom元素插入到节点之后执行
    inserted(dom, options) {
        // options是 指令中的变量的解释  其中有一个属性叫做 value
        // dom 表示当前指令作用的dom对象
        dom.onerror = function () {
            // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
            dom.src = options.value
        }
    }
}