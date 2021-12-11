## element-ui

##### 引入element-ui

###### npm安装 

```
npm install element-ui -save
```

###### 完整引入

```js
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(elementUI);
```

###### 按需引入





#### 表单验证

##### 直接使用element-ui提供的验证字段

使用时注意要让规则对象 rules里的规则名与表单中对应的值的名称一致.

- required: true  表该字段不能为空
- min:6, max: 20  表要求字符串长度在6~20之间
- type: 'number'  可是使用type来指定数值类型,注意对应\<el-input\>里的`v-model`写成 `v-model.num`,不过推荐用正则表达式解决这个类型的问题,更加强大.
- pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/  .`pattern`后跟的是正则表达式
- validator: 自定义的校验规则 [[vue-cli#在vue-cli中自定义校验规则]]

```vue
<template>
    <div> 
        <el-form ref="rulesform" :model="form" action="" :rules="rules" label-width="80px">
            <!-- 注意 prop的值要与 data()里的值一致 （即规则名要与表单数据的属性名一致） -->
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- 校验数字类型，必须将v-model改为 v-model.number-->
            <el-form-item label="数量" prop="num">
                <el-input v-model.number="form.num" type="text"></el-input>
            </el-form-item>
            <!-- 日期类型 -->
            <el-form-item prop="date" label="日期">
                <el-date-picker type='datetime'  v-model="form.date"></el-date-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'VuecliComponentVerify',
    data() {
        return {
            form:{
                name: "",
                num: "",
                date: "",
                radio:"",
                checkbox: [],
            },
            //
            rules:{
                name: [
                    {required: true, message:'not null', trigger: 'blur'},
                    {min: 3, max: 5, message: ' 3 ~ 5 ', trigger: 'blur'},
                ],
                num: [
                    {required: true, message: 'not null', trigger: 'blur'},
                    {type: 'number', message:'need num', trigger: 'blur'}
                ],
                date: [
                    {required: true, message: 'not null', trigger: ['blur', 'change']},
                    {type: 'date', message: 'need date type', trigger: ['blur', 'change']}
                ],
            }
        };
    },
};
</script>
```
