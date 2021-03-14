#include <stdio.h>
#include "Motor_test.ino"
#include <Arduino.h>


enum direction{Reverse, Forward,Stop};

typedef struct motors{
    int id;
    int pin_1; 
    int pin_2;
    int pin_speed;
    int speed = 0;
    direction direction = Stop;
}motor;

typedef struct robots{
    float wheel_radius;
    float wheel_hor_dist;
    float wheel_vert_dist;

    int r_speed;
    int r_angle;
}robot;

void Inverse_kinematics(int v, int degree, robot r){

    //source : https://www.researchgate.net/publication/308570348_Inverse_kinematic_implementation_of_four-wheels_mecanum_drive_mobile_robot_using_stepper_motors
    int transform_matrix[4][3] = { 
    {1,-1,-1*(r.wheel_hor_dist+r.wheel_vert_dist)},
    {1, 1, 1*(r.wheel_hor_dist+r.wheel_vert_dist)},
    {1, 1,-1*(r.wheel_hor_dist+r.wheel_vert_dist)},
    {1,-1, 1*(r.wheel_hor_dist+r.wheel_vert_dist)}
    }

    float radian = degree x (M_PI / 180.0); //is py defined?
    float vx = v * cos(radian); //x speed
    float vy = v * sin(radian); //y speed

    //not yet finished.....

}

void get_motor_info(motor m, int return_array[]){
        return_array[0] =  m.pin_1;
        return_array[1] =  m.pin_2;
        return_array[2] =  m.pin_speed;
    }

void set_motor_speed(motor m, int new_speed){
    if ((new_speed < 0)||(new_speed>255)){
        Serial.println("Error! set speed to value in between 0 and 255");
        analogWrite(m.pin_speed, 0); //ENA pin 
        HARDFAULT = 1; 
    }
    m.speed = new_speed; //set speed
    analogWrite(m.pin_speed, new_speed); //ENA pin
}
void set_motor_direction(motor m, int new_direction){
    m.speed = new_direction; //set speed
    if (m.direction == Reverse){ //miss andersom
        //serial.println(Motor %d set to Reverse)
        digitalWrite(m.pin_1, HIGH);
        digitalWrite(m.pin_2, LOW);
    }else if (m.direction == Forward){
        //serial.println(Motor %d set to Forward)
        digitalWrite(m.pin_1, LOW);
        digitalWrite(m.pin_2, HIGH);
    }else if (m.direction == Stop){
        //serial.println(Motor %d set to Stop)
        digitalWrite(m.pin_1, LOW);
        digitalWrite(m.pin_2, LOW);
    }else{
        Serial.println("ERROR direction set to unknown value");
        HARDFAULT = 1;
    }
}