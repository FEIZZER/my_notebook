##### 文件夹操作

1. vim /tmp/test/test.py
2. cp test.py test.py.bak
3. cd /tmp/
4. mkdir /root/home
5. cp test/ /root/home/test
6. cd test
7. rm test.py.bak
8. mv test.py /root/home/test.py
9. rm -r /root/home/test



##### find 命令

1. find / -name "service.log"
2.  翻译文件是什么文件
3. find / -name "*.conf"
4. find /tmp/ -user root ! -name "f*"
5. find /etc/ -type f -size +100k
6. find / -ctime 5 -name "*.log"



##### xargs 命令

1. find /tmp/ -name "*.txt" | xargs rm



##### awk命令

1. awk -f  fei.gawk awk_test.txt

   ```shell
   #  fei.gawk
     {
              num = 0
              res = ""
     
              for(i=1;i<=NF;i++){
                      j = i-1
                      if(i==1){ num++; continue;}
                      else if ($i == $j) { num++;}
                      else { res = res  $j  ":"  num  " "; num=1;}
              }
             if (num != 0) {
                     res = res  $NF  ":"  num;
             }
             print res;
     }
   ```

   

##### sed命令

1. sed -i  's/AAA/BBB/g' xyz
2. sed -i '3a ddd'  xyz
3. sed '/ccc/, /eee/d' xyz

##### grep命令

1. grep -i "class" views.py | wc -l
2. grep "^#" view.py
3.  ifconfig eth0 | grep -E "[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+" | awk '{print \$2 " "  \$6;}'
4.  ps -f | grep "bash" | awk '{print $2}'

##### linux权限

1. 从左往右是 文件拥有者的读写执行权限， 文件所在组成员的读写执行权限，其他人对该文件的权限。
2. x对于文件是执行权限。 对目录就是进入该目录的权限
3. 755 ->  111 101 101 -> rwx r-x r-x
4. 修改file文件的权限， 拥有者和所在组成员权限为rwx， 其他用户只有 --x
5. find /tmp/ -type f | xargs chmod 755
6. adduser test_account;   touch /tmp/root_own.txt;    chown test_acocunt root_own.txt



##### iptables

iptables -N hillstone_test_chain

iptables -I hillstone_test_chain -d 10.182.169.0/24 -j REJECT

// 现在地址均ping不通了

iptables -I OUTPUT -j hillstone_test_chain

iptables -I hillstone_test_chain -d 10.182.169.1 -j ACCEPT

// 只有 10.182.169.1  可以ping通

##### vim使用基础

l 在vi打开的文件中，如果去到该文件的页首和页尾？

​	- gg/G

l 在vi打开的文件中，如果去到该文件的行头和行尾？

​	-home end

l 用vi打开的文件中，如何进入编辑模式

​	- a i o r

l 用vi打开的文件中，如何从编辑模式回到一般模式

​	- esc

l 在vi的一般模式中，如何删除1行，n行；如何删除一个字符，如何删除一个单词

​	- dd   n + dd   x  dw

l 在vi的一般模式中，如何复制1行，n行并粘贴

​	- yy  n+yy  p

l 在vi的一般模式中，如何查找string这个单词

​	- 输入 /  + 输入string + enter

l 在vi的一般模式中，如何替换word1 为word2, 如果要实现确认机制应该怎么做？

​	- s/word1/word2/g

l 在vi的一般模式下，如何存盘，离开，存盘后离开，强制存盘后离开

​	- wq!

l 在vi的一般模式下，如何在打开的文件中再打开一个文件，同时显示两个文件，并在两个文件中跳转编辑

​	-vs/sp filename   ctrl+6

l 如何用vi对比两个文件的差异

	- :diffthis      :diffoff

:disappointed: 

