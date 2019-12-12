## Goal
You are given N sets of six coordinates corresponding to the vertices of a triangle in the cartesian plane.

Your goal is to find out if the point (x,y) is contained within the triangle.

If it is, print inside, otherwise print outside.

## Input
Line 1: Two space-separated integers corresponding to the point (x,y).  
Line 2: A number N corresponding to the number of triangles to evaluate.  
Following Lines: Six space-separated integers corresponding to the x and y coordinates of each vertex of the triangle.

## Output
One line per triangle with either inside or outside.

## Constraints
0 < N < 10  
-1000 ≤ x, y ≤ 1000

## Example
### Input
0 0  
2  
-340 495 -153 -910 835 -947  
-175 41 -421 -714 574 -645

### Output
inside  
outside
