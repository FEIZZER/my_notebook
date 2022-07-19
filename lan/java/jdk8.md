###   JDK8新增函数式编程

###### 函数式编程思想

函数式编程并不局限于任意一门语言，它是一种编程思想。java传统的面向对象思想注重从对象出发，由对象完成一项工作。而 **函数式编程**则不关注由谁来完成，只关注完成工作的方法与结果。

在java中依据可推到可省略的原则，借由lamda表达式实现函数式编程。

#### 从lamda表达式开始

##### 基本语法

###### 定义了这样一个方法

```java
public class LamdaTest {
    //传入一个参数类型是 IntBinaryOperator接口 
    static int caculate(IntBinaryOperator operator) {
        int i = 1;
        int j = 2;
        return operator.applyAsInt(i, j);
    }
}
```

###### 传统匿名内部类来使用该方法

```java
LamdaTest.caculate(new IntBinaryOperator() {
    @Override
    public int applyAsInt(int left, int right) {
        return left + right;
    }
});
```

###### 使用lamda简化

只有参数是 ==函数式接口==的地方才可以使用借由lamda简化， 函数式接口是指==内部只定义了一个抽象方法*可以有其他默认default方法*，且接口上有@FunctionalInterface注解 (注解不是必要的)== [[jdk8#函数式接口记录]]

```java
LamdaTest.caculate((left, right) -> { return left + right;});
```

#### Stream流  *注意不是I/O流的 Stream*

jdk8中的Stream流使用的是函数式编程模式，正如他的名字一样，它可以像流一样对集合或数组进行链状流式的操作。借此我们可以更方便的操作集合数组。

```java
List<Integer> list = new ArrayList<>();
list.add(1);list.add(2);list.add(3);list.add(4);
list.stream()
 		.filter(res -> {return res < 3;})
        .forEach(res -> { System.out.println(res); });
//结果打印 1 2
```

##### 创建流对象

JDK8在`jjava.util.Collection`接口中新增一个 default方法 Stream() ,用于生成Stream()流对象，这意味着所有 `Collection`下的类都可以调用 `.Stream()`方法获得一个Stream流对象。

```java
default Stream<E> stream() {
    return StreamSupport.stream(spliterator(), false);
}
```

数组也可以通过`Array.stream(array)`方法获得。

##### 中间操作

中间操作就是Stream流对象可调用的一个个方法，其参数往往就是一个 **函数式接口** 可以用lamda进行简化

- filter   .filter( IntPredicate   intPredicate)   需要实现一个test()方法返回Boolean值， true则保留 false则删除

  ```java
  int[] a = new int[10];
  IntStream stream = Arrays.stream(a).filter(new IntPredicate() {
      @Override
      public boolean test(int value) {
          return false;
      }
  });
  //进行简化
  IntStream stream = Arrays.stream(a).filter(value -> false);
  ```

- map   \<R\> Stream\<R\> map(Function<? super T, ? extends R> mapper)

  map方法是一个中间操作，作用是将当前Stream中的每个元素通过参数 mapper 转换为另一个元素，转换前的元素类型为T，转换后的元素类型为 R。

- distinct()  没有参数， 将会进行去重操作，*注意他会使用equals操作进行判重。*

- sorted()

  - sorted() 函数使用时可以不带参数， 但是流中的对象类必须实现 Comparable\<T\>接口，实现 compareTo方法
  - 如果流中的对象并未实现 Comparable\<T\>接口， 且不可更改，则可以传入一个参数 类型为 Comparator\<? super T\>。 *必然的， 这个接口也是函数式接口*

- limit()和 skip()  传入需要限制或跳过的对象的长度。

- flatMap() 可以自动将返回stream()内容进行一下合并

  ```java
  ArrayList<ArrayList<Integer>> arrayLists = new ArrayList<>();
  ArrayList<Integer> a = new ArrayList<>();
  ArrayList<Integer> b = new ArrayList<>();
  a.add(1); a.add(2);
  b.add(1);b.add(2);
  arrayLists.add(a);arrayLists.add(b);
  arrayLists.stream()
          .flatMap(list -> {
              return list.stream();
          })
          .distinct()
          .forEach(num -> {
              System.out.println(num);
          });
  // >> 1 2
  ```

##### 终结操作

- forEach() 对流中的每个进行操作， 没有返回值。

- count()    返回当前流中元素的个数

- max&min()   返回当前流中的最值。该函数需要一个参数是 `Comparator<? super T>`接口 且不同于sorted()  这个参数不可省略。 ==并且它返回的是一个`Optional<T>`类型.[[jdk8#JDK8 使用Optional对象避免NullPointerException]]

  ```java
  ArrayList<Integer> a = new ArrayList<>();
  a.add(1); a.add(2);
  arrayLists.add(a);arrayLists.add(b);
  Optional<Integer> max = a.stream()
          .max((o1, o2) -> o1 - o2);
  ```

- collect()     用来把当前流转化成一个集合List Set Map

  collect()这个函数的参数很复杂， 并不是一个函数式接口， 但是jdk给我提供了一个工具类`java.util.stream.Collectors`， 使用这个工具类里面的静态函数实现基本功能

  - 转化成一个List 或者 Set 类型

    ```java
    List<Integer> aList = a.stream().collect(Collectors.toList());
    Set<Integer> aSet = a.stream().collect(Collectors.toSet());
    ```

  - 转化成一个Map类型   Collectors.toMap()的参数有点复杂，如下两个Function接口类型的参数， 这个Function类型是 ` java.util.function.Function` 是一个函数式接口。

    ```java
    public static <T, K, U>
    Collector<T, ?, Map<K,U>> toMap(Function<? super T, ? extends K> keyMapper,
                                    Function<? super T, ? extends U> valueMapper)
    ```
    
    代码演示：
    
    ```java
    ArrayList<Integer> a = new ArrayList<>();
    a.add(1); a.add(2);
    Map<String, Integer> aMap = a.stream().collect(Collectors.toMap(new 		     Function<Integer, String>() {
                @Override
                public String apply(Integer integer) {
                    return integer.toString();
                }
            }, new Function<Integer, Integer>() {
    
                @Override
                public Integer apply(Integer integer) {
                    return integer;
                }
            }));
    ```
    
    第一个Function类型参数指定生成的map的key值， 第二个Function类型指定生成的value的值。
    
    ==注意，这里的key是不可以重复的，即不能出现两个元素在第一个Function参数里返回一样的（equals()函数返回true）值， 否则会抛出异常  illegalStateException: Duplicate key [重复的key值]==
    
    ![image-20220513220910937](D:\notebook\lan\java\jdk8.assets\7VKd2hN3MRjCy8c.png)
  
- 查找与匹配

  - anyMatch()  可以用来判断流中是否有任意元素满足条件 返回boolean值 。它需要一个Predicate<>接口类型的参数*这个参数类型和filter()函数的参数类型一样*

    ```java
    ArrayList<Integer> a = new ArrayList<>();
    a.add(1); a.add(2);a.add(3);
    boolean b = a.stream().anyMatch(new Predicate<Integer>() {
        @Override
        public boolean test(Integer integer) {
            return integer > 3;
        }
    });
    System.out.println(b); //false
    ```

  - allMatch()  判断流中的元素是否全部符合匹配条件。参数类型同上

  - noneMatch()   如果流中的元素全都不符合匹配条件才会返回true。参数类型同上

  - findAny()   获取当前流中任意一个元素， 返回一个Optional对象，没有参数。==注意这个并不能保证得到的是当前流中的第一个元素==
  
  - findFirst()  获取当前流中的第一个元素 返回Optional对象 没有参数。
  
    ```java
    ArrayList<Integer> a = new ArrayList<>();
    a.add(1); a.add(2);a.add(3);
    Optional<Integer> any = a.stream().findAny();
    System.out.println(any.get()); // 1
    ```
  
- **reduce() 归并操作**   

  第一种接收两个参数 一个是流中元素类型 作为初始值， 一个是BinaryOperator\<T\>函数式接口类型(*累加器*)

  ```java
  T reduce(T identity, BinaryOperator<T> accumulator);
  //
  ArrayList<Integer> a = new ArrayList<>();
  a.add(1); a.add(2);a.add(3);
  Integer reduce = a.stream().reduce(1, new BinaryOperator<Integer>() {
      @Override
      public Integer apply(Integer result, Integer integer2) {
          return result + integer2;
      }
  });
  System.out.println(reduce);  //7
  ```

  第二种只接收一个参数 就是BinaryOperator\<T\>函数式接口类型(*累加器*)。 这时默认把流中的第一个元素视为初始值。==并且这个方法的返回类型是 Optional\<T\>==

  **第三种使用方法 需要接收三个参数**

#### Stream基本数据类型的优化

java中基本数据类型和它的封箱类型之间互换是有成本的，所有应该尽量避免。之前提到Collections接口中的stream()方法和 Arrays.stream()方法返回的 流对象其实是不样的。

```java
//Array类中的方法 返回的是一个IntStream类型的流对象
public static IntStream stream(int[] array) {
    return stream(array, 0, array.length);
}
```

```java
//Collections接口中的stream()方法返回的是一个泛型接口 Stream<E>
default Stream<E> stream() {
    return StreamSupport.stream(spliterator(), false);
}
```

显然的 泛型中的类型不能为基本类型， 所以基本类型的流和对象的流显然不一样。那么下面的情况如果数据量非常大就会导致非常多的封箱转换操作。

```java
ArrayList<Integer> a = new ArrayList<>();
a.add(1);a.add(2);a.add(22);
a.stream()
        .map(e->e + 10)
        .filter(e-> !(e <= 10))
        .forEach(e->{
            e = e+10;
        });
```

可以将Steam\<Integer\>类型的流转化成IntStream的流：

```java
a.stream()
        .mapToInt(e->e)
        .map(e->e + 10)
        .filter(e-> !(e <= 10))
        .forEach(e->{
            e = e+10;
        });
```

==其他的一些转化方法：== mapToLong()  mapToInt,  mapToDouble等等

#### 数组和Stream流之间互转

##### 数组转Stream

- 基本数据类型数组转流  Arrays.stream(array);
- 对象数组转流     Arrays.stream(obs); 或   Stream.of(obs);

##### Stream转数组

可以使用终结操作 toArray() 将流 转化成数组。

- 如果是基本类型的流如IntStream， 不需要参数直接接收返回值即可

  ```java
  ArrayList<Integer> a = new ArrayList<>();
  a.add(1);a.add(2);a.add(22);
  int[] ints = a.stream().mapToInt(value -> value).toArray();
  ```

- 如果是泛型流Stream\<T\> , 就需要添加参数，指定返回值类型，否则返回 Object[]数组。

  ```java
  ArrayList<Integer> a = new ArrayList<>();
  a.add(1);a.add(2);a.add(22);
  Integer[] integers = a.stream().toArray(new IntFunction<Integer[]>() {
      @Override
      public Integer[] apply(int value) {
          return new Integer[value];
      }
  });
  ```

  **其中value值代表的是数组的长度，这里可以用方法引用简化**

#### 并行流

当流中的数据量非常大时 可以考虑使用多线程流，` .parallel()` 方法 或者 `.parallelStream()`方法

==注意这样产生的多线程流是非线程安全的==

#### 方法引用

方法引用是java8中特定情况下简化lambada表达式的一种语法糖。

##### 引用类的静态方法

###### 格式 

```
类名::方法名
```

###### 使用前提

如果在重写方法的时候， 方法体中**只有一行代码**，并且这行代码调用了某个类的静态方法，并且**把重写的方法中的所有参数都按照顺序都传入这个静态方法**中， 这个时候我们就可以引用类的静态方法

###### 演示

```java
ArrayList<String> a = new ArrayList<>();
a.add("1"); a.add("2");a.add("22");
a.stream().forEach(ele->{
    Integer.parseInt(ele);
});
```

优化后：

```java
ArrayList<String> a = new ArrayList<>();
a.add("1"); a.add("2");a.add("22");
a.stream().forEach(Integer::parseInt);
```

##### 引用对象的实例方法

###### 格式

```java
对象名::方法名
```

###### 使用前提

如果在重写方法的时候， 方法体中**只有一行代码**，并且这行代码调用了某个对象的实例方法，并且**把重写的方法中的所有参数都按照顺序都传入这个实例方法**中， 这个时候我们就可以引用对象的实例方法



##### **引用类的实例方法** *或者说是引用一个匿名对象的实例方法*

###### 格式

```java
类名::方法名
```

###### 使用前提

如果在重写方法的时候，方法体**只有一行代码**， 且这行代码**调用了第一个参数的成员方法**， 且重写的方法中的**其他所有参数都按顺序传入这个成员方法中**， 这时候我们可以使用引用类的实例方法。

###### 演示

```java
public class MethodDemo {
    interface FunctionalInterface{
        String func(String str, int start, int end);
    }
    public static void test(String str, FunctionalInterface functionalInterface){
        System.out.println(functionalInterface.func(str, 3, 6));
    }

    public static void main(String[] args) {
        test("12345678", new FunctionalInterface() {
            @Override
            public String func(String str, int start, int end) {
                return str.substring(start, end);
            }
        });
    }
}
//456
```

简化后

```java
public class MethodDemo {
    interface FunctionalInterface{
        String func(String str, int start, int end);
    }
    public static void test(String str, FunctionalInterface functionalInterface){
        System.out.println(functionalInterface.func(str, 3, 6));
    }

    public static void main(String[] args) {
        test("12345678", String::substring);
    }
}
//456
```



##### 构造器的引用 *构造方法的引用*

###### 格式

```java
类名::new
```

###### 使用前提

在我们这些方法的时候， 方法体中只有一行代码， 且这行代码**调用了某一个类的构造方法**， 且我们把**要重写的方法中的所有参数都按照顺序传入这个构造方法中**，这时候可以使用引用构造器。

```java
ArrayList<String> a = new ArrayList<>();
a.add("1"); a.add("2");a.add("22");
a.stream().forEach(ele->{
    new Book(ele);
});
```

简化后

```java
ArrayList<String> a = new ArrayList<>();
a.add("1"); a.add("2");a.add("22");
a.stream().forEach(Book::new);
```

#### 函数式接口记录



### JDK8 使用Optional对象避免NullPointerException

Optional类属于工具类 是jdk8新增类，用于优雅的解决程序中经常出现的空指针异常，且提供了多种调用方法，使代码更加干净整洁。`java.util.Optional<T>`         [[java高级#java的泛型]]。

Optional其实就是使用类的泛型类型封装一个value ， 将具体的数据封装进Optional对象中，然后使用Optional提供的一些方法就可以优雅的避免发生空指针异常。

###### 创建Optional对象

**使用静态方法 . ofNullable 或 .of方法 **封装一个值编程Optional对象。

```java
//ofNullable()方法允许封装的值可以为null
Optional<String> null_str   = Optional.ofNullable(null);
//of() 方法不允许。。。
Optional<String> str = Optional.of("str");
```

其中ofNullable() 方法的源码如下所示， 可以看到在构建封装值null的对象时，是直接返回一个内部的静态对象，==这意味着任意一个Optional.ofNullable(null) == Optional.empty()== 

```java
private static final Optional<?> EMPTY = new Optional<>();
public static <T> Optional<T> ofNullable(T value) {
    return value == null ? empty() : of(value);
}
public static<T> Optional<T> empty() {
    @SuppressWarnings("unchecked")
    Optional<T> t = (Optional<T>) EMPTY;
    return t;
}
```

**静态方法 .empty()** 直接返回一个封装null的Optional对象, 这个对象是Optional类内部的一个静态属性。



###### 使用Optional对象

- get() 方法 返回封装的值， 如果为null则还是会抛出则抛NoSuchElementException异常 *不推荐*

- orElse()函数   如果封装值为null直接返回 我们传入的值。

- orElseGet() 接收一个函数式接口参数，定义一个如果为封装值为null则返回的值

  ```java
  Optional<String> null_str   = Optional.ofNullable(null);
  String s = null_str.orElseGet(new Supplier<String>() {
      @Override
      public String get() {
          return "null_str is null";
      }
  });
  System.out.println(s);  //null_str is null
  ```

- orElseThrow()  参数是一个函数式接口Supplier\<Throwabe\>。 当封装的值为null时 ，可以让其抛出我们自定义的异常类。

- isPresent() 封装的值为null则返回false ，否则返回true

- filter()    过滤筛选函数 参数是一个函数式接口 如果满足匹配条件则返回原对象， 不满足则返回一个封装了null的Optional对象

- map() 数据转化函数 ==但是如果原Optional对象封装的值是null，那么返回的对象也是封装null==

  ```java
      Optional<String> null_str   = Optional.ofNullable("1");
      Optional<Integer> integer = null_str.map(new Function<String, Integer>() {
          @Override
          public Integer apply(String s) {
              return Integer.parseInt(s);
          }
      });
      System.out.println(integer.get());
  }
  ```

- faltMap

### JDK8新增时间

[[java高级#Java中的日期处理 以jdk8更新的为主]]