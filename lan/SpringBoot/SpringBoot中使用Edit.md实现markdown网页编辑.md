# SpringBoot使用Edit.md实现markdown富文本编辑

###### 下载插件压缩包

[gitub下载地址](https://github.com/pandao/editor.md) 

### 在网页中引入markdown 编辑器 

1. ##### 将下载的压缩包解压后，复制到静态资源目录下

   <img src="https://s2.loli.net/2022/04/01/2BS8ZLRrfGHI1jW.png" alt="image-20210720223836340" style="zoom:67%;" />  

2. ##### 再需要使用 markdown编辑器的网页中引入 如下资源

   ```html
   <script src="../md-master/examples/js/jquery.min.js"
           th:src="@{../md-master/examples/js/jquery.min.js}"></script>
   <script src="../md-master/editormd.js"
           th:src="@{../md-master/editormd.js}"></script>
   <link rel="stylesheet" href="../md-master/css/style.css"
         th:href="@{../md-master/css/style.css}"/>
   <link rel="stylesheet" href="../md-master/css/editormd.css"
           th:href="@{../md-master/css/editormd.css}"/>
   <link rel="shortcut icon" href="https://pandao.github.io/editor.md/favicon.ico" type="image/x-icon" />
   ```

   实际上 th:href或src的内容是动态渲染的，会覆盖普通的属性值。关于静态资源的引用路径查看[[thymeleaf#实际使用中遇到的问题]]

3. ##### 加如标签，js初始化

   js代码要把带有 `id="test-editormd"` 的标签初始化，注意`path`属性的路径不同的页面引入lib文件夹的路径会不一样注意修改。

   ```html
   <div class="layui-input-block">
       <div id="test-editormd">
           <textarea name="markdown_text"></textarea>
       </div>
   </div>
   <script type="text/javascript">
       var testEditor;
       $(function() {
           testEditor = editormd("test-editormd", {
               width     : "90%",
               height    :  660,
               toc       : true,
               //atLink    : false,    // disable @link
               //emailLink : false,    // disable email address auto link
               todoList  : true,
               path      : '../md-master/lib/'
           });
       });
   </script>
   ```

### 网页预览markdown格式的文章



