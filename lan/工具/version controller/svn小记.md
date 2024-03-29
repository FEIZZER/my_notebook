### svn iSVN的使用

#### svn是集中式的 和git的区别 特点

- svn是集中式的，没有本地的仓库，提交(commit)必须要有网络

  git是分布式的，使用分布式的版本控制系统会在本地也创建一个代码仓库，用于保存自己的修改和提交。

- git分支灵活易用，创建成本低且其切换迅速。git的分支是创建引用指向commit，且有本地仓库的存在，可以灵活的在本地管理自己的代码分支库。

  svn的分支是目录的拷贝。由于没有本地仓库，不能直接在本地保存代码历史。自然也**没有本地分支**。



#### SVN的基本使用

- `svn checkout path` 从远程仓库下载代码

  ```shell
  svn checkout svn://192.168.1.1/pro/domain
  ```

- `svn add file`  

- `svn commit -m "msg" [-N] [--no-unlock] path`将本地代码提交到远程仓库

- `svn lock`加锁操作

- `svn update` 版本更新，将远程仓库代码拉取到本地，需要解决冲突

- `svn status`  显示文件和子目录文件的状态，  文件状态标识符：

  - A 被添加到本地代码仓库
  - ' ' 没有修改
  - C 冲突
  - D 被删除
  - I 被忽略
  - M 被修改
  - R 被替换
  - X 外部定义创建的版本目录
  - ? 文件没有被添加到本地版本库内
  - !文件丢失或者不完整（不是通过svn命令删除的文件）
  - ~ 受控文件被其他文件阻隔

- `svn revert path`   回退目录中的代码版本到本地svn记录  **谨慎使用， 会导致丢失代码**

  `svn revert -R + 文件夹地址`  会回退文件夹中所有的文件， *如果不加-R 只会回退该文件下的文件。ls

- `svn resolved path` 用于移除工作目录中文件的冲突状态

### svn使用过程可能的问题

#### svn提交代码

##### 添加新文件到svn管理

`svn st | awk '{if ( $1 == "?") { print $2}}' | xargs svn add`  将所有状态为**？**的文件 执行add操作



#### 提交代码前   svn up并解冲突

这个过程中可能出现两种冲突 **text conflict** 和 **tree conflict**

##### text  conflict

文本冲突这种情况一般发生在， 你修改的文件在远程仓库也被修改了， 且svn无法确认该保留哪些代码。  此时文件的状态一般为 **C**， 即conflict冲突

1. 执行命令 `svn st | awk '{if ($1=="C"){print $0}}'`  , 查看处于文本冲突状态的文件列表。逐个手动解决冲突

   此时在文件的同级目录下会出现几个不同版本的代码， 方便你使用

2. 解决冲突后 执行 `svn resolved  [path]` , path就是文件地址。执行命令后同级目录下的版本文件会自动删除。

##### tree  conflict

分支冲突， 可能又有很多情况。

###### 你在本地修改的文件在远程仓库已经被删除。 文件状态一般为 **A+C**， 且会提示*incoming delete upon update*。 

1. 手动 `svn diff [path]` 查看你对该文件进行了哪些修改， 是否需要保留修改。
2. 如不需要保留， 可以执行`svn resolved [path]`,  随后删除该文件， 最后 `svn delete [path]`
3. 如需要保留修改， 考虑重新设计代码结构。



#### 提交代码 svn ci

1. 提交代码前，先在fr系统上申请一个bug-id。 
2. 对这个bug-id生成一个 codereview。  codereview的命令 `autoreview-cops -n [bug-id] -f [filepath]`, *其中filepath可以用逗号隔开， 不要加空格*
3. code-review通过后， 可以使用这个bug-id和 review-id 提交代码
4. 执行`svn ci`
5. 提交完代码后， `svn log` 可能会又延迟

##### 查看代码规模

`svn diff -r 4418:4419 | grep + |wc -l`



##### 只提交部分代码

`svn ci [path] [path]`   文件路径之间用空格隔开。

#### 学习一下在linux同时使用git和svn管理一个项目