class Vue {
    // 这里传进来的data就是new的时候传进来的$el和data参数
    constructor(options) {
        // 这里的this指向了新new的实例也就是html的script
        this.$el = document.querySelector(options.el)
        this.$data = options.data
        this.compile(this.$el)
    }
    compile(node) {
        node.childNodes.forEach((item, index) => {
            //dom1，属性2，文本3
            // 先找到文本节点里的变量使用进行替换
            if (item.nodeType === 3) {
                //.*?匹配所有符合条件的，如：a.*?b   axxxb   acb   a b
                let reg = /\{\{(.*?)\}\}/g
                let text = item.textContent;
                item.textContent = text.replace(reg, (match, vmKey) => {
                    //trim掉变量两侧的空格
                    vmKey = vmKey.trim();
                    //返回新new对象传进来的值
                    return this.$data[vmKey]
                })
            }
            //找到dom元素中的变量使用进行替换
            if (item.nodeType === 1) {
                // 实现递归调用，因为dom元素中也是nodeType为3的类型
                this.compile(item)
            }
        })
    }
}