### GPG加密 签名

**GPG**, 或 **GnuPG** (GNU Privacy Guard) 是一个遵照 OpenPGP 协议的用于加密、数字签名以及认证的软件。它与 PGP (Pretty Good Privacy) 的区别是它是开源的，而 PGP 则是 Symantec 公司的专有软件。

在数字世界，我们经常需要进行邮件加密、数字签名或者登陆认证等操作，GPG 就是这样一个既可以方便我们管理公私钥，又可以随时满足我们需求的密钥管理工具。

如果你使用 Linux 发行版，gpg 工具是自带的 (/usr/bin/gpg)，你可以执行 gpg -h 来查看帮助信息。本文介绍如何使用 GPG 来构建我们的签名、加密以及认证系统。

#### GPG使用场景



