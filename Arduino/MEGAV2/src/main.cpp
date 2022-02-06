#include <Arduino.h>
#include <Wire.h>
#include "Magneto_HMC5883.h"
#include "robot.h"
#include "Communication.h"
#include "Command_processor.h"

CommsPortUART uart_obj;
CommandProcessor command_processor;

const int ledPin =  LED_BUILTIN;// the number of the LED pin
uint8_t ledState = 0;             // ledState used to set the LED
uint8_t ledStateCounter = 0;       //internal heartbeat counter


void setup_system_timer5_interrupt() {
    //NOTE the workings of PWM pin 44, 45 and 46 have been comprimised
    cli();//stop interrupts

    //set timer1 interrupt at 100hz
    TCCR5A = 0;// set entire TCCR5A register to 0
    TCCR5B = 0;// same for TCCR5B
    TCNT5 = 0;//initialize counter value to 0;

    //source: https://www.instructables.com/Arduino-Timer-Interrupts/
    //compare match register = [ 16,000,000Hz/ (prescaler * desired interrupt frequency) ] - 1
    //results in: 19999 = [ 16,000,000Hz/ (8 * 100)] - 1
    //note that the prescaler equals 8 and  256 < 19999 < 65,536
    // set timer count for 100hz increments
    OCR5A = 19999;
    // turn on CTC mode
    TCCR5B |= (1 << WGM52);
    // Set CS11 bit for 8 prescaler
    TCCR5B |= (1 << CS51);
    // enable timer compare interrupt
    TIMSK5 |= (1 << OCIE5A);

    sei();//allow interrupts
}

/**
 * Blink every second to indicate the system is alive.
 */
void heart_beat_tick() {
    ledStateCounter++;
    if (ledStateCounter%100 == 0){
        if (!ledState) {
            digitalWrite(LED_BUILTIN, HIGH);
            ledState = 1;
        } else {
            digitalWrite(LED_BUILTIN, LOW);
            ledState = 0;
        }
        ledStateCounter = 0;
    }
}

void system_tick() {
    Magneto_HMC5883_tick();
    robot_tick();
    heart_beat_tick();
    uart_obj.print_rx_state();
    //Serial.println("tick");
}


void system_update(){
    Magneto_HMC5883_update();
    robot_update();
    uart_obj.update();
    //Serial.println("loop");
}

void setup(void) {
    //build in led
    pinMode(ledPin, OUTPUT);
    Serial.begin(115200);

    //sensors and robot initialisation
    Magneto_HMC5883_init();
    robot_init();

    //interrupt routine
    setup_system_timer5_interrupt(); // 100Hz
}

void loop(void){
    system_update();
    //Serial.println("loop");
}

ISR(TIMER5_COMPA_vect){
    system_tick();
}
