### 导入表信息的获取

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

