[mongo中文官网](https://mongodb.net.cn/)

### mongo基础

##### mongo概念

mongodb数据库是一个nosql数据库。由c++实现的分布式文件存储数据库系统

#### 基本CRUD操作

##### 数据库创建删除

- `use db_name` 创建数据库并切换进入该数据库
- `show dbs`  查看当前所有的数据库 *如果数据库中没有数据，那么不会显示*
- `db.dropDatabase()`  切换进入该数据库后执行此命令，删除数据库
- `db.stats()` 查看数据库信息

##### 集合创建删除

在插入数据时， 如果集合不存在，mongodb会自动创建集合的。

- `db.createCollection(name, options)`   创建集合其中 name必须， option可选。option的字段：

  - capped:bool ;   指定该集合的存储大小有上限，当达到最大值时会自动覆盖最早的文档数据。 **该值为true时， size必须指定**
  - size: int  ;   指定集合存储上限
  - max:int  ;   指定固定集合中包含文档的最大数量  **只有指定集合为固定集合才会生效，达到最大值会自动覆盖最早的文档数据**
  - autoIndexId:bool  ;  如果为true， 则自动在主键 _id 上创建索引

  ```shell
  # 创建集合
  db.createCollection("collection4", {max: 1, capped: true, size: 1600})
  ```

- `db.collection_name.stats()`  查看集合状态信息

- `db.collection_name.drop()`   删除指定集合

##### 插入数据

- `db.collection_name.insert({})` 或 `db.collection.insert([{}, {}])`   插入一个或多个文档，并返回一个写结果`WriteResult`对象。*方法似乎不推荐使用*

  ![image-20220823113921646](mongo基础.assets/image-20220823113921646.png) 

  ==什么是写结果对象， 有什么用？==

- `db.collection_name.insertOne({})` 插入一个集合 并返回一个文档，文档结构如下图：

  ![image-20220823114304427](mongo基础.assets/image-20220823114304427.png) 

- `db.collection_name.insertMany([{}, {}])` 插入多个集合，返回文档

##### 数据更新

- `db.collection_name.update(query, update, {upsert:bool, multi:bool, writeConcern})`  参数
  - query； update的查询条件
  - update；  更新的操作符和需要更新的对象数据
  - upsert ； 为true 则如果集合中没有该数据就创建一条数据
  - multi ； 为true则更新找到的所有数据
- `db.collection_name.updateOne()`
- `db.collection_name.updateMany()`

###### 更新操作符

##### 查询数据

##### 删除数据



