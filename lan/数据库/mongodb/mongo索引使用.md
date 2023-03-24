### 索引



> 索引是一种特殊的数据结构， 索引**存储在易于遍历读取的数据集合中**，索引是对数据库中一列多列数据的值进行排序的结构。 由于索引存储在`RAM`中， 所以索引查询比通过直接扫描文本读取数据快的多。

##### 索引的限制

- **额外开销**  每个索引会占据一定的空间。 并且在对数据进行插入更新删除时也需要对索引进行操作。 *所以是优化查询， 削弱写操作的。*
- **内存使用**
- **最大范围**
- **查询限制**



#### 基本使用

##### 创建索引

`db.collection.createIndex(keys, opts)`  或  `db.collection.ensureIndex(keys, opts)`*在mongo3.0.0版本开始使用*

###### 可选的参数列表如下

![image-20230307112711850](mongo索引使用.assets/image-20230307112711850.png) 

创建唯一索引的命令 `db.collection.ensureIndex({"title":1}, {unique:true})`



##### 查看索引

`db.collection.totalIndexSize()`  查看集合索引的大小

`db.collection.getIndexes()`  查看ji'he的索引

##### 删除索引

删除该集合下所有的索引`db.collection.dropIndexes()`

删除指定的索引 `db.collection.dropIndex("索引名称")`   或  `db.collection.dropIndex(keys)`

#### 索引实践

> 在MongoDB中，排序操作，可以通过从索引中按照索引的顺序获取文档的方式，来保证结果的有序性。
>
> 如果MongoDB的查询计划器(planner)没法从索引中得到排序顺序，那么它就需要在内存中对结果排序，相比于“不用索引的排序”操作，用索引会有更好的性能。
>
> 关键是：不用索引的排序操作，会在用了超过32MB内存时终止，也就是说MongoDB只能支持32MB的非索引排序 ，如果数据量很大，比如我目前的应用场景下，都是千万级数据量，而且飞速增加，达亿级……
>
> 用索引对查询结果进行排序，索引，是以升序(1) 或 降序(-1) 的排序顺序，存储对字段的引用。

##### 索引生效的条件

- **单字段索引的排序**  

  如果在单字段上是升序索引或降序索引，则对该字段的排序操作可以是任一方向， 索引都会生效。

  ```sqlite
  db.records.createIndex({"a":1})
  // 对于但字段索引字段的排序顺序不重要， 因为mongoDB可以往任意方向遍历索引
  db.records.find().sort({"a":1})
  db.records.find().sort({"a":-1})
  ```

- **复合索引的排序**

  用复合索引排序时，sort() 中所指定的排序字段有以下两点需要遵循，否则不会走索引排序：

  - sort() 排序字段的顺序 必须和 它们在索引中的顺序一致

    ```sql
    db.records.createIndex({"a":1, "b":1})
    // 支持 {"a":1, "b":1}， 但是不支持{"b":1, "a":1}
    db.records.find().sort({"a":1, "b":1})
    ```

  - sort()排序字段的升序降序必须和索引中的完全一致或完全相反

    ```sql
    db.records.createIndex({"a":1, "b":-1})
    // 支持 {"a":1, "b":-1} 或 {"a":-1, "b":1}， 但是不支持{"a":1, "b":1}
    db.records.find().sort({"a":1, "b":-1})
    ```

  复合索引的前缀和排序字段一致(复合最左前缀原则)， 也可使用到索引

  ```sql
  db.records.createIndex( { a:1, b: 1, c: 1, d: 1 } ) 
  // {"a":1}  {"a":1, "b":1}  {"a":, "b":, "c":} 均可应用到该索引
  ```

  

  ==查询语句中 必须 把排序字段之前的所有前缀字段，都加上相等条件， 也可使用索引==

  ```sql
  db.records.createIndex({a:1, b:1, c:1})
  db.data.find( { a: 5 } ).sort( { b: 1, c: 1 } )	{ a: 1 , b: 1, c: 1 }
  db.data.find( { b: 3, a: 4 } ).sort( { c: 1 } )	{ a: 1, b: 1, c: 1 }
  db.data.find( { a: 5, b: { $lt: 3} } ).sort( { b: 1 } )	{ a: 1, b: 1 }
  // 以上均可使用到索引
  ```





#### explain()执行计划分析

explain结果将查询计划以阶段树的形式呈现。每个阶段将其结果(文档或索引键)传递给父节点。叶节点访问集合或索引。中间节点操纵有子节点产生的文档或索引建。根节点是mongodb从中派生结果集的最后阶段。

语法  `db.collection.explain(verbosity).aggregate(...)`  或  `db.collection.aggregate(...).explain(verbosity)`

##### explain()方法参数 （主要影响返回值， 显示多少信息）

- **queryPlanner**  或  **0/false**  默认值; 返回值只返回 queryPlanner和serverInfo

  

- **executionStats**  返回值返回 详细的执行状态相关信息,如 扫描了多少行,耗时多久等等;

  

- **allPlansExecution**  或  **1(非0的值都行) /true** 返回值在 executionStats 字典中多了allPlansExecution字段;



```json
{
    "queryPlanner": {  # 查询计划
        "plannerVersion": NumberInt("1"),  # 计划版本
        "namespace": "db_name.collection_name",  # 命名空间,作用于哪个库的哪个集合
        "indexFilterSet": false,  # 是否对查询使用索引过滤
        "parsedQuery": {  # 解析查询条件
            "index_key_name": {
                "$eq": 1
            }
        },
        "queryHash": "6ACB91B3",  # 仅对查询条件进行hash的16进制字符串,帮助识别相同查询条件的 其他查询操作或写操作
        "planCacheKey": "ACADC259",  # 和查询关联的计划缓存的hash键
        "winningPlan": {  # 查询优化器 选择的最优执行计划,此计划包含多个 树状结构的子阶段(一个查询计划需要多个阶段来完成);
            "stage": "FETCH",  # 父阶段;查询方式
            "inputStage": {  # 子阶段
                "stage": "IXSCAN",  # 子阶段的查询方式
                "keyPattern": {  # 索引模式
                    "index_key_name": 1
                },
                "indexName": "index_key_name_1",  # 索引名称
                "isMultiKey": false,  # 是否是复合索引
                "multiKeyPaths": {  # 复合索引路径
                    "index_key_name": []
                },
                "isUnique": true,  # 是否是唯一索引
                "isSparse": false,  # 是否是稀疏索引
                "isPartial": false,  # 是否是部分索引
                "indexVersion": NumberInt("2"),  # 索引版本
                "direction": "forward",  # 索引方向
                "indexBounds": {  # 索引查询的范围边界
                    "index_key_name": [  # 创建索引的key
                        "[1.0, 1.0]"  # 边界范围
                    ]
                }
            }
        },
        "rejectedPlans": []  # 查询又花钱 拒绝的执行计划
    },
    "executionStats": {  # 详细的执行统计信息
        "executionSuccess": true,  # 是否执行成功
        "nReturned": NumberInt("0"),  # 符合查询条件的文档个数
        "executionTimeMillis": NumberInt("0"),  # 选择某个查询计划和执行查询 所耗费的总时间(毫秒)
        "totalKeysExamined": NumberInt("0"),  # 扫描的索引总行数
        "totalDocsExamined": NumberInt("0"),  # 扫描的文档总次数(即使同一个文档如果被扫描2次,则此值为2),常见于 stage为 COLLSCAN/FETCH
        "executionStages": {  # 用树状形式 描述 详细的执行计划
            "stage": "FETCH",  # 查询方式
            "nReturned": NumberInt("0"),
            "executionTimeMillisEstimate": NumberInt("0"),  # 估计执行时间(毫秒)
            "works": NumberInt("1"),  # 指定查询执行阶段执行的“工作单元”的数量。查询执行将其工作划分为小单元。
            # “工作单元”可能包括检查单个索引键、从集合中获取单个文档、对单个文档应用投影或进行内部簿记
            "advanced": NumberInt("0"),  # 由这一阶段返回到它的父阶段的中间结果或高级结果的数量。
            "needTime": NumberInt("0"),  # 未将中间结果提前到其父阶段的工作循环数
            "needYield": NumberInt("0"),  # 为了让写操作执行,而让出读锁的次数
            "saveState": NumberInt("0"),  # 查询阶段暂停处理并保存其当前执行状态的次数，例如准备放弃其锁
            "restoreState": NumberInt("0"),  # 查询阶段恢复已保存的执行状态的次数，例如，在恢复以前生成的锁之后。
            "isEOF": NumberInt("1"),  # 执行阶段是否已到达最后一个; 1:是 0:不是
            "docsExamined": NumberInt("0"),  # 扫描文档总次数
            "alreadyHasObj": NumberInt("0"),
            "inputStage": {
                "stage": "IXSCAN",
                "nReturned": NumberInt("0"),
                "executionTimeMillisEstimate": NumberInt("0"),
                "works": NumberInt("1"),
                "advanced": NumberInt("0"),
                "needTime": NumberInt("0"),
                "needYield": NumberInt("0"),
                "saveState": NumberInt("0"),
                "restoreState": NumberInt("0"),
                "isEOF": NumberInt("1"),
                "keyPattern": {
                    "index_key_name": 1
                },
                "indexName": "index_key_name_1",
                "isMultiKey": false,
                "multiKeyPaths": {
                    "index_key_name": []
                },
                "isUnique": true,
                "isSparse": false,
                "isPartial": false,
                "indexVersion": NumberInt("2"),
                "direction": "forward",
                "indexBounds": {
                    "index_key_name": [
                        "[1.0, 1.0]"
                    ]
                },
                "keysExamined": NumberInt("0"),  # 通过索引扫描的文档总个数
                "seeks": NumberInt("1"),  # 为了完成索引扫描，必须将索引游标搜索到新位置的次数。
                "dupsTested": NumberInt("0"),
                "dupsDropped": NumberInt("0")
            }
        },
        "allPlansExecution": []  # 在计划选择阶段,获胜计划和被拒绝计划的部分执行信息
    },
    "serverInfo": {  # mongo服务信息
        "host": "aa8f4be",
        "port": NumberInt("27010"),
        "version": "4.2.0",
        "gitVersion": "a4b751dcf51dd249c5865812b390cfd"
    },
    "ok": 1
}
```

##### stage状态

| 状态              | 描述                                   |
| ----------------- | -------------------------------------- |
| `COLLSCAN`        | 全表扫描                               |
| `IXSCAN`          | 索引扫描                               |
| `FETCH`           | 根据索引检索指定文档                   |
| `SHARD_MERGE`     | 将各个分片返回数据进行合并             |
| `SORT`            | 在内存中进行了排序                     |
| `LIMIT`           | 使用limit限制返回数                    |
| `SKIP`            | 使用skip进行跳过                       |
| `IDHACK`          | 对_id进行查询                          |
| `SHARDING_FILTER` | 通过mongos对分片数据进行查询           |
| `COUNTSCAN`       | count不使用Index进行count时的stage返回 |
| `COUNT_SCAN`      | count使用了Index进行count时的stage返回 |
| `SUBPLA`          | 未使用到索引的$or查询的stage返回       |
| `TEXT`            | 使用全文索引进行查询时候的stage返回    |
| `PROJECTION`      | 限定返回字段时候stage的返回            |

