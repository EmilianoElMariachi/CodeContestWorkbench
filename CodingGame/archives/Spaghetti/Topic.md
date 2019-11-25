## Goal
You are served some spaghettis, that comes from a single giant one cut in parts.

You want to reconstitute this original spaghetti.

It always starts with the character 'A' and ends with the character 'Z'.

Two parts can be matched when the last character of the first part corresponds to the first character of the second part.

Warning : when writing the giant spaghetti, the extremity characters used to match the parts must be written only once.

## Input
Line 1 : number of spaghetti N.
Following lines : String. spaghetti_part. Each part has at least 2 characters.

## Output
One single string, representing the_complete_spaghetti
Contraintes
N >= 1
You may have a unique part like : "A------Z".

No ambiguity in the parts :
- only one starting extremity 'A',
- only one ending extremity 'Z',
- the other extremity characters appear only once as a start, and once as an end.

## Example
### Input
4

A------X\
\*-+-+-+-+-+-+-#\
X====\*\
\#_____Z

### Output
A------X====*-+-+-+-+-+-+-#_____Z

## SOLUTIONS IN PYTHON
### SOL.1
```python
S={}
n=int(input())
for i in range(n):a=input();S[a[0]]=a
i,s,o=0,'A',""
while i<n:p=S[s];o+=p[:-1];s=p[-1];i+=1
print(o+s)
```

### SOL.2
```python
n=int(input())
b=[]
for i in range(n):
    s=input()
    if 'A' in s:
        a=s
        b.append(s)
for i in b:
    for i in b:
        if i[0]==a[-1]:
            a+=i[1:]
print(a)
```

### SOL.3
```python
n=int(input())
a=[]
s=''
for i in range(n):a.append(input())
for i in a:
    if (i[0]=='A'):
        s=i
while (s[-1]!='Z'):
    for i in a:
        if (s[-1]==i[0]):s+=i[1:]
print(s)
```