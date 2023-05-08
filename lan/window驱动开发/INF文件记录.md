[window驱动安装](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/)

### INF文件

安装信息(setup information)文件是windows系统支持的一种安装信息存放文件， 一般以INF作为拓展名。 INF文件和 windows内建的额安装服务引擎(API函数库)紧密协同工作。



##### INF文件的安装的实现机制



#### INF文件的语法

一个INF文件由多个不同类型的节(Section)组成, 每类节点有不同的目的和实现语法。 每个section包含属于它的条目(entries)。 有一些entries以一些预定的关键字开头， 这些entries被称为指令(directives)。 对于*section* *entries*和 *directives*他们都是大小写不敏感的。

- 一个INF文件中的section有的是必须的有的是可选， 一般是由需要安装的 device/driver的类型锁决定的。 某种程度上所使用的类安装器也有关系。
- section的定义顺序可以随意替换， windows系统根据section name 来决定执行顺序
- 如果一个INF文件中有多个相同的section name， 系统会自动将他们合并。
- windows2000版本section name的对最大长度是255个字符, windows98版本其section name的最大长度为28个字符。如果INF设计要在两个平台上运行，必须遵守最小的限制
- 使用 `\`做为换行隔断符
- 使用`;`做注释符号
- 允许使用串标记， 类似于变量定义和使用。 在[Strings]这个section中定义一个变量`ServiceName="testService"`, 可以在其他地方像这样使用`%ServiceName%`, *(包括section name， entries中)*

##### 主要包含如下的如下的Section

- [Version]            INF文件头，提供有效的INF文件的版本信息。 [Version]包含如下的 entries

  - Signature 是必须的entry用来指定INF文件可以工作的系统版本。 其值如下：

    - "\$CHICAGO\$" 表明这个INF文件可以用于windows95以后的所有平台上 *(win98 winme winnt4 win2k winxp win2k3)*
    - "\$WINDOWS 95\$"表明这个INF文件可以用于windows 95以后的win9x平台上， 目前来说就是 win98 winme
    - "\$WINDOWS NT\$"表明这个inf文件可以用于WindowsNT系列的平台上，包括winnt4，win2k，winxp，win2k3。WIN9x系列的操作系统的SetupAPI将会拒绝执行这种类型的inf文件。

    Signature只能是这三个值， 且\$符号也是必须的， 并且大小写不敏感

  - Provider 可选项。 用于指定 INF文件创建者的字符串。 或者驱动/设备的生产厂商等。

  - Class 可选项。 用于定义驱动的类别的名称

  - ClassGuid 可选项。驱动类别的GUID，其值的形式为{nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn}，一般是唯一的。、

  - DriverVer 可选项。用于指定驱动日期和版本号。如：DriverVer=07/01/2001,5.1.2600.5512。

- [DefaultInstall] 包含安装所关联的动作*（文件拷贝删除， 注册表键值的更新等等）*， 默认情况下会执行该section的内容

- [OtherInstall]    与 [DeaultInstall]遵循相同的语法， 必须被显示的调用， 常被用来执行反安装动作。

- [DestinationDirs]  指定罗列与一个节内容被拷贝、删除或重命名的文件在硬盘上的位置

- [Strings]   定义一些本地的字符串