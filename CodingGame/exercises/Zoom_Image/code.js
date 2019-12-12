l=readline
f=parseInt(l())
d=l()
for(i=0;i<d;i++){
    p=[]
    r=l()
    for(j=0;j<d;j++){
        c=new Array(f).fill(r.split(' ')[j])
        p=p.concat(c)
    }
    for(k=0;k<f;k++)
        console.log(p.join(" "))
}