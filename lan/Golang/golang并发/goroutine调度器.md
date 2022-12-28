[思否文章](https://segmentfault.com/a/1190000041938854?utm_source=sf-similar-article)

[知乎文章](https://zhuanlan.zhihu.com/p/111370792)

调度是操作系统的核心功能了，从计算机诞生以来，任务的调度就一直在不断改进与发展，以不断适应计算机的发展. 单任务、多任务、并发、并行等调度. 到如今云计算时代分布式调度也十分成熟

### Golang调度器原理 GMP模型

- **G**： Goroutine协程。 拥有运行函数的指针、栈、上下文（指的是sp、bp、pc等寄存器上下文以及垃圾回收的标记上下文），在整个程序运行过程中可以有无数个，代表一个用户级代码执行流（用户轻量级线程）；

  **关于协程G， 又可以分为三类：**

  - 主协程用来执行用户main函数的协程
  - 主协程创建的协程， 也是P主要调度的协程
  - **G0协程** 每个M都有一个G0协程， 他是runtime的一部分。 G0是跟M绑定的，主要用来执行调度逻辑的代码，所以不能被抢占也不会被调度（普通G也可以执行runtime_procPin禁止抢占），G0的栈是系统分配的，比普通的G栈（2KB）要大，不能扩容也不能缩容。
  - **sysmon协程** 也是runtime的一部分， sysmon直接运行在M不需要P， 主要做一些检查工作比如：检查死锁， 检查计时器获取下一个要被触发的计时任务， 检查是否有ready的网络调用以恢复用户G的工作、检查一个G是否运行时间太长进行抢占式调度。



- **P** :  Processor，调度逻辑处理器，同样也是Go中代表资源的分配主体（内存资源、协程队列等），默认为机器核数，可以通过GOMAXPROCS环境变量调整。

  Processer维护的G队列， 也可以叫做 **本地队列（Local Run Queue）**， 未分配给P的G则保存在**全局队列（Global Run Queue）**。 



- **M** ：Machine，代表实际工作的执行者，对应到操作系统级别的线程；M的数量会比P多，但不会太多，最大为1w个。

  **关于M的分类：**

  - 普通M，用来与P绑定执行G中任务
  - m0：Go程序是一个进程，进程都有一个主线程，m0就是Go程序的主线程，通过一个与其绑定的G0来执行runtime启动加载代码；一个Go程序只有一个m0
  - 运行sysmon的M，主要用来运行sysmon协程。





##### P是如何调度G的

每个P都有一个自己的G的队列， 当G的队列执行完毕后，  会从Global队列中获取一批G放到自己的队列中。 如果全局队列也没有， 会从其他P中窃取一部分G放到自己的队列中。 调度的机制有以下三种：

- 主动调度。 代码调用`runtime.Gosched()`  主动让渡自己执行的权力， 此时这个协程会放到全局队列中， 等待下一次执行
- 被动调度。 协程在休眠， channel阻塞， 网络IO阻塞， 执行垃圾回收的时候被暂时暂停，会被动的让渡自己执行的权力。 大部分场景都是被动调度。
- 抢占式调度。 这个主要是sysmon协程上的调度，当发现G处于系统调用（如调用网络io）超过20微秒或者G运行时间过长（超过10ms），会抢占G的执行CPU资源，让渡给其他协程；防止其他协程没有执行的机会；（系统调用会进入内核态，由内核线程完成，可以把当前CPU资源让渡给其他用户协程）

<img src="goroutine调度器.assets/未命名文件 (14).png" alt="未命名文件 (14)" style="zoom:50%;" /> 

 





### GMP源码部分

GMP的源码可以从一下三个文件入手：

- **runtime/amd_64.s**        涉及到进程启动以及对CPU执行指令进行控制的汇编代码，进程的初始化部分也在这里面
- **runtime/runtime2.go**  这里主要是运行时中一些重要数据结构的定义，比如g、m、p以及涉及到接口、defer、panic、map、slice等核心类型
- **runtime/proc.go**            一些核心方法的实现，涉及gmp调度等核心代码在这里

#### G的源码实现分析

g  m p的源码均在 `/runtime/runtime2.go`文件中

##### G的源码结构

```go
type g struct {
	// Stack parameters.
	// stack describes the actual stack memory: [stack.lo, stack.hi).
	// stackguard0 is the stack pointer compared in the Go stack growth prologue.
	// It is stack.lo+StackGuard normally, but can be StackPreempt to trigger a preemption.
	// stackguard1 is the stack pointer compared in the C stack growth prologue.
	// It is stack.lo+StackGuard on g0 and gsignal stacks.
	// It is ~0 on other goroutine stacks, to trigger a call to morestackc (and crash).
	stack       stack   // offset known to runtime/cgo
	stackguard0 uintptr // offset known to liblink
	stackguard1 uintptr // offset known to liblink

	_panic         *_panic // innermost panic - offset known to liblink
	_defer         *_defer // innermost defer
	m              *m      // current m; offset known to arm liblink
	sched          gobuf
	syscallsp      uintptr        // if status==Gsyscall, syscallsp = sched.sp to use during gc
	syscallpc      uintptr        // if status==Gsyscall, syscallpc = sched.pc to use during gc
	stktopsp       uintptr        // expected sp at top of stack, to check in traceback
	param          unsafe.Pointer // passed parameter on wakeup
	atomicstatus   uint32
	stackLock      uint32 // sigprof/scang lock; TODO: fold in to atomicstatus
	goid           int64
	schedlink      guintptr
	waitsince      int64      // approx time when the g become blocked
	waitreason     waitReason // if status==Gwaiting
	preempt        bool       // preemption signal, duplicates stackguard0 = stackpreempt
	paniconfault   bool       // panic (instead of crash) on unexpected fault address
	preemptscan    bool       // preempted g does scan for gc
	gcscandone     bool       // g has scanned stack; protected by _Gscan bit in status
	gcscanvalid    bool       // false at start of gc cycle, true if G has not run since last scan; TODO: remove?
	throwsplit     bool       // must not split stack
	raceignore     int8       // ignore race detection events
	sysblocktraced bool       // StartTrace has emitted EvGoInSyscall about this goroutine
	sysexitticks   int64      // cputicks when syscall has returned (for tracing)
	traceseq       uint64     // trace event sequencer
	tracelastp     puintptr   // last P emitted an event for this goroutine
	lockedm        muintptr
	sig            uint32
	writebuf       []byte
	sigcode0       uintptr
	sigcode1       uintptr
	sigpc          uintptr
	gopc           uintptr         // pc of go statement that created this goroutine
	ancestors      *[]ancestorInfo // ancestor information goroutine(s) that created this goroutine (only used if debug.tracebackancestors)
	startpc        uintptr         // pc of goroutine function
	racectx        uintptr
	waiting        *sudog         // sudog structures this g is waiting on (that have a valid elem ptr); in lock order
	cgoCtxt        []uintptr      // cgo traceback context
	labels         unsafe.Pointer // profiler labels
	timer          *timer         // cached timer for time.Sleep
	selectDone     uint32         // are we participating in a select and did someone win the race?

	// Per-G GC state

	// gcAssistBytes is this G's GC assist credit in terms of
	// bytes allocated. If this is positive, then the G has credit
	// to allocate gcAssistBytes bytes without assisting. If this
	// is negative, then the G must correct this by performing
	// scan work. We track this in bytes to make it fast to update
	// and check for debt in the malloc hot path. The assist ratio
	// determines how this corresponds to scan work debt.
	gcAssistBytes int64
}
```

这个结构体中比较重要几个字段：

- **stack**   是协程栈的地址信息，需要注意的是m0绑定的g0是在进程被分配的系统栈上分配协程栈的，而其他协程栈都是在堆上进行分配的。
- **gobuf**  保存了协程执行的上下文信息，这里也可以看到协程切换的上下文信息极少；sp代表cpu的rsp寄存器的值，pc代表CPU的rip寄存器值、bp代表CPU的rbp寄存器值；ret用来保存系统调用的返回值，ctxt在gc的时候使用。 关于gobuf结构体的理解。

