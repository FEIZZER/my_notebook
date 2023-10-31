头文件 "dbghelp.h" 中有一些解析image file相关的函数可用

### 通过数据目录找到对应信息

##### 数据目录结构

```c
typedef struct _IMAGE_DATA_DIRECTORY {
    DWORD   VirtualAddress;
    DWORD   Size;
} IMAGE_DATA_DIRECTORY, *PIMAGE_DATA_DIRECTORY;
```

- VirtualAddress  对应表的相对虚拟的地址 **RVA**
- 相对应表的大小

##### RVA和FOA

*一个可执行文件存在磁盘上面, 直接使用`readFile`文件内容得到 FileBuffer, 是无法在直接在内存中运行的. 经过pe loader装载器加载进入进程内存可以运行称为image buffer. 其中**RVA**就是image buffer时的相对地址, **FOA**就是File Buffer时的相对地址.*

很多时候我们拿到的buffer是 File Buffer, 需要将RVA转换成FOA, 实现如下:

```c
// 针对PE32格式的, 获取第一个 节标 的地址
#define IMAGE_FIRST_SECTION32(ntheader) ((PIMAGE_SECTION_HEADER) \
					    ((ULONG_PTR)ntheader +                    \
						FIELD_OFFSET(IMAGE_NT_HEADERS32,OptionalHeader) + \
						((PIMAGE_NT_HEADERS32)(ntheader))->FileHeader.SizeOfOptionalHeader))

// 找到 Rva 属于哪一个section
PIMAGE_SECTION_HEADER Rva2Section32(PIMAGE_NT_HEADERS32 pNtHeader, DWORD Rva) {

    if (NULL == pNtHeader) {
        return NULL;
    }
    PIMAGE_SECTION_HEADER pSectionHeader = IMAGE_FIRST_SECTION32(pNtHeader);

    for (INT i = 0; i < pNtHeader->FileHeader.NumberOfSections; i++) {
        if (Rva >= pSectionHeader->VirtualAddress &&
            Rva < pSectionHeader->VirtualAddress + pSectionHeader->Misc.VirtualSize) {
            return pSectionHeader;
        }
        pSectionHeader++;
    }

    return NULL;
}

// 把RVA转换成FOA
PVOID RVA2FOA32(PIMAGE_NT_HEADERS32 pNtHeader, DWORD Rva, PVOID base, PIMAGE_SECTION_HEADER* pSectionHeader) {

    if (NULL == pNtHeader || NULL == base) {
        return NULL;
    }
    if (NULL == *pSectionHeader) {
        *pSectionHeader = Rva2Section32(pNtHeader, Rva);
        if (NULL == *pSectionHeader) {
            return NULL;
        }
    }
    return (PVOID)((ULONG_PTR)base + Rva - (*pSectionHeader)->VirtualAddress + (*pSectionHeader)->PointerToRawData);
}

```

### 导出表(Export Table)解析

`pNtHeader->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_EXPORT].VirtualAddress` 所指向的结构体如下:

```c
typedef struct _IMAGE_EXPORT_DIRECTORY {
    DWORD   Characteristics;		// 不确定何用
    DWORD   TimeDateStamp;			// 时间戳
    WORD    MajorVersion;
    WORD    MinorVersion;
    DWORD   Name;					// 导出表名， 一般就是动态库名
    DWORD   Base;					// ordinal的基础值
    DWORD   NumberOfFunctions;		// 导出函数的个数
    DWORD   NumberOfNames;			// 有名字的导出函数的个数（通过名字导出的函数的个数）
    DWORD   AddressOfFunctions;     // RVA 导出函数地址表， 存储所有导出导出函数的地址, 元素宽度为4, 个数为NumberOfFunctions
    DWORD   AddressOfNames;         // RVA 导出函数名称表， 存储所有导出函数的名字， 元素宽度为4， 个数为NumberOfNames
    DWORD   AddressOfNameOrdinals;  // RVA 导出函数序号表， 帮助对应函数名和函数序号， 元素宽度为2， 个数为NumberOfNames
} IMAGE_EXPORT_DIRECTORY, *PIMAGE_EXPORT_DIRECTORY;
```

导出表中各个属性关系较复杂， 直接以一个例子来看， 使用如下 def 文件创建一个动态库

![image-20231031162110034](./PE%E6%96%87%E4%BB%B6%E7%BB%93%E6%9E%84-%E6%95%B0%E6%8D%AE%E7%9B%AE%E5%BD%95%E8%AF%A6%E8%A7%A3.assets/image-20231031162110034.png)

- 我在def文件中 手动指定了函数的导出序号（乱序 且 从2开始）。 所以**Base**的值就是2， 表示最小的导出函数序号。

- 最大的导出函数序号是7,  所以**NumberOfFunctions** = 7-2=5， 表示**AddressOfFunctions**所指向的函数地址表中共有5个元素。
- 由于没有序号为4和6的导出函数， 所以对应函数地址表元素值就为0
- 仅有三个函数有函数名， 所以**NumberOfNames**=3
- **AddressOfNameOrdinals**所指向的值表示， 这个函数名所对应的导出函数是哪个。



### 导入函数表解析

PE头文件中的 `IMAGE_OPTIONAL_HEADER32`结构体中 DataDirectory数组的第二个成员就是用于指向输入表的。 输入表是以一个 `IMAGE_IMPORT_DESCRIPTOR`（简称IID）结构体开始的数组, 最后以一个全为0的数组作为结束

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
typedef IMAGE_IMPORT_DESCRIPTOR UNALIGNED *PIMAGE_IMPORTDESCRIPTOR;
```

