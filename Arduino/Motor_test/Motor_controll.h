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
    motor m1;
    motor m2;
    motor m3;
    motor m4;
}robot;

int input_vector[3][1];
int output_vector [4][1];
