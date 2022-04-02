# linux操作 

## linux下的runlevel

linux下有7种runlevel  可以用init命令来改变  其中Full Multiuser mode多用户模式和x11图形界面模式是最常用的。

0. halt 关机

1. single user mode单用户模式 仅支持root用户

2. Multiuser，without NFS 多用户但不支持网络文件

3. Full Miltiuser mode 完全多用户模式

4. unused  系统未使用，一般不用

5. X11  图形界面

6. Reboot 重启

   ```
   runlevel        # 查看当前运行级别
   init    N           # 改变当前运行级别
   ```

   运行级别的目录在/etc/rc.d/init.d ,原理暂不了解

## 快捷键  

win+t  :   打开终端

Ctrl+d  ：关闭终端

Ctrl+c  :   取消当前命令行的编辑，结束当前命令的执行

xdg-open+*filename* :  打开任意格式的文件（该目录下）或者打开一个网页

Ctrl+a  :光标移动到该行开始           Ctrl+e  ：光标移动到该行结束

Ctrl+f  :  向末尾移动一个字符         Ctrl+b   :  向开头移动一个字符

Ctrl+u  :  删除此处到开始的所有字符      Ctrl+k  ：  删除此处到结束的所有字符

Ctrl+l  :   清屏

Ctrl+p  :  复制上一个命令到当前行        Ctrl+n  ： 赋值下一个命令到当前行

连按两次tab:  显示已输入字符为开头的所有目录和命令

## 关机操作

shutdown -h now  ：立刻关机

shutdown -h  *hours:minutes*   :  设置时间关机

```
shutdown -h 15:30  //设置下午三点半关机
```

shutdown -c  :  取消预订时间关机

shutdown -r now  :  立刻重启



## 文件和目录

1. cp 拷贝文件

   cp [-f  -i  -r]    源文件    目标文件

   参数-f表示如果目标文件中有源文件的重名目录，直接覆盖

   参数-i  则表示需要征求用户意见

   参数-r  比表示复制目录时是否复制目录内文件

   ```
   cp -if /etc/yum  /home      # yum文件全部复制到home内
   cp     *.c   /home                    # 当前目录下所有.c文件都复制到/home
   ```

2. mv 移动文件

   cp  [-f -i]   源文件  目标文件

   ```
   mv  test1.txt  test2.txt           # 对同一目录下的文件移动其实是重命名操作
   ```

3. rm 删除文件

   rm [-f  -i  -r]   目标文件

   参数  -r  表示删除目录

   ```
   rm /tmp/*                 # 只会删除tmp目录下的文件，且会询问用户意见
   rm -rf /tmp/*           # 会删除tmp目录下所有文件和目录
   ```

4. ls 列出文件

   ls [-l  -i  -d  -a]  文件名或目录名

   参数  -l  显示文件名的同时显示文件信息

   参数  -i  显示文件inode索引号  （暂时不清楚什么作用）

   参数   -a  显示隐藏文件

   参数  -d  指向父文件

   ```
   ls  -dil  /root    # 不是显示root文件内的信息而是root本身的信息
   ```

5. mkdir 新建目录

   mkdir  [-p]  目录

   ```
   mkdir  ～/test     # 在用户目录下创建test文件
   mkdir  -p  /test/example  #在当前目录下创建多级目录
   ```

6. rmdir 删除目录

   rmdir  [-p]  目录

   只会删除空目录，不同于rm

7. pwd 查看当前目录

8. cd 切换目录

9. ```   
   cd ～(cd)    #  进入用户目录
   cd ..              # 返回父级目录
   cd _              # 返回上一个工作目录
   cd /               # 返回根目录
   ```

10. find和locate 查找文件和目录

    

11. touch  新建文件

    touch  [-a  -m  -c  -r  -t]  文件名称

    如果文件不存在则新建，如存在则修改文件modify时间

    参数  -a  表示只改变访问时间

    参数  -m  只修改  修改时间

    参数  -r    touch A  -r  B    把A的访问修改状态时间，设为和B一致

    参数  -t   使用指定时间创建文件

    参数  -d  使用指定的字符串表示文件的访问修改和状态时间=

12. file 查看文件类型

13. which 只查找可执行文件

    which  [-a]  可执行文件名

    参数  -a表示 all

14. whereis   寻找特定的文件

    whereis  [-b m s u]  文件或目录名

    参数  -b  只要二进制文件

    参数  -m  只找说明文件manual路径下的文件

    参数  -s  只找source源文件

    参数  -u  不在以上三个文件中的特殊文件

## linux文件属性

1. linux文件属性

   文件的三个时间

   1. access time  访问时间

      对文件进行读操作时，accesstime会变化

   2. modify time 修改时间

      对文件内容进行修改，即写入文件时

   3. change time  状态时间

      使文件状态属性(大小，类型等)发生改变时

      ```
      ls -lc filename      # 列出文件的 ctime （最后更改时间）
      ls -lu filename      #  列出文件的 atime（最后存取时间）
      ls -l filename         #  列出文件的 mtime （最后修改时间）
      stat   filename       #  查看文件属性
      ```

### 高级命令

1. ps  -[f e]   查看服务器的进程信息

   参数f   显示所有字段

   参数e  显示所有的进程

2. top

   动态显示进程占服务器资源的信息

   要退出按q

   ![image-20210303150418778](https://s2.loli.net/2022/04/02/KOXoS8HzCs9ZN1n.png) 

   其中VIRT表示虚拟内存，RES表示常驻内存， SHR表示共享内存。

   M  快捷键将进程按占用内存比例从高到底排序

   P   快捷键将进程按 CPU占用比例从高到底排序

   1   快捷键显示跟多CPU信息

