

### PE文件结构

![PE文件结构](PE文件结构详解.assets/9c338ac59b604f6b988f8c717a098671.png)

#### PE文件的基本概念

- pe文件使用的是一个平面空间， 所有代码和数据并合并到一起，组成一个很大的结构
- 文件的内容被分割成不同的区块， 区块中包含代码或数据。 各个区块之间按照也边界来对齐， 区块内部没有大小限制， 是一个连续的结构。
- 每个区块在内存中有自己的属性， 比如是否包含代码，是否可读等等。
- PE文件不是作为单一的内存映射文件装入内存的。 windows加载器(PE装载器)遍历PE文件并决定映射文件的哪些部分到内存(调式信息一般不会映射)， 并且是按照顺序映射的。



#### PE文件的载入过程

![img](PE文件结构详解.assets/8ff111a9f4a994e3cfcc8b464afe00d9.png) 

windows在执行一个PE文件的时候， 并不是一开始就将整个文件读入内存。 windows装载器在装载的时候仅仅建立好虚拟地址和PE文件之间的映射关系， 当且仅当正真执行或访问到某一个页的数据的时候， 这个页面才会从磁盘装载到物理内存， 这种机制使得文件的读取速度和文件的大小没有直接的关系。

windows在装载PE文件的 **DOS部分**， **PE文件头** ，  **section表部分** 是不进行特殊处理的， 在装载**section**部分的时候可能会处理一下的部分：

- 内存页的属性

  对于磁盘映射的文件， 所有的页的访问属性都是由磁盘映射函数来决定的。 但是当一个文件作为可执行文件被映射到内存中时， 不同的区域由不同的属性。即从不同的section映射过来的内存页的属性是不一样的。

- 节的偏移地址

  现在大部分硬盘的扇区大小都是和内存一样的4k大小， 但是早期磁盘多是512字节的扇区大小， 从磁盘载入到内存的过程中会适当扩充一些填充符。(32位的系统一般时4kb=1000H, 64位的系统则是8kb)

- 节的尺寸

  1. 物理磁盘和内存的对齐单位不同造成拓展长度不一样。
  2. 有一些节中存在未初始化的数据， 在磁盘中没有花费空间去存储。 但是进入内存后，需要为其留下空间。

- 不进行映射的节

  有一些section不需要被加载进内存， 比如.reloc节， 它是提供给windows加载器去使用， 不需要载入内存。

#### Dos部分

##### dos头   

PE文件的第一个字节起始于一个传统的MS-DOS头部， 被称为`_IMAGE_DOS_HEADER` ， 占64字节。 

```c
typedef struct _IMAGE_DOS_HEADER {   // DOS .EXE header
  WORD  e_magic;           // Magic number
  WORD  e_cblp;           // Bytes on last page of file
  WORD  e_cp;            // Pages in file
  WORD  e_crlc;           // Relocations
  WORD  e_cparhdr;          // Size of header in paragraphs
  WORD  e_minalloc;         // Minimum extra paragraphs needed
  WORD  e_maxalloc;         // Maximum extra paragraphs needed
  WORD  e_ss;            // Initial (relative) SS value
  WORD  e_sp;            // Initial SP value
  WORD  e_csum;           // Checksum
  WORD  e_ip;            // Initial IP value
  WORD  e_cs;            // Initial (relative) CS value
  WORD  e_lfarlc;          // File address of relocation table
  WORD  e_ovno;           // Overlay number
  WORD  e_res[4];          // Reserved words
  WORD  e_oemid;           // OEM identifier (for e_oeminfo)
  WORD  e_oeminfo;          // OEM information; e_oemid specific
  WORD  e_res2[10];         // Reserved words
  LONG  e_lfanew;          // File address of new exe header 
 } IMAGE_DOS_HEADER, *PIMAGE_DOS_HEADER;
```

DOS头用于16位的系统中， 在32位系统中多数字段为冗余字段， 少数几个重要的字段：

- **0x00	e_magic**  PE文件的改字段保存 "MZ" 字段，通过这个字段判断是否是PE文件
- **0x3c    e_lfanew**   记录PE文件头(PE Header)结构的偏移量。



##### dos stub

该区域的数据由链接器填充， 一般一段可以在DOS下执行的代码用来向终端输出一行字 :"This program cannot be run in DOS", 随后退出程序。 





#### PE 头部分

PE头文件可以用一个结构体来表示 `_IMAGE_NT_HEADERS32` ==该部分区分x64和x86系统，下面以32位系统为例==

```c
typedef struct _IMAGE_NT_HEADERS {
  DWORD Signature;             // PE文件标识 4Bytes
  IMAGE_FILE_HEADER FileHeader;      // 40 Bytes
  IMAGE_OPTIONAL_HEADER32 OptionalHeader; // 224 Bytes  PE32可执行文件，不讨论PE32+的情况
} IMAGE_NT_HEADERS32, *PIMAGE_NT_HEADERS32;
```

在32位的系统上， 这个结构体共占用 4B+20B+224B 的空间。

- **Signature**   表示PE文件头的开始， 固定存储 "PE00" (0x504500).

- **FileHeader**   `IMAGE_FILE_HEADER` 结构体，表示映像文件头，包含PE文件的基本信息，在微软的文档中被描述为Common Object File Format(COFF)标准文件格式。

  ```c
  typedef struct _IMAGE_FILE_HEADER {
    WORD  Machine;        // 可运行在什么样的CPU上。0代表任意，Intel 386及后续：0x014C， x64: 0x8664
    WORD  NumberOfSections;   // 文件的区块（节）数
    DWORD  TimeDateStamp;     // 文件的创建时间。1970年1月1日以GMT计算的秒数,编译器填充的，不重要的值
    DWORD  PointerToSymbolTable; // 指向符号表（用于调试）
    DWORD  NumberOfSymbols;    // 符号表中符号的个数（用于调试）
    WORD  SizeOfOptionalHeader; // IMAGE_OPTIONAL_HEADER32结构的大小，可改变，32位为E0,64位为F0， 可能更大
    WORD  Characteristics;    // 文件属性
  } IMAGE_FILE_HEADER, *PIMAGE_FILE_HEADER;
  ```

  - Characteristics字段可能是下面的一个或多个值

    

- **OptionalHeader**  `IMAGE_OPTIONAL_HEADER32`称为**可选映像头**或**拓展PE头**

  ```c
  typedef struct _IMAGE_OPTIONAL_HEADER {
    //
    // Standard fields.
    //
     
    WORD  Magic;         //说明文件的类型 PE32：10BH PE32+：20BH  Rom映像文件：107H
    BYTE  MajorLinkerVersion;   //链接器主版本号
    BYTE  MinorLinkerVersion;   //链接器次版本号
    DWORD  SizeOfCode;       //所有代码节的总和（基于文件对齐） 编译器填的 没用
    DWORD  SizeOfInitializedData; //包含所有已经初始化数据的节的总大小 编译器填的 没用
    DWORD  SizeOfUninitializedData;//包含未初始化数据的节的总大小 编译器填的 没用
    
    DWORD  AddressOfEntryPoint;  //程序入口RVA  在大多数可执行文件中，这个地址不直接指向Main、WinMain或DIMain函数，而指向运行时的库代码并由它来调用上述函数
    DWORD  BaseOfCode;       //代码起始RVA，编译器填的  没用
    DWORD  BaseOfData;       //数据段起始RVA，编译器填的  没用
    
    //
    // NT additional fields.
    //
    
    DWORD  ImageBase;       //内存镜像基址 ，可链接时自己设置
    DWORD  SectionAlignment;    //内存对齐   一般一页大小4k
    DWORD  FileAlignment;     //文件对齐   一般一扇区大小512字节，现在也多4k
    WORD  MajorOperatingSystemVersion; //标识操作系统版本号 主版本号
    WORD  MinorOperatingSystemVersion; //标识操作系统版本号 次版本号
    WORD  MajorImageVersion;   //PE文件自身的主版本号 
    WORD  MinorImageVersion;   //PE文件自身的次版本号 
    WORD  MajorSubsystemVersion; //运行所需子系统主版本号
    WORD  MinorSubsystemVersion; //运行所需子系统次版本号
    DWORD  Win32VersionValue;   //子系统版本的值，必须为0
    DWORD  SizeOfImage; //内存中整个PE文件的映射的尺寸，可比实际的值大，必须是SectionAlignment的整数倍  
    DWORD  SizeOfHeaders;     //所有头+节表按照文件对齐后的大小，否则加载会出错
    DWORD  CheckSum;        //校验和，一些系统文件有要求.用来判断文件是否被修改 
    WORD  Subsystem;       //子系统  驱动程序(1) 图形界面(2) 控制台、DLL(3)
    WORD  DllCharacteristics;   //文件特性 不是针对DLL文件的
    DWORD  SizeOfStackReserve;   //初始化时保留的栈大小 
    DWORD  SizeOfStackCommit;   //初始化时实际提交的大小 
    DWORD  SizeOfHeapReserve;   //初始化时保留的堆大小
    DWORD  SizeOfHeapCommit;    //初始化时保留的堆大小
    DWORD  LoaderFlags; 
    DWORD  NumberOfRvaAndSizes;  //数据目录项数目
    IMAGE_DATA_DIRECTORY DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES]; //数据目录表
  } IMAGE_OPTIONAL_HEADER32, *PIMAGE_OPTIONAL_HEADER32;
  ```

  - **AddressOfEntryPoint**  
  
    是一个RVA， 表示文件被执行时的入口地址。 这个位置的代码将会被首先执行。
  
  - **SectionAlignment 和 FileAlignment** 分别代表内存中的对齐值1000h， 和磁盘中的对齐值200h。
  
  - **subsystem**  表示改可执行文件需要什么子系统
  
  - **DataDirectory[IMAGE_NUMBEROF_DIRECTORY_ENTRIES]** 一个共有十六个元素的数组。
  
    | 索引 | 预定义值                       | 作用                                                     |
    | ---- | ------------------------------ | -------------------------------------------------------- |
    | 0    | IMAGE_DIRECTORY_ENTRY_EXPORT   | 导出表信息， 多见于DLL可执行文件， 导出了函数API的意思。 |
    | 1    | IMAGE_DIRECTORY_ENTRY_IMPORT   | 导入表信息，多见于exe可执行文件， 需要导入哪些信息。     |
    | 2    | IMAGE_DIRECTORY_ENTRY_RESOURCE | 资源信息， 图标之类的。                                  |
  
     

#### section表部分

节表部分用来存储section节的属性信息， 节由`IMAGE_SECTION_HEADER`结构排列而成， 每一个结构描述一个节， 且是顺序一致的。

 最后一个全空的`IMAGE_SECTION_HEADER`表示节表的结束。

 节表总是紧挨着PE头的后方。

 

#### 输入表结构

PE头文件中的 `IMAGE_OPTIONAL_HEADER32`结构体中 DataDirectory数组的第二个成员就是用于指向输入表的。 输入表是以一个 `IMAGE_IMPORT_DESCRIPTOR`（简称IID）结构体开始的数组



```c
typedef struct _IMAGE_IMPORT_DESCRIPTOR {
    __C89_NAMELESS union {
        DWORD Characteristics;
        DWORD OriginalFirstThunk;
    } DUMMYUNIONNAME;
    
    DWORD TimeDateStamp;
    DWORD ForwarderChain;
    DWORD Name;
    DWORD FirstThunk;
} IMAGE_IMPORT_DESCRIPTOR;
typedef IMAGE_IMPORT_DESCRIPTOR UNALIGNED *PIMAGE_IMPORT_DESCRIPTOR;
```

