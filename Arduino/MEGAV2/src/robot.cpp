//
// Created by jasper-jan on 15-07-21.
//

#include "robot.h"
#include <stdio.h>
#include <Arduino.h>
#include "timer_implementations.h"

bool request_new_kinematics;
uint16_t kinematics_timeout_counter;

//initialising motors
motor m1 = {1, MOTOR1PIN1, MOTOR1PIN2, MOTOR1SPEEDPIN, 0, Stop};
motor m2 = {2, MOTOR2PIN1, MOTOR2PIN2, MOTOR2SPEEDPIN, 0, Stop};
motor m3 = {3, MOTOR3PIN1, MOTOR3PIN2, MOTOR3SPEEDPIN, 0, Stop};
motor m4 = {4, MOTOR4PIN1, MOTOR4PIN2, MOTOR4SPEEDPIN, 0, Stop};
//initalising robot
robot r = {0.06, 0.25, 0.15,
           60, 45, 100, &m1,&m2,&m3,&m4};
robot a = {1,1,1,1,1,2,};

void get_motor_info(motor *m){
    Serial.print("Initialisation of motor: "); Serial.print(m->id); Serial.print("\n");
    Serial.println("Write motor info here...");

}

/**
 * Sets the request flag for new magnetometer data. Throws a timeout warning if no new data is recieved.
 * Note disable flag after data is recieved.
 */
void increment_kinematics_timeout(){
    if (!request_new_kinematics) {
        request_new_kinematics = timer_reset_upper_limit(1, 10, &kinematics_timeout_counter);
    }else{
        timer_reset_upper_limit(1, 10, &kinematics_timeout_counter);
    }
}

void robot_init(){
    //tick_timeouts
    request_new_kinematics = false;
    kinematics_timeout_counter = 0;

    //pin define
    pinMode(MOTOR1PIN1, OUTPUT);
    pinMode(MOTOR1PIN2, OUTPUT);
    pinMode(MOTOR1SPEEDPIN, OUTPUT);
    pinMode(MOTOR2PIN1, OUTPUT);
    pinMode(MOTOR2PIN2, OUTPUT);
    pinMode(MOTOR1SPEEDPIN, OUTPUT);
    pinMode(MOTOR3PIN1, OUTPUT);
    pinMode(MOTOR3PIN2, OUTPUT);
    pinMode(MOTOR3SPEEDPIN, OUTPUT);
    pinMode(MOTOR4PIN1, OUTPUT);
    pinMode(MOTOR4PIN2, OUTPUT);
    pinMode(MOTOR4SPEEDPIN, OUTPUT);

    //motor init.
    get_motor_info(&m1);
    get_motor_info(&m2);
    get_motor_info(&m3);
    get_motor_info(&m4);
}

//source : https://www.researchgate.net/publication/308570348_Inverse_kinematic_implementation_of_four-wheels_mecanum_drive_mobile_robot_using_stepper_motors
float transform_matrix[4][3] = {
        {1.0,-1.0, (-1*(r.wheel_hor_dist+r.wheel_vert_dist))},
        {1.0, 1.0, (1*(r.wheel_hor_dist+r.wheel_vert_dist))},
        {1.0, 1.0, (-1*(r.wheel_hor_dist+r.wheel_vert_dist))},
        {1.0,-1.0, (1*(r.wheel_hor_dist+r.wheel_vert_dist))}
};

void inverse_kinematics(bool debug, robot* r){
    //Pre checks
    if (r->r_speed > r->MAX_SPEED){
        r->r_speed  = r->MAX_SPEED;
        Serial.println("Oi we are trying to move faster than the set limit in the kinetic model");
    }else if(r->r_speed  < 0 ){
        r->r_speed  = 0;
        Serial.println("Negative speeds not possible: speed has been set to 0");
    }
    //input parameters to correct unit
    float rad = r->r_angle*(M_PI / 180.0); //is py defined?
    float vx = r->r_speed  * cos(rad); //x speed
    float vy = r->r_speed  * sin(rad); //y speed

    if(debug) {
        Serial.println("Calculated rad angle, X and Y velocities: ");
        Serial.println(rad);
        Serial.println(vx);
        Serial.println(vy);
    }
    //set input vector valyes
    float input_vector[3];
    input_vector[0] = vx;
    input_vector[1] = vy;
    input_vector[2] = 0;

    //matrixt multiplication
    r->m1->speed = transform_matrix[0][0]*input_vector[0] + transform_matrix[0][1]*input_vector[1]+ transform_matrix[0][2]*input_vector[2];
    r->m2->speed = transform_matrix[1][0]*input_vector[0] + transform_matrix[1][1]*input_vector[1]+ transform_matrix[1][2]*input_vector[2];
    r->m3->speed = transform_matrix[2][0]*input_vector[0] + transform_matrix[2][1]*input_vector[1]+ transform_matrix[2][2]*input_vector[2];
    r->m4->speed = transform_matrix[3][0]*input_vector[0] + transform_matrix[3][1]*input_vector[1]+ transform_matrix[3][2]*input_vector[2];

    if(debug) {
        Serial.println("Display the output vector");
        Serial.println(r->m1->speed);
        Serial.println(r->m2->speed);
        Serial.println(r->m3->speed);
        Serial.println(r->m4->speed);
    }
}

void set_motor_speed(motor m, int new_speed){
    if ((new_speed < 0)||(new_speed>255)){
        Serial.println("Error! set speed to value in between 0 and 255");
        analogWrite(m.pin_speed, 0); //ENA pin
    }
    m.speed = new_speed; //set speed
    analogWrite(m.pin_speed, new_speed); //ENA pin
}
void set_motor_direction(motor m, int new_direction){
    m.speed = new_direction; //set speed
    if (m.direc == Reverse){ //miss andersom
        //serial.println(Motor %d set to Reverse)
        digitalWrite(m.pin_1, HIGH);
        digitalWrite(m.pin_2, LOW);
    }else if (m.direc == Forward){
        //serial.println(Motor %d set to Forward)
        digitalWrite(m.pin_1, LOW);
        digitalWrite(m.pin_2, HIGH);
    }else if (m.direc == Stop){
        //serial.println(Motor %d set to Stop)
        digitalWrite(m.pin_1, LOW);
        digitalWrite(m.pin_2, LOW);
    }else{
        Serial.println("ERROR direction set to unknown value");
    }
}

void robot_tick(){
    increment_kinematics_timeout();
}

void robot_update() {
    if (request_new_kinematics) {
        inverse_kinematics(1, &r);
        request_new_kinematics = false;
    }
}


