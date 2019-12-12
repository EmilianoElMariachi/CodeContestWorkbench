## Goal
You have been designated as responsible to count the number of people getting off at the bus terminus.

You are given the number of stops in the bus line N, the number of people entering inside the bus at the Xth stop S and for how many stops a specific person stayed inside the bus respectively given.

The terminus is located after the last given station (N+1).
Also, note that the time duration for each person given can be greater than the remaining amount of stops, which would mean that person will stay until the end of the ride.

We consider that the bus has an unlimited capacity.
Nobody enters in the bus at the terminus stop and everybody gets off at the bus terminal.

## Input
Line 1: An integer N for the number of stops of the bus line  
Line 2: A space-separated list S consisting of N integers describing how many people enter the bus at the Xth stop  
Line 3: A list of space-separated integers telling how many stops each person will stay in the bus

## Output
The number of people getting off at the terminus.

## Constraints
N > 0  
S ≥ 0  
Total people > 0  
0 < Time duration for each person ≤ N

## Example
### Input
3  
1 2 2  
1 2 1 1 3  

### Output
3