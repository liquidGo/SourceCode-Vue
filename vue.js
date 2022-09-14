// **1模板变量的源码
// class Vue {
//     // 这里传进来的data就是new的时候传进来的$el和data参数
//     constructor(options) {
//         // 这里的this指向了新new的实例也就是html的script
//         this.$el = document.querySelector(options.el)
//         this.$data = options.data
//         this.compile(this.$el)
//     }
//     compile(node) {
//         node.childNodes.forEach((item, index) => {
//             //dom1，属性2，文本3
//             // 先找到文本节点里的变量使用进行替换
//             if (item.nodeType === 3) {
//                 //.*?匹配所有符合条件的，如：a.*?b   axxxb   acb   a b
//                 let reg = /\{\{(.*?)\}\}/g
//                 let text = item.textContent;
//                 item.textContent = text.replace(reg, (match, vmKey) => {
//                     //trim掉变量两侧的空格
//                     vmKey = vmKey.trim();
//                     //返回新new对象传进来的值
//                     return this.$data[vmKey]
//                 })
//             }
//             //找到dom元素中的变量使用进行替换
//             if (item.nodeType === 1) {
//                 // 实现递归调用，因为dom元素中也是nodeType为3的类型
//                 this.compile(item)
//             }
//         })
//     }
// }




// // **2生命周期的实现
// class Vue {
//     constructor(options) {
//         // 调用传过来的函数
//         if (typeof options.beforeCreate === 'function') {
//             // bind(this)是在调用函数的时候将函数指向为新new的对象，否则this指向自身
//             options.beforeCreate.bind(this)()
//         }
//         // 在页面创建中拥有了data，在create可以获取到
//         this.$data = options.data;

//         if (typeof options.created === 'function') {
//             options.created.bind(this)()
//         }
//         if (typeof options.beforeMount === 'function') {
//             options.beforeMount.bind(this)()
//         }
//         // 挂在中拥有了$el，在mounted里面可以获取到
//         this.$el = document.querySelector(options.el);
//         this.re(this.$el)
//         if (typeof options.mounted === 'function') {
//             options.mounted.bind(this)()
//         }

//     }
//     re(node) {
//         node.childNodes.forEach((item, index) => {
//             if (item.nodeType == 3) {
//                 let reg = /\{\{(.*?)\}\}/g
//                 let text = item.textContent;
//                 item.textContent = text.replace(reg, (a, b) => {
//                     return this.$data[b]
//                 })
//             } else if (item.nodeType === 1) {
//                 this.re(item)
//             }
//         })
//     }
// }



// // **3methods的实现源码
// class Vue {
//     constructor(options) {
//         this.$options = options
//         if (typeof options.beforeCreate === 'function') {
//             options.beforeCreate.bind(this)()
//         }
//         this.$data = options.data;

//         if (typeof options.created === 'function') {
//             options.created.bind(this)()
//         }
//         if (typeof options.beforeMount === 'function') {
//             options.beforeMount.bind(this)()
//         }
//         this.$el = document.querySelector(options.el);
//         this.re(this.$el)
//         if (typeof options.mounted === 'function') {
//             options.mounted.bind(this)()
//         }
//     }
//     re(node) {
//         node.childNodes.forEach((item, index) => {
//             if (item.nodeType === 3) {
//                 let reg = /\{\{(.*?)\}\}/g;
//                 let text = item.textContent;
//                 item.textContent = text.replace(reg, (a, b) => {
//                     return this.$data[b]
//                 })
//             } else if (item.nodeType === 1) {
//                 if (item.hasAttribute('@click')) {
//                     let att = item.getAttribute('@click').trim()
//                     item.addEventListener('click', (e) => {
//                         let a = this.$options.methods[att].bind(this);
//                         a(e)
//                     })
//                 }
//                 if (item.childNodes.length > 0) {
//                     this.re(item)
//                 }
//             }
//         })
//     }
// }



// **4data代码劫持
class Vue {
    constructor(options) {
        this.$options = options;
        if (typeof options.beforeCreate == 'function') {
            options.beforeCreate.bind(this)()
        }
        this.$data = options.data
        // 劫持函数
        this.proxyData()

        if (typeof options.created == 'function') {
            options.created.bind(this)()
        }
        if (typeof options.beforeMount == 'function') {
            options.beforeMount.bind(this)()
        }
        this.$el = document.querySelector(options.el);
        this.re(this.$el);
        if (typeof options.mounted == 'function') {
            options.mounted.bind(this)()
        }
    }
    re(node) {
        node.childNodes.forEach((item, index) => {
            if (item.nodeType === 3) {
                let reg = /\{\{(.*?)\}\}/g;
                let text = item.textContent;
                item.textContent = text.replace(reg, (a, b) => {
                    return this.$data[b]
                })
            } else if (item.nodeType === 1) {
                if (item.hasAttribute('@click')) {
                    let attr = item.getAttribute('@click').trim();
                    console.log(attr, 'attr');
                    item.addEventListener('click', (e) => {
                        let a = this.$options.methods[attr].bind(this)
                        a(e);
                    })
                }
                if (node.childNodes.length > 0) {
                    this.re(item)
                }
            }
        })
    }
    // 设置劫持每一个this.$data里面的数据并且劫持到this这个大对象上面
    // 这样一旦this上面的数据变了，this.$data里面的数据也进行改变
    proxyData() {
        for (let key in this.$data) {
            Object.defineProperty(this, key, {
                get() {
                    return this.$data[key]
                },
                set(val) {
                    this.$data[key] = val
                }
            })
        }
    }
}