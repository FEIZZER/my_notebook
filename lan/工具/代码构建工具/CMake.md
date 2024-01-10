[CMake 行为准则 · Modern CMake (modern-cmake-cn.github.io)](https://modern-cmake-cn.github.io/Modern-CMake-zh_CN/chapters/intro/dodonot.html)

# CMAKE

##### template

```cmake
cmake_minimum_required(VERSION 3.8)
project(ues_core VERSION 1.0 LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
```



## 指令记录

### 安装与导出

#### `install`

install指令用于将项目生成的头文件, 库文件, 可执行文件等安装到指定的位置. 需要要执行 `cmake --install <src>` 来生效.  install的使用方法

```cmake
install(TARGETS myLib
        EXPORT myLibTarget
        RUNTIME DESTINATION runtime
        LIBRARY DESTINATION bin
        ARCHIVE DESTINATION lib)
```

安装目录的前缀可以通过设置 `CMAKE_INSTALL_PREFIX` 来指定.  安装文件的类型包括

| 目标文件       | 内容                    | 安装目录变量                | 默认安装文件夹 |
| -------------- | ----------------------- | --------------------------- | -------------- |
| ARCHIVE        | 静态库                  | ${CMAKE_INSTALL_LIBDIR}     | lib            |
| LIBRARY        | 动态库                  | ${CMAKE_INSTALL_LIBDIR}     | lib            |
| RUNTIME        | 可执行二进制文件        | ${CMAKE_INSTALL_BINDIR}     | bin            |
| PUBLIC_HEADER  | 与库关联的PUBLIC头文件  | ${CMAKE_INSTALL_INCLUDEDIR} | include        |
| PRIVATE_HEADER | 与库关联的PRIVATE头文件 | ${CMAKE_INSTALL_INCLUDEDIR} | include        |



#### install 导出配置

使用`install(EXPORT)` 方式导出

1. 在 `install(TARGETS)` 的代码中声明 导出TARGET的名称

   ```cmake
   install(TARGETS myLib
           EXPORT myLibTarget
           RUNTIME DESTINATION runtime
           LIBRARY DESTINATION bin
           ARCHIVE DESTINATION lib)
   ```

2. 随后单独使用 `install(EXPORT)`,  指定导出配置具体行为

   ```cmake
   install(EXPORT myLibTarget		# 已经在上面的 install(TARGETS) 中声明过了
           FILE myLibTarget.cmake	# 导出的文件的名字
           NAMESPACE LibDemo::		# 使用该库的时候需要带上的namespace前缀, 可选. 一般与库的名字相同
           DESTINATION cmake)		# 导出文件的路径, 以 CMAKE_INSTALL_PREFIX 为基准路径
   ```

   执行 `cmake --install <build_dir>` 命令后会在 ${CMAKE_INSTALL_PREFIX}/目录下生成  myLibTarget.cmake 文件, 并工根据配置生成  myLibTarget-debug.cmake或 myLibTarget-release.cmake文件.     myLibTarget.cmake 文件内部会自动调用 myLibTarget-xxx.cmake文件.

   

   如果这个myLib库不需要再给使用者传递什么变量信息(如 myLib_INCLUDE_DIR) 且 没有什么依赖项需要添加, 可以直接将 myLibTarget.cmake文件改为 myLibConifg.cmake, 不需要单独生成xxxConfig.cmake文件.

   

3. 单独生成 myLibConfig.cmake文件

   ```cmake
   # myLibConfig.cmake.in 文件
   
   @PACKAGE_INIT@
   # 引入 CMakeFindDependencyMacro 以使用 find_dependency宏.
   # 该宏一般是在Config.cmake文件中使用, 包含find_package的调用, 且不适用于find Module模式
   include(CMakeFindDependencyMacro)
   
   set_and_check(myLib_INCLUDE_DIR "@PACKAGE_myLib_INCLUDE_DIR@")
   include("${CMAKE_CURRENT_LIST_DIR}/myLibTarget.cmake") # 调用myLibTarget.cmake
   ```

   

   ```cmake
   # CMakeLists.txt 根据myLibConfig.cmake.in 文件生成 myLibConfig.cmake
   include(CMakePackageConfigHelpers)
   configure_package_config_file(
           myLibConfig.cmake.in
           ${CMAKE_CURRENT_BINARY_DIR}/myLibConfig.cmake
           PATH_VARS myLib_INCLUDE_DIR
           INSTALL_DESTINATION ${CMAKE_INSTALL_PREFIX}/cmake
   )	
   write_basic_package_version_file(
           myLibConfigVersion.cmake
           VERSION ${PACKAGE_VERSION}
           COMPATIBILITY AnyNewerVersion
   )
   ```

   

   ```cmake
   # 由 myLibConfig.cmake.in 生成的 myLibConfig.cmake
   get_filename_component(PACKAGE_PREFIX_DIR "${CMAKE_CURRENT_LIST_DIR}/../" ABSOLUTE)
   
   macro(set_and_check _var _file)
     set(${_var} "${_file}")
     if(NOT EXISTS "${_file}")
       message(FATAL_ERROR "File or directory ${_file} referenced by variable ${_var} does not exist !")
     endif()
   endmacro()
   
   macro(check_required_components _NAME)
     foreach(comp ${${_NAME}_FIND_COMPONENTS})
       if(NOT ${_NAME}_${comp}_FOUND)
         if(${_NAME}_FIND_REQUIRED_${comp})
           set(${_NAME}_FOUND FALSE)
         endif()
       endif()
     endforeach()
   endmacro()
   
   ####################################################################################
   
   include(CMakeFindDependencyMacro)
   set_and_check(myLib_INCLUDE_DIR "E:/workbench/CmakeProject/myLib/include/")
   include("${CMAKE_CURRENT_LIST_DIR}/myLibTarget.cmake")
   ```

   

#### `find_package `

find_package用于查找指定的package, 其支持两种搜索方法:

- **Config mode**: 查找xxx-config.cmake或 xxxConfig.cmake的文件,如果指定了版本详细信息，它还将查找xxx-config-version.cmake或xxxConfigVersion.cmake. 如Opencv库的OpenCVConfig.cmake.

  - 通过 CMAKE_PREFIX_PATH 来设置搜索路径.  例如有如下的第三库希望被添加 `/opt/lib/somepackage/lib/cmake/SomePackageConfig.cmake`,  则应该将会`/opt/lib/somepackage`添加到 CMAKE_PREFIX_INSTALL变量.
  - 也可以通过设置PackageName_DIR变量来设置单个库的 .cmake文件路径. 这时候应该将完整的 `/opt/lib/somepackage/lib/cmake/SomePackageConfig.cmake` 添加到变量 SomePackage_DIR变量

  config和version文件往往作为package的一部分被安装, 因此他们比 find modules更加可靠. 

  > 

- **Module mode**:查找Findxxx.cmake文件, 如OpenCV库的FindCUDA.cmake文件. 通过 CMAKE_MODULE_PATH 变量来设置搜索路径

  一般是一些不原生支持CMake的Package, 可以单独提供find module文件. 由于find module文件不与项目同时发布, 且很容易过时, 所以不如config file可靠.
