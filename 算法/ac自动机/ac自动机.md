# ac自动机

ac自动机时trie树的优化版，其实就是一种多模匹配算法，给你很多个单词，然后给你一段字符串，问你有多少个单词在这个字符串中出现过

###### 原理

在trie树的基础上，增加一个fail指针，用于 当str匹配失败时，避免从头回溯的作用。

