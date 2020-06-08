#include <graphics.h>
#include <conio.h>
#include <dos.h>
#include <stdlib.h>

void main() {
	//initilizing graphic driver and 
	//graphic mode variable
	int graphicdriver=DETECT,graphicmode;

	//calling initgraph function with 
	//certain parameters
	initgraph(&graphicdriver,&graphicmode,"c:\\turboc3\\bgi");

	//Printing message for user
	outtextxy(10, 10 + 10, "Program to draw a bar chart in C graphics");

	//initilizing lines for x and y axis
	line(100,420,100,60);
	line(100,420,500,420);

	//creating bars with certain filling style

	setfillstyle(LINE_FILL,RED);
	bar(150,200,200,419);

	setfillstyle(LINE_FILL,GREEN);
	bar(225,90,275,419);

	setfillstyle(LINE_FILL,BLUE);
	bar(300,120,350,419);

	setfillstyle(LINE_FILL,YELLOW);
	bar(375,180,425,419);

	getch();
}