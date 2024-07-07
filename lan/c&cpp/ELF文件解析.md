## ELF(Executable Linkable Format)

linux下的ELF文件又被分为如下的四类:

- **可重定位文件/目标文件 Relocatable File** 这类文件包含了代码和数据, 可以被用来链接成可执行文件或共享目标文件文件. *静态链接库也可以归为这一类, 静态库是把很多目标文件捆绑到一起, 再加上一些索引, 所以也可以归为这一类*
- **可执行文件 Executable File**  这类文件就是可执行文件, 一般没有拓展名.
- **共享目标文件 Shared Object File** 这类文件包含代码和数据. 可以再两种情况下使用:
  - 链接器使用这种文件和其他的可重定位文件链接,产生新的可重定位目标文件
  - 动态链接器将这种共享文件域可执行文件与可执行文件结合, 作为可执行映像的一部分运行.
- **核心转储文件Core Dump File** 当进程意外终止, 系统可以将进程的地址空间的内容和终止的其他信息转储到核心存储文件.



### .o目标文件结构分析

#### linux下未链接的目标文件结构

*注:windows下即使使用 gcc编译地得到 .o文件, 其结构不是 linux下的elf文件, 会略有偶差异*

可以使用 `objdump`或 `readelf` 工具查看目标文件的基本信息.  objdump和readelf工具的使用方法不赘述.

![image-20240115110324514](./ELF%E6%96%87%E4%BB%B6%E8%A7%A3%E6%9E%90.assets/image-20240115110324514.png) 

- 其中 .text是最基本的代码段, 一般代码执行语句被编译成机器语言, 保存在该段. 
- .data段是数据段, 已经初始化的全局变量和静态局部变量保存在其中.  
- .bss段中一般存放未初始化的全局变量和局部静态变量, 未初始化的变量其实也是可以存放在data段的, 但是未初始化就是0, 所以在data段分配空间存放0值毫无意义. 所以使用一个空段bss为这些变量预留位置, 在上图也可以看到 bss段的长度为0.
- .rodata/.rdata 只读数据段 存放了程序中的只读的数据, 如const修饰的变量和字符常量
- .dynamic  的动态链接信息段
- .comment 注释信息段
- .note.GNU-stack 堆栈提示段

*需要注意的是, 上述某段存放某类数据, 是由编译器实现, 尽管不同的编译器工作大致相同, 但器实现可能大相径庭. 比如有的编译器会将字符常量也放在 data段*

##### ELF文件中其他常见的段

| 常见段名    | 说明                                                     |
| ----------- | -------------------------------------------------------- |
| .rodata1    | Read Only Data, 这种段放的时只读数据， 和.rodata一样     |
| .comment    | 存放的编译器的版本信息， 比如字符串： "GCC:(GNU)4.2.0"   |
| .debug      | 调式信息                                                 |
| .dynamic    | 动态链接信息                                             |
| .hash       | 符号哈希表                                               |
| .line       | 调试时的行号表, 即源代码行号和编译后指令的对应的行号     |
| .note       | 额外的编译器信息, 如程序的公司名,发布版本吧等等信息      |
| .strtab     | String Table 字符串表, 用于存储ELF文件中用到的各种字符串 |
| .symtab     | Symbol Table 符号表                                      |
| .shstrtab   | Section Symbol Table 段名表                              |
| .plt  .got  | 动态链接的跳转表  和 全局入口表                          |
| .init .fini | 程序初始化 和 代码终结段表                               |



##### 自定义段

有时候可能希望定义的变量被放到指定的段中, gcc提供了一种拓展机制, 

```c
__attribute__((section("FOO"))) int myVar = 45;
```



### ELF文件结构描述

![ELF结构](D:\WorkBench\NOTEBOOK\lan\c&cpp\ELF文件解析.assets\ELF结构.png) 

ELF文件最前面都是 **ELF文件头(ELF Header)**, 它包含整个文件的基本属性. 

紧接着是ELF文件的各个段. 

随后是**段表(Section Header table)** , 这个结构描述了文件中所有的段的基本信息, 比如 段名, 段的长度, 段在文件中偏移量等等

ELF文件中的一些辅助结构, 字符串表 符号表等.



#### ELF结构代码描述

##### ELF文件头结构

ELF文件头结构 (ELF Header) 的定义可以在linux系统的 "/usr/include/elf.h" 文件中可以看到. 下面是32位的 ELF Header结构定义

```c
/* The ELF file header.  This appears at the start of every ELF file.  */
#define EI_NIDENT (16)
typedef struct
{
  unsigned char e_ident[EI_NIDENT];     /* Magic number and other info */
  Elf32_Half    e_type;                 /* Object file type */
  Elf32_Half    e_machine;              /* Architecture */
  Elf32_Word    e_version;              /* Object file version */
  Elf32_Addr    e_entry;                /* Entry point virtual address */
  Elf32_Off     e_phoff;                /* Program header table file offset */
  Elf32_Off     e_shoff;                /* Section header table file offset */
  Elf32_Word    e_flags;                /* Processor-specific flags */
  Elf32_Half    e_ehsize;               /* ELF header size in bytes */
  Elf32_Half    e_phentsize;            /* Program header table entry size */
  Elf32_Half    e_phnum;                /* Program header table entry count */
  Elf32_Half    e_shentsize;            /* Section header table entry size */
  Elf32_Half    e_shnum;                /* Section header table entry count */
  Elf32_Half    e_shstrndx;             /* Section header string table index */
} Elf32_Ehdr;
```

上述的 Elf32_* 类型, 除了 Half是 16位, 其余都是32位 无符号整数类型.  下表记录 ELF文件头结构中 各个成员的含义.

| 成员名 | 含义 |
| ------ | ---- |
|        |      |
|        |      |
|        |      |
|        |      |
|        |      |
|        |      |
|        |      |
|        |      |
|        |      |



##### ELF段表结构

