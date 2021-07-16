#include <Arduino.h>
#include "Magneto_HMC5883.h"
#include "robot.h"

const int ledPin =  LED_BUILTIN;// the number of the LED pin
int ledState = LOW;             // ledState used to set the LED

bool check_tick_timing(unsigned long interval) {
    static unsigned long previousMillis = 0;
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
        // save the last time you blinked the LED
        previousMillis = currentMillis;
        // if the LED is off turn it on and vice-versa:
        if (ledState == LOW) {
            ledState = HIGH;
        } else {
            ledState = LOW;
        }

        // set the LED with the ledState of the variable:
        digitalWrite(ledPin, ledState);
        return true;
    }
    return false;
}

void setup(void)
{
    //build in led
    pinMode(ledPin, OUTPUT);
    Serial.begin(115200);
    Magneto_HMC5883_init();
    robot_init();

}

void loop(void)
{
    bool run_tick = check_tick_timing(200);
    if (run_tick) {
        Magneto_HMC5883_tick();
    }
}
