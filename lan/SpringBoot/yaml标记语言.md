## yaml

#### 基本语法

1、大小写敏感
2、使用缩进表示层级关系
3、禁止使用tab缩进，只能使用空格键（idea中任然可以使用）
4、缩进长度没有限制，只要元素对齐就表示这些元素属于一个层级
5、使用#表示注释
6、字符串可以不用引号标注

```yaml
yamltest:
  #String类型可以不用加引号
 stringele: String类型
 
 boolenele: true
 #这时Date日期类型的表现形式
 dateele: 2020/10/10
 #如果属性是类把它看成是js里的对象来赋值
 classele: {name: xiaojie}
 # 数组
 arrayele: [xiaojie1, xiaojie2]
 #list类型 也可以用[]
 listele:
  - xiaojie1
  - xiaojie2
  - xiaojie3
  - xiaojie4
 #Set类型和List一样
 setele: 22
 #Map符合类型
 mapele:
  -maptype1: {type: pen}
  -maptype2:
   -type: pencil
```