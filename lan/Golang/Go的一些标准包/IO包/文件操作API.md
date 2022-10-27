### 文件操作API

##### 打开创建文件

- `func OpenFile(name string, flag int, perm FileMode) (*File, error)`  打开一个文件。 

  - 定义在os包中。 是一个广义的打开调用。以指定的权限和方式打开一个文件

  - **falg int**参数       指定文件操作的权限 。示例 `OpenFile(name, O_RDWR|O_CREATE|O_TRUNC, 0666)` 

    - ```go
      const (
      	// Exactly one of O_RDONLY, O_WRONLY, or O_RDWR must be specified.
      	O_RDONLY int = syscall.O_RDONLY // open the file read-only.
      	O_WRONLY int = syscall.O_WRONLY // open the file write-only.
      	O_RDWR   int = syscall.O_RDWR   // open the file read-write.
      	// The remaining values may be or'ed in to control behavior.
      	O_APPEND int = syscall.O_APPEND // append data to the file when writing.
      	O_CREATE int = syscall.O_CREAT  // create a new file if none exists.
      	O_EXCL   int = syscall.O_EXCL   // used with O_CREATE, file must not exist.
      	O_SYNC   int = syscall.O_SYNC   // open for synchronous I/O.
      	O_TRUNC  int = syscall.O_TRUNC  // truncate regular writable file when opened.打开文件同时截断，需要写权限
      )
      ```

  - **perm FileMode**参数     指定文件打开的umask。==不太明白下面常量为什么这样设置==

    - ```go
      const (
      	// The single letters are the abbreviations
      	// used by the String method's formatting.
      	ModeDir        FileMode = 1 << (32 - 1 - iota) // d: is a directory
      	ModeAppend                                     // a: append-only
      	ModeExclusive                                  // l: exclusive use
      	ModeTemporary                                  // T: temporary file; Plan 9 only
      	ModeSymlink                                    // L: symbolic link
      	ModeDevice                                     // D: device file
      	ModeNamedPipe                                  // p: named pipe (FIFO)
      	ModeSocket                                     // S: Unix domain socket
      	ModeSetuid                                     // u: setuid
      	ModeSetgid                                     // g: setgid
      	ModeCharDevice                                 // c: Unix character device, when ModeDevice is set
      	ModeSticky                                     // t: sticky
      	ModeIrregular                                  // ?: non-regular file; nothing else is known about this file
      
      	// Mask for the type bits. For regular files, none will be set.
      	ModeType = ModeDir | ModeSymlink | ModeNamedPipe | ModeSocket | ModeDevice | ModeCharDevice | ModeIrregular
      
      	ModePerm FileMode = 0777 // Unix permission bits
      )
      ```

  - 如果发生错误返回的错误类型是 *PathError

- `func Open(name string) (*File, error)`       内部还是调用了os.OpenFile()

- `func Create(name string) (*File, error)`   创建文件
  - 定义在os包中， 该函数创建或截断一个文件（如果文件已经存在，则重新创建 意味着文件的内容被覆盖为空白）。
  - 函数内部使用了os.OpenFile()函数。如果文件不存在使用模式0666创建，返回的文件描述符为 O_RDWR
  - 如果发生了错误 函数返回的错误类型是*PathError
- `func NewFile(fd uintptr, name string) *File`

##### 写文件

- `func (file *File) Write(b []byte) (n int, err Error)`
  - 写入byte类型的信息到文件
- `func (file *File) WriteAt(b []byte, off int64) (n int, err Error)`
  - 在指定位置开始写入byte类型的信息。
- `func (file *File) WriteString(s string) (ret int, err Error)`
  - 写入string信息到文件中。  

##### 读文件

- `func (file *File) Read(b []byte) (n int, err Error)`
  - 读取数据到b中
- `func (file *File) ReadAt(b []byte, off int64) (n int, err Error)`
  - 从off开始读取数据到b中
- `func Remove(name string) Error`
  - 删除文件名为name的文件