# trie树/字典树/前缀树

trie树是哈希树的一种，用于单词查找，文本词频统计，利用空间来换时间

###### 效率

插入查询的效率是$O(n)$ n是字符串的长度

###### 原理

1. 根节点不包含字符，根节点外的子节点都含有一个字符
2. 从根节点到某一个节点，路途经过的字节即为该节点的字符串
3. 每个节点的子节点包含字符不一样



代码

```
#include <iostream>
#include <cstring>
using namespace std;
#define KIND 26
typedef struct Ttt_node {   //trie_tree_node
    char a;
    bool end;
    Ttt_node *next[KIND];
    Ttt_node()
    {
        end = false;
        memset(next,NULL,sizeof(next));
    }
}*Ttt_tree;

void INSERT(string str,Ttt_tree T) {
    int i=0;
    Ttt_tree p = T;
    while (str[i])
    {
        int index = str[i]-'a';
        if(!p->next[index]) {
            p->next[index] = new Ttt_node();
            p->next[index]->a = str[i];
        }
        p = p->next[index];
        i++;
    }
    p->end = true; 
}

bool SEARCH(string str, Ttt_tree T) {
    int len = str.length();
    int i=0;
    Ttt_tree p = T;
    while(i<len) {
        int index = str[i]-'a';
        if(!p->next[index]) {
            return false;
        }
        i++;
        p = p->next[index];
    }
    if(p->end == true){
        return true;
    }
    else{
        return false;
    }
}
```

