N= +(readline());
l=[]
t=N
print("#".repeat(N))
while(t--){
l.push(" ".repeat(N-t-1)+"#".repeat(t*2+1))
}
l.slice().reverse().concat(l).forEach(e=>print(e))