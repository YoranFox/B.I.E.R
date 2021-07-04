#include <stdio.h>
//#include "Motor_test.ino"
//#include "Motor_controll.h"
#include <Arduino.h>


//source : https://www.researchgate.net/publication/308570348_Inverse_kinematic_implementation_of_four-wheels_mecanum_drive_mobile_robot_using_stepper_motors
int transform_matrix[4][3] = { 
    {1,-1,(int) (-1*(r.wheel_hor_dist+r.wheel_vert_dist))},
    {1, 1,(int)  (1*(r.wheel_hor_dist+r.wheel_vert_dist))},
    {1, 1,(int) (-1*(r.wheel_hor_dist+r.wheel_vert_dist))},
    {1,-1,(int)  (1*(r.wheel_hor_dist+r.wheel_vert_dist))}
};
//int input_vector[3][1];
//int output_vector [4][1];


void Inverse_kinematics(int v, int deg, robot r){
    //Pre checks
    if (v > r.MAX_SPEED){
        v = r.MAX_SPEED;
        Serial.println("Oi we are trying to move faster than the set limit in the kinetic model");
    }else if(v < 0 ){
        v = 0;
        Serial.println("Negative speeds not possible: speed has been set to 0");
    }
    //input parameters to correct unit
    float rad = deg*(M_PI / 180.0); //is py defined?
    float vx = v * cos(rad); //x speed
    float vy = v * sin(rad); //y speed

    Serial.println("Calculated rad angle, X and Y velocities: ");
    Serial.println(rad);
    Serial.println(vx);
    Serial.println(vy);
    //set input vector valyes
    input_vector[0][0] = (int)vx;
    input_vector[1][0] = (int)vy;
    input_vector[2][0] = 0;
    //matrixt multiplication
    output_vector [0][0] = transform_matrix[0][0]*input_vector[0][0] + transform_matrix[0][1]*input_vector[1][0]+ transform_matrix[0][2]*input_vector[2][0];
    output_vector [1][0] = transform_matrix[1][0]*input_vector[0][0] + transform_matrix[1][1]*input_vector[1][0]+ transform_matrix[1][2]*input_vector[2][0];
    output_vector [2][0] = transform_matrix[2][0]*input_vector[0][0] + transform_matrix[2][1]*input_vector[1][0]+ transform_matrix[2][2]*input_vector[2][0];
    output_vector [3][0] = transform_matrix[3][0]*input_vector[0][0] + transform_matrix[3][1]*input_vector[1][0]+ transform_matrix[3][2]*input_vector[2][0];
    
    Serial.println("Display the output vector");
    Serial.println(output_vector[0][0]);
    Serial.println(output_vector[1][0]);
    Serial.println(output_vector[2][0]);
    Serial.println(output_vector[3][0]);
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
        HARDFAULT = 1;
    }
}
