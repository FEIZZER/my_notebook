### Linux的shell配置文件



##### /etc/profile文件

当用户登录到Linux系统，即启动login shell的时候，最先执行的就是 /etc/profile 。*对于non-login shell则不会执行这个文件*。对于写比较重要的文件可以在这里设置，在此文件中设置的变量都是全局变量。例如：

- PATH ； 预设的可执行文件或命令的搜索路径。
- USER ； 用户登录时使用的用户名。
- LOGINNAMRE ； 
- HOSTNAME ； 所使用的主机名。
- HISTSIZE ； 记录历史命令的行数。

