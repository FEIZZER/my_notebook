### 洛谷P1141

[题目链接](https://www.luogu.com.cn/problem/P1141)  

完成代码

可以用连通图来解决，连通图dfs剪枝

```
#include <iostream>
using namespace std;
int n;
char s[1009][1009];
int vis[1009][1009]={0};
int dir[4][2]={1,0,-1,0,0,1,0,-1};
int map_index=1;
int map_div[1009][1009]={0};
int an=0;
int ans[1000009];
void DFS(int s_i,int s_j)
{
    map_div[s_i][s_j]=map_index;
    vis[s_i][s_j]=1;
    an++;
    for(int i=0;i<4;i++)
    {
        int n_i=s_i+dir[i][0];
        int n_j=s_j+dir[i][1];
        if(n_i>0&&n_j>0&&n_i<=n&&n_j<=n&&!vis[n_i][n_j])
        if(s[s_i][s_j]!=s[n_i][n_j])
        DFS(n_i,n_j);
    }


}
int main()
{
    cin>>n;
    int m;cin>>m;
    for(int i=1;i<=n;i++)
    for(int j=1;j<=n;j++)
    cin>>s[i][j];
    int s_i,s_j;
    for(int i=0;i<m;i++)
    {
        an=0;
        cin>>s_i>>s_j;
        if(map_div[s_i][s_j]==0)
        {
            DFS(s_i,s_j);
            ans[map_index]=an;
            cout<<an<<endl;
        }
        else
        {
            cout<<ans[map_div[s_i][s_j]]<<endl;
        }
        map_index++;
    }
    system("pause");

}
```

