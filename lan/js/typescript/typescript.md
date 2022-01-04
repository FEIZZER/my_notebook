#### typescript的类型

在ts中使用变量时可以进行变量类型的定义，大致语法如下：

```ts
//限制num这个变量的类型为number，只能给他赋值数字值
let num: number = 123
//如果尝试给num赋值其他类型的值，则会编译报错。 let num = '123'
```

##### 基本类型

ts的基本类型与js一致，包括number，boolean， string， null，undefined。*其中null和undefined在ts中即是类型也是值*。其中关于number boolean string类型，会有关于他们的包装类，Number......。一般使用基本变量就行。

##### 其他类型

###### 定义数组类型

```ts
let arr1: number[] = []
let arr2: Array<number> = []	
```

###### 元组类型

元组类型赋值时，必须要和定义元组时的类型顺序和数量一致，不能超出。在古早期版本（2.6）以前，只要超出的数据的类型在元组定义中出现过即可。

```ts
let tuple:[string, number, boolean]
tuple = ['str', 12, false]
```

###### 枚举类型 

```ts
enum Roles {
    admin,
    superadmin = 2,
}
console.log(Roles.admin) //0
//打印出来的是下标，默认是从0开始
```

###### 联合类型

由于ts是为了弥补js不做类型限制带来的问题，所以ts也要考虑js中出现情况。js中一个变量往往会被赋值不同的类型，会随着程序的运行，变量代表不同类型的值。

```ts
let stringORnumberV: string | number
stringORnumberV = '111'
stringORnumberV = 111
//定义一个联合类型的数组，注意不要审略括号， number | string[] 代表的是这个变量可以是一个number类型或者string数组类型
let stringORnumberArr: (number | string)[]
stringORnumberArr = [11, '11']	
```

###### any类型

作为一种联合类型的加强版来看，any类型的变量不会对被赋予的值做任何限制==*如果在定义变量时审略类型信息，似乎与any类型有一样的效果。*==

```ts
let V
V = false
console.log(typeof V) //boolean
V = '123'
console.log(typeof V) //string
```

###### void类型

void类型表示没有任何返回值，常用于没有任何返回值的函数：

```ts
function noReturnV(): void {
    console.log('on return')
}
let v = noReturnV()
console.log(v) //>>undefined
```

可以赋予undefined值。如果向将null值赋给void类型，可以关闭编译选项中类型检查中的 strictNullChecks 选项

```json
/* Type Checking */
//"strict": true,  /* Enable all strict type-checking options. */
// "noImplicitAny": true,  /* Enable error reporting for expressions and declarations with an implied `any` type.. */
"strictNullChecks": false,     
```

另外，undefined和null类型是其他类型的子类型，可以赋值给其他类型。==而void类型与其他类型的hi平等关系，不能直接赋值==。

###### never类型

never类型常用于抛错函数或死循环函数的返回值，never以为永远不会被赋予的值，所以常常用在会打断程序的函数的返回值上。



*立即执行函数的返回值是never，*

由于never类型是所有其他类型的子类型，所以理论上never类型可以赋值给任意其他类型。其他类型都不能赋值给never类型。

###### object类型



##### 类型断言

由于在ts中既引入了类型检查，又为了适配js有联合类型和any类型。在编码过程中可能会出现二者冲突的情况:

如下的函数 传入一个参数可以是number或string类型，但是我想在下面取tar.length属性，不同于js。由于ts的类型检查，在编译时就会抛出错误 ： *类型“string | number”上不存在属性“length”。类型“number”上不存在属性“length”* 。

```ts
function getLength(tar: string | number): number {
    if (tar.length || tar.length === 0){
        return tar.length
    }
    else{
        return tar.toString().length
    }
}
```

这个时候就需要我们使用类型断言， 断言有两种语法格式 

(tar as string)  或  (\<string\>tar) 。在react中.tsx中只能使用 as格式的语法。

```ts
function getLength(tar: string | number): number {
    if ((tar as string).length || (tar as string).length === 0){
        return (tar as string).length
    }
    else{
        return tar.toString().length
    }
}
```

