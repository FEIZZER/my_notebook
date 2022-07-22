### time包的基础使用

```go
func timeDemo() {
    now := time.Now() //获取当前时间
    fmt.Printf("current time:%v\n", now)

    year := now.Year()     //年
    month := now.Month()   //月
    day := now.Day()       //日
    hour := now.Hour()     //小时
    minute := now.Minute() //分钟
    second := now.Second() //秒
    fmt.Printf("%d-%02d-%02d %02d:%02d:%02d\n", year, month, day, hour, minute, second)

    timestamp1 := now.Unix()     //时间戳
    timestamp2 := now.UnixNano() //纳秒时间戳
    fmt.Printf("current timestamp1:%v\n", timestamp1)
    fmt.Printf("current timestamp2:%v\n", timestamp2)   
    
    timeObj := time.Unix(timestamp1, 0)//时间戳转换成时间对象，再通过类似以上当前时间转换成时间格式

}
```



### time的时区处理

- 在time.now()创建时间的时候，会自动获取当前系统的时区，进行指定

- 在time.parse() 将字符串转为时间对象时，默认时UTC时间

  ```go
  now := time.Now()
  t, _ := time.Parse("2006-01-02 15:04:05", now.Format("2006-01-02 15:04:05"))
  fmt.Println(now)
  fmt.Println(t)
  ```

  ![image-20220722172732899](C:\Users\yongjianwu\Desktop\NOTEBOOK\my_notebook\lan\Golang\Go的一些标准包\time时间处理.assets\image-20220722172732899.png) 

- 可以使用time.ParseInLocation()指定时区信息

  ```go
  tt, _ := time.ParseInLocation("2006-01-02 15:04:05", now.Format("2006-01-02 15:04:05"), time.Local)
  ```

  