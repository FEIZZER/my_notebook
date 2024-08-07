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

    find  目录  [-option]  常见的option选项如下：

    -name  "*.txt"   以txt结尾的文件

    -type f      文件类型为普通为文件。 d是目录文件，p是管道文件

    -ctime  5   创建时间在近5天内的

    -mtine 5    修改时间

    -size  +100K   文件大小大于100k的

    -

    

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

      ```shell
      ls -lc filename      # 列出文件的 ctime （最后更改时间）
      ls -lu filename      #  列出文件的 atime（最后存取时间）
      ls -l filename         #  列出文件的 mtime （最后修改时间）
      stat   filename       #  查看文件属性
      ```

2. 文件权限

   可以通过 `ls -l` 或 `ll` 命令查看文件权限

   ​		  

   chown user filename  修改文件拥有者

   chgrp group filename 修改文件所属组群

   chmod  777 filename   修改文件权限

   ==对于目录来说， 要进入目录则需要 x权限， 要修改目录需要w权限。 如果我拥有目录的rwx权限， 但是目录中的文件权限为 --- 我依然可以删除该文件（即使我不能查看文件的内容）==

3. 文件种类

   我们在刚刚提到使用『ls -l』观察到第一栏那十个字符中，第一个字符为文件的类型。  除了常见的一般文件(-)与目录文件(d)之外，还有哪些种类的文件类型呢？ 
    正规文件(regular file )： 
   就是一般我们在进行存取的类型的文件，在由  ls -al  所显示出来的属性方面，第一个字符为  [ - ]，例如 [-rwxrwxrwx ]。另外，依照文件的内容，又大略可以分为： 
   o 纯文本档(ASCII)：这是 Linux 系统中最多的一种文件类型啰，  称为纯文本档是因为内容为我们人类可以直接读到的数据，例如数字、字母等等。  几乎只要我们可以用来做为设定的文件都属于这一种文件类型。  举例来说，你可以下达『  cat ~/.bashrc  』就可以看到该文件的内容。  (cat  是将一个文件内容读出来的指令) 
   o 二进制文件(binary)：还记得我们在『 第零章、计算器概论 』里面的软件程序的运作中提过，  我们的系统其实仅认识且可以执行二进制文件(binary file)吧？没错～  你的 Linux 当中的可执行文件
   (scripts,  文字型批处理文件不算)就是这种格式的啦～  举例来说，刚刚下达的指令 cat 就是一个
   binary file。 
   o 数据格式文件(data)：  有些程序在运作的过程当中会读取某些特定格式的文件，那些特定格式的文件可以被称为数据文件  (data file)。举例来说，我们的 Linux 在使用者登入时，都会将登录的数据记录在  /var/log/wtmp 那个文件内，该文件是一个 data file，他能够透过 last 这个指令读出来！  但是使用 cat 时，会读出乱码～因为他是属于一种特殊格式的文件。瞭乎？ 
    目录(directory)： 
   就是目录啰～第一个属性为  [ d ]，例如  [drwxrwxrwx]。 
    连结档(link)： 
   就是类似 Windows 系统底下的快捷方式啦！  第一个属性为l，例如  [lrwxrwxrwx]  ； 
    设备与装置文件(device)： 
   与系统周边及储存等相关的一些文件，  通常都集中在/dev 这个目录之下！通常又分为两种： 
   o 区块(block)设备档 ：就是一些储存数据，  以提供系统随机存取的接口设备，举例来说，硬盘与软盘等就是啦！  你可以随机的在硬盘的不同区块读写，这种装置就是成组设备啰！你可以自行查一下/dev/sda 看看，  会发现第一个属性为[ b ]喔！ 
   o 字符(character)设备文件：亦即是一些串行端口的接口设备，  例如键盘、鼠标等等！这些设备的特色就是『一次性读取』的，不能够截断输出。  举例来说，你不可能让鼠标『跳到』另一个画面，而是『连续性滑动』到另一个地方啊！第一个属性为  [ c ]。  

    资料接口文件(sockets)： 
   既然被称为数据接口文件，  想当然尔，这种类型的文件通常被用在网络上的数据承接了。我们可以启动一个程序来监听客户端的要求，  而客户端就可以透过这个 socket 来进行数据的沟通了。第一个属性为  [ s ]， 
   最常在/run 或/tmp 这些个目录中看到这种文件类型了。 
    数据输送文件(FIFO, pipe)： FIFO 也是一种特殊的文件类型，他主要的目的在解决多个程序同时存取一个文件所造成的错误问题。  FIFO
   是 first-in-first-out 的缩写。第一个属性为[p]  。

4. 文件的特殊权限

   SUID  SGID   SBIT

### 高级命令

#### 文本处理命令

###### awk命令

awk主要用于处理文本文件中的数据。

###### awk的命令格式

```
gawk option program file
    选项：     描述
    -F fs           指定行中划分数据字段的字段分隔符
    -f file         从指定的文件中读取程序
    -v var=value        定义gawk程序中的一个变量及其默认值
    -mf N           指定要处理的数据文件中的最大字段数
    -mr N           指定数据文件中的最大数据行数
    -W  keyword     指定gawk的兼容模式或警告等级
```

###### sed命令



###### grep命令







