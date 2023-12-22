# MSBuild

 Microsoft Build Engine**(MSBuild)** 是一个用于生成应用程序的平台. 该平台使用 **XML**格式的文件作为项目管理文件. Visual studio会使用MSBuild, 但是MSBuild并不依赖Visual Studio.  

Visual Studio项目的项目文件(.csproj、.vbproj、vcxproj 等)都会包含MSBuild的XML代码.  一般建议使用Visual Studio项目的属性界面去配置该文件, 当然直接编辑该文件也是可行的.

MSBuild并不单单只是一个构建工具, 应该称之为拥有强大拓展能力的自动化平台. MSBuild主要包含三部分内容:

- **执行引擎**  执行引擎是其平台的核心. 它负责构造工程的定义规范, 并解释构造工程;
- **构造工程**  构造工程则是用于描述**任务**的, 大多数情况下我们的任务就是遵循MSBuild的规范, 编写一个构造工程
- **任务**  就是引擎执行的动作, 任务也是MSBuild的拓展机制, 通过不断编写信息的任务就可以不断扩充MSBuild的执行能力.



##### MSBuild和nmake

MSBuild和make nmake其实都一样, 都是项目构建的工具. *vs 2005开始采用msbuild系统*  

nmake的格式是比较直白的采用和make一样的makefile模式

msbuild则是使用xml格式的文件, 显然msbuild的项目文件更难用手工编辑.

### MSBuild使用

暂不展开

[MSBuild入门 - Timetombs - 博客园 (cnblogs.com)](https://www.cnblogs.com/linianhui/archive/2012/08/30/2662648.html)

