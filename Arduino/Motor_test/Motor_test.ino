#include "Motor_controll.h"
#include <stdio.h>
#include <Arduino.h>

int HARDFAULT = 0;

//front left
const int MOTOR1PIN1 = 2;
const int MOTOR1PIN2 = 3;
const int MOTOR1SPEEDPIN = 10;

//front right motor
const int MOTOR2PIN1 = 4;
const int MOTOR2PIN2 = 5;
const int MOTOR2SPEEDPIN = 11;

//rear left motor
const int MOTOR3PIN1 = 6;
const int MOTOR3PIN2 = 7; 
const int MOTOR3SPEEDPIN = 12;

//rear right motor
const int MOTOR4PIN1 = 8;
const int MOTOR4PIN2 = 9; 
const int MOTOR4SPEEDPIN = 13;

robot r = {0.06, 0.25, 0.15, //radius, hor_dist, vert_dist, 
            0, 0, 100, // robot speed, robot angle
            {1, MOTOR1PIN1, MOTOR1PIN2, MOTOR1SPEEDPIN, 0, Stop},//m1
            {2, MOTOR2PIN1, MOTOR2PIN2, MOTOR2SPEEDPIN, 0, Stop},//m2
            {3, MOTOR3PIN1, MOTOR3PIN2, MOTOR3SPEEDPIN, 0, Stop},//m3
            {4, MOTOR4PIN1, MOTOR4PIN2, MOTOR4SPEEDPIN, 0, Stop}//m4
            };

robot *rp = &r;

void setup() {
  // put your setup code here, to run once:
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

//begin serial comms
  Serial.begin(9600);

}

void loop() {
int speed = 50;
int degree = 45;

Inverse_kinematics(speed, degree, r);
delay(10000);
}
