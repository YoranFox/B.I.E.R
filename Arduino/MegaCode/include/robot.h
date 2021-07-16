//
// Created by jasper-jan on 15-07-21.
//

#ifndef MEGACODE_ROBOT_H
#define MEGACODE_ROBOT_H
#include "pin_def.h"

typedef enum {Reverse, Forward, Stop} direction;

typedef struct motors{
    int id;
    int pin_1;
    int pin_2;
    int pin_speed;
    int speed;
    direction direc;
}motor;

typedef struct robots{
    float wheel_radius;
    float wheel_hor_dist;
    float wheel_vert_dist;

    int r_speed;
    int r_angle;

    int MAX_SPEED; //maximum pwm speed
    motor* m1;
    motor* m2;
    motor* m3;
    motor* m4;
}robot;

extern motor m1;
extern motor m2;
extern motor m3;
extern motor m4;
extern robot r;


void robot_init();
void robot_tick();

#endif //MEGACODE_ROBOT_H
