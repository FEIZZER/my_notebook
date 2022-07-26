## cm或powershell中的一些使用

##### 直接ssh连接

```shell
ssh [-p port] userName@ip
```

### 命令行使用fetch



##### powershell的执行策略

- 查看当前的执行策略 `get-executionPolicy` 
- 修改当前执行策略 `set-executionPolicy RemoteSigned`  下面十几个比较重要的策略：
  - Restricted	禁止运行任何脚本和配置文件（默认）
  - AllSigned	可以运行脚本，但要求所有脚本和配置文件由可信发布者签名，包括在本地计算机上编写的脚本
  - RemoteSigned	可运行脚本，但要求从网络上下载的脚本和配置文件由可信发布者签名；不要求对已经运行和本地计算机编写的脚本进行数字签名
  - Unrestricted	可以运行未签名的脚本

