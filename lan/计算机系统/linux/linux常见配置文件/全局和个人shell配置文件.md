### Linux的shell配置文件

<img src="全局和个人shell配置文件.assets/未命名文件 (4).png" alt="未命名文件 (4)" style="zoom:80%;" />大致的**执行优先级:   ** 

/etc/profile >>> /etc/profile.d/*sh >>> ~/.bash_profile >>> ~/.bashrc >>> /etc/basgrc

##### issue配置文件中转移字符的含义

`\d`  显示系统的当前日期

`\t` 显示系统的当前时间

`\s` 显示操作系统的名称

`\l` 显示登陆的终端号

`\m` 显示硬件体系结构，如i386, i686等

`\n` 显示主机名

`\o` 显示域名

`\r` 显示内核版本

`\u`  显示登陆用户的序列号

##### /etc/profile文件

当用户登录到Linux系统，即启动login shell的时候，最先执行的就是 /etc/profile *也只会执行这一次* 。*对于non-login shell则不会执行这个文件*。对于写比较重要的文件可以在这里设置，在此文件中设置的变量都是全局变量。例如：

- PATH ； 预设的可执行文件或命令的搜索路径。
- USER ； 用户登录时使用的用户名。
- LOGINNAMRE ； 
- HOSTNAME ； 所使用的主机名。
- HISTSIZE ； 记录历史命令的行数。



##### ~/.bash_profile文件



##### ~/.bashrc 文件

