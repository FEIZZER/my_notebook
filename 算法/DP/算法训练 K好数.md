# 算法训练 K好数

[题目链接][1]

[1]:http://lx.lanqiao.cn/problem.page?gpid=T13

思路把每个数字出现的次数记录下来。

代码未经整理

```
#include<iostream>
#include <cstring >
using namespace std;
int dp[100][100];
int d[100];
int dnext[100];
int main()
{
	int k,l;cin>>k>>l;
	d[0]=0;
	
	for(int i=1;i<k;i++)
	d[i]=1;
	for(int i=2;i<=l;i++)
	{
		memset(dnext,0,sizeof(dnext));
		for(int j=0;j<k;j++)
		{
			for(int p=0;p<k;p++)
			{
				if(p==j-1|p==j+1)continue;
				dnext[p]+=d[j];
				dnext[p]=dnext[p]%1000000007;
			}

			
		}
		for(int j=0;j<k;j++)
		{
			d[j]=dnext[j];

	    }
	}
	int ans=0;
	for(int i=0;i<k;i++)
	{
	ans+=d[i];
	ans=ans%1000000007;
    }
	cout<<ans;
	
}
```

