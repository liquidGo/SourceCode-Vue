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
// class Vue {
//     constructor(options) {
//         this.$options = options
//         if (typeof options.beforeCreate == 'function') {
//             options.beforeCreate.bind(this)()
//         }
//         this.$data = options.data;
//         this.proxyData()

//         if (typeof options.created == 'function') {
//             options.created.bind(this)()
//         }
//         if (typeof options.beforeMount == 'function') {
//             options.beforeMount.bind(this)()
//         }
//         this.$el = document.querySelector(options.el);
//         this.replace1(this.$el)

//         if (typeof options.mounted == 'function') {
//             options.mounted.bind(this)()
//         }

//     }
//     replace1(node) {
//         node.childNodes.forEach((item, index) => {
//             if (item.nodeType === 3) {
//                 let reg = /\{\{(.*?)\}\}/g;
//                 let text = item.textContent;
//                 item.textContent = text.replace(reg, (a, b) => {
//                     b=b.trim()
//                     return this.$data[b]
//                 })
//             } else if (item.nodeType === 1) {
//                 if (item.hasAttribute('@click')) {
//                     let attr = item.getAttribute('@click');
//                     item.addEventListener('click', (e) => {
//                         let fn = this.$options.methods[attr].bind(this)
//                         fn(e)
//                     })
//                 }
//                 if (item.childNodes.length > 0) {
//                     this.replace1(item)
//                 }
//             }
//         })
//     }
//     proxyData() {
//         for (var key in this.$data) {
//             Object.defineProperty(this, key, {
//                 get() {
//                     return this.$data[key]
//                 },
//                 set(val) {
//                     this.$data[key] = val
//                 }
//             })
//         }
//     }
// }




// **5视图更新
class Vue {
    constructor(options) {
        this.$options = options
        //1、 watchEvent这个对象里键名就是使用变量，键值就是使用了几次就有几个watch
        this.$watchEvent = {}

        if (typeof options.beforeCreate == 'function') {
            options.beforeCreate.bind(this)()
        }
        this.$data = options.data;
        this.proxyData()
        // 执行更行
        this.viewUpdate()

        if (typeof options.created == 'function') {
            options.created.bind(this)()
        }
        if (typeof options.beforeMount == 'function') {
            options.beforeMount.bind(this)()
        }
        this.$el = document.querySelector(options.el);
        this.replace1(this.$el)

        if (typeof options.mounted == 'function') {
            options.mounted.bind(this)()
        }

    }
    replace1(node) {
        node.childNodes.forEach((item, index) => {
            if (item.nodeType === 3) {
                let reg = /\{\{(.*?)\}\}/g;
                let text = item.textContent;
                item.textContent = text.replace(reg, (a, b) => {
                    b = b.trim()
                    // 2、如果模板语法中没有这个数据就不去渲染
                    if (this.hasOwnProperty(b)) {
                        // 把参数传入视图更新的构造器函数
                        // b是data里的变量，item是当前要替换的视图层
                        // textContent是改变node文本节点的属性
                        let watch = new Watch(this, b, item, 'textContent')
                        if (this.$watchEvent[b]) {
                            this.$watchEvent[b].push(watch)
                        } else {

                            this.$watchEvent[b] = [];
                            this.$watchEvent[b].push(watch)
                        }
                    }
                    return this.$data[b]
                })
            } else if (item.nodeType === 1) {
                if (item.hasAttribute('@click')) {
                    let attr = item.getAttribute('@click');
                    item.addEventListener('click', (e) => {
                        let fn = this.$options.methods[attr].bind(this)
                        fn(e)
                    })
                }
                if (item.childNodes.length > 0) {
                    this.replace1(item)
                }
            }
        })
    }
    proxyData() {
        for (var key in this.$data) {
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
    //4、 监控this上面的data发生变化就进行数据的更新
    viewUpdate() {
        for (var key in this.$data) {
            let value = this.$data[key];
            let that = this;
            Object.defineProperty(this.$data, key, {
                get() {
                    return value
                },
                set(val) {
                    value = val
                    if (that.$watchEvent[key]) {
                        // 如果watchEvent使用了某个变量几次，就存在几个watch实例化，就遍历对他调用
                        that.$watchEvent[key].forEach((item, index) => {
                            item.update()
                        })
                    }
                }
            })
        }
    }
}


//3、 写一个新的构造器监听视图层的变化
class Watch {
    constructor(vm, variable, view, attr) {
        this.vm = vm
        this.key = variable
        this.view = view
        this.attr = attr
    }
    update() {
        console.log(123);
        // 相当于item.textContent=this[变量]
        this.view[this.attr] = this.vm[this.key]
    }
}