x=readline
n=x()
t=n
p=[]
while(t--)p.push(x())
c=r="A"
while(n--)p.forEach(e=>{if(e[0]==c){r+=e.substr(1);c=e.slice(-1)}})
print(r)