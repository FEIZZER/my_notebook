## Vuex

##### vuex是什么

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。简言之，vuex是vue的一个插件，用于存储一部分组件访问的数据，实现组件之间的数据传递。

###### vue数据传递有哪些

props ，\$parent,  \$root,   自定义事件 $emit(),  EventBus 

##### 为什么要有vuex

vuex的应用场景是，多组件共享状态数据 。

传统的数据传递方法下，组件之间共享数据往往是父传子。这就会导致多个组件之间嵌套非常严重，单向流动的数据难以维护。

vuex则是将 共享的数据抽离出来，形成一个全局单例的管理模式，便于数据的维护。

 

### Vuex核心学习

 <img src="vuex.assets/vuex.png" alt="vuex" style="zoom: 80%; float:left" />







工作流程：组件触发事件actions。 事件actions通过commit调用 Mutations改变vuex保存的状态的值，状态被改变 重新渲染组件。









 



##### vue-cli引入 vuex

###### 安装 vuex

```js
npm install vuex --save
```

###### 新建一个 store.js用于设置保存

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        thing: '奥里给',
    }
})
export default store
```

###### 在main.js里引入这个 store,js

```js
import Vuex from 'vuex'
import store from './store/store'
new Vue({
  el: '#app',
  store,
  components: { App},
  template: '<App/>'
})
```

#### store

store本质上就是一个容器，用于存储组件所需要的状态 state。注意我们不应该直接改变 store中state的值，而是显示的提交(commit) Mutation。这样可以使我们方便的追踪每一个状态的变化。

```js
Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
         info:{
             name: 'feizzer',
         }
    },
})
```

在其他组件里就可以直接访问 store里的状态state

```html
<div>
    {{this.$store.state.info.name}}
</div>
<!--就可以拿到 feizzer 这个值-->
```

##### State 状态

state就是保存各种状态的位置，在组件中使用形式：这两种形式下，状态state的变化都会立即重新渲染组件。

```html
<template>
    <div>
        <div>{{this.$store.state.cnt}}</div>
        <div>{{cnt}}</div>
        <button @click="change">button</button>
    </div>
</template>
<script>
export default {
    name: 'Vuextest',
    computed:{
        cnt(){
            return this.$store.state.cnt
        }
    }, 
    methods: {
        change: function(){
            this.$store.state.cnt ++ 
        }
    },
};
</script>
```

###### `mapState` 辅助函数 

##### Getter

Getter其实可以看作是直接在，vuex store配置中编写组件中的 computed。任何组件都可以通过这个Getter中的函数来获得 state。

```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

##### Mutation

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 **事件类型 (type)** 和 一个 **回调函数 (handler)**。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

在刚刚的代码中我们在点击事件中直接修改了 state的值，正确的做法是，修改state的操作在mutation中定义：

```html
<template>
    <div>
        <div>{{this.$store.state.cnt}}</div>
        <div>{{cnt}}</div>
        <button @click="change(10)">button</button>
    </div>
</template>
<script>
export default {
    name: 'Vuextest',

    computed:{
        cnt(){
            return this.$store.state.cnt
        }
    }, 
    methods: {
        change: function(num){
            this.$store.commit('increase', num)
        }
    },
};
</script>
```

```js
const store = new Vuex.Store({
    state:{
        cnt: 0,
        thing: '奥里给',
        info:{
            name: 'feizzer', 
        }
    }, 
    mutations:{
        increase(state, num) {
            if ( num == undefined) {
                num =1
            }
            state.cnt += num
        }
    }
})

```

###### `MapMutation` 辅助函数 

##### Action 

- action与 mutation相似，但是action提交的是mutation，而不是直接改变状态 state 
- action 可以包含任意的异步操作。

总的来说，action进一步封装Mutation的目的，是为了处理网络请求而产生的异步要求问题。所以如果事件中并没有异步操作，action的封装是完全不必要的。

```js
Vue.use(Vuex)
Vue.use(axios)
const store = new Vuex.Store({
    state:{
        dataFromNet:{
        },
    }, 
    mutations:{
        getDataFromNet(state, data) {
            state.data = data
            console.log(data)
        }
    },
    actions:{
        getDataFromNet(context){
            //向    baseURL + ‘/users' 路径请求数据
            axios.get('users',{})
            .then(res => {
                context.commit('getDataFromNet', res);
            })
            .catch(error => {
                console.error(error)
            })
        }
    }
})

export default store
```

上面的storejs里 用action封装一个同名的mutation，用异步的方法请求得到网络数据，再将数据作为参数调用 mutation里的方法。

