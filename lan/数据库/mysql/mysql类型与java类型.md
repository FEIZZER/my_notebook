|        MySql 类型名         |   jdbcType 返回值    |                        返回的 Java 类                        |
| :-------------------------: | :------------------: | :----------------------------------------------------------: |
|     bit(1) (MySQL-5.0)      |         BIT          |                      java.lang.Boolean                       |
|   bit(大于1) (MySQL-5.0)    |         BIT          |                            byte[]                            |
|           tinyint           |       TINYINT        | 如果 tinyInt1isBit 配置设置为 true(默认为 true)，是java.lang.Boolean，存储空间为 1；否则是为 java.lang.Integer |
|        bool boolean         |       TINYINT        |          参见 TINYINT。这些是 TINYINT(1) 另一种写法          |
|   smallint(M) [unsigned]    | SMALLINT [UNSIGNED]  |               java.lang.Integer(不管是否无符)                |
|   mediumint(M) [unsigned]   | MEDIUMINT [UNSIGNED] |                      java.lang.Integer                       |
|  int integer(M) [unsigned]  |  INTEGER [UNSIGNED]  |         java.lang.Integer；无符的话是 java.lang.Long         |
|    bigint(M) [unsigned]     |  BIGINT [UNSIGNED]   |       java.lang.Long；无符的话是 java.math.BigInteger        |
|         float(M,D)          |        FLOAT         |                       java.lang.Float                        |
|         double(M,B)         |        DOUBLE        |                       java.lang.Double                       |
|        decimal(M,D)         |       DECIMAL        |                     java.math.BigDecimal                     |
|            date             |         DATE         |                        java.sql.Date                         |
|          datetime           |       DATETIME       |                      java.sql.Timestamp                      |
|        timestamp(M)         |      TIMESTAMP       |                      java.sql.Timestamp                      |
|            time             |         TIME         |                        java.sql.Time                         |
|          year(2/4)          |         YEAR         | 如果 yearIsDateType 配置设置为 false，返回的对象类型为 java.sql.Short；如果设置为 true(默认为 true)，返回的对象类型是 java.sql.Date，其具体时间是为一月一日零时零分 |
|           char(M)           |         CHAR         | java.lang.String(除非该列字符集设置为 BINARY，那样返回 byte[]) |
|     varchar(M) [binary]     |       VARCHAR        | java.lang.String(除非该列字符集设置为 BINARY，那样返回 byte[]) |
|          binary(M)          |        BINARY        |                            byte[]                            |
|        varbinary(M)         |      VARBINARY       |                            byte[]                            |
|          tinyblob           |       TINYBLOB       |                            byte[]                            |
|          tinytext           |       VARCHAR        |                       java.lang.String                       |
|            blob             |         BLOB         |                            byte[]                            |
|            text             |       VARCHAR        |                       java.lang.String                       |
|         mediumblob          |      MEDIUMBLOB      |                            byte[]                            |
|         mediumtext          |       VARCHAR        |                       java.lang.String                       |
|          longblob           |       LONGBLOB       |                            byte[]                            |
|          longtext           |       VARCHAR        |                       java.lang.String                       |
| enum('value1','value2',...) |         CHAR         |                       java.lang.String                       |
| set('value1','value2',...)  |         CHAR         |                       java.lang.String                       |