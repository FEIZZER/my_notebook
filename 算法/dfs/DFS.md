# 蓝桥 算法训练 Sticks

[题目链接](http://lx.lanqiao.cn/problem.page?gpid=T572)

卡ac时间时将判断语句判断条件写完整更好

```
#include <bits/stdc++.h>
using namespace std;
int n,len,sum,num,stict[65],vis[65];
int cmp(int x,int y)
{
	return x>y;
}
int dfs(int nowlen,int nowget, int index)  //nowlen当前拼接木棍的长度  nowget已经拼接完成的木棍    
                                           //index下次dfs时索引起始位置
{
	if(index>=n)     //索引位置大于木棍数，返回否
	return 0;
	if(nowget==num)  //
	return 1;
	for(int i=index;i<n;i++)            
	{
		if(vis[i]==0)    
		{
		
		if(nowlen+stict[i]==len)                     
		{
			vis[i]=1;                                //木棍已调用
			if(dfs(0,nowget+1,nowget)==1)            //深度搜索
			return 1;
			
			vis[i]=0;                              //此处若是上面深搜不满足直接返回false
			return 0;	                           //因为stick已经提取降序排序，此处应有证明
		}
		else if(nowlen+stict[i]<len)
		{
			vis[i]=1;
			if(dfs(nowlen+stict[i],nowget,i+1)==1) //此时往下寻找更小的木棍
			return 1;
			
			vis[i]=0;
			if(nowlen==0)                             //这里nowlen==0说明这时的stick[i]必会被抛弃，返回false
			return 0;
			
			for ( ;stict[i]==stict[i+1]&&i+1<n;i++);  //nowlen！=0时，这里跳过与stick[i]相同长度的不合适的木棍
		}
	}
	    
	}
	return 0;
}
int main()
{
	while(cin>>n)
	{
		if(n==0)break;
		sum=0;
		memset(vis,0,sizeof(vis));
		for(int i=0;i<n;i++)
		{
		   cin>>stict[i];
		   sum+=stict[i];
	    }
		sort(stict,stict+n,cmp);
		for( len=stict[0];len<=sum ;len++)
		{
			if(sum%len!=0) continue;
			num=sum/len;
			if(dfs(0,0,0)==1)
			  break;
		}
		cout<<len<<endl;
	}
	
} 
```

