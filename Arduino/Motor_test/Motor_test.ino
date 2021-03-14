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


  Serial.begin(9600);
}

void loop() {
  Serial.println("running loop");
  // put your main code here, to run repeatedly:   

  //Controlling speed (0 = off and 255 = max speed):
  analogWrite(9, 55); //ENA pin
  analogWrite(10, 55); //ENB pin

  //Controlling spin direction of motors:
  digitalWrite(motor1pin1, HIGH);
  digitalWrite(motor1pin2, LOW);

  digitalWrite(motor2pin1, HIGH);
  digitalWrite(motor2pin2, LOW);
  delay(10000);

  digitalWrite(motor1pin1, LOW);
  digitalWrite(motor1pin2, HIGH);

  digitalWrite(motor2pin1, LOW);
  digitalWrite(motor2pin2, HIGH);
  delay(10000);
}
