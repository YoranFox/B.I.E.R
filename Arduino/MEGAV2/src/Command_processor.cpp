//
// Created by jasper-jan on 06-02-22.
//


#include "Command_processor.h"
#include <Arduino.h>

CommandProcessor::CommandProcessor() {
    //nothing
}

void CommandProcessor::distribute_received_command(char *data, int length) {
    if (data[0] == COMMAND_SET_NEW_SPEED){
        //isolate the speed from the received command
        int16_t speed = data[1] << 8 | data[2];
        new_motor_speed(speed);
    }
    else{
        Serial.println("no valid command received");
    }
}

void CommandProcessor::new_motor_speed(int16_t speed){
    Serial.println(speed);
}
