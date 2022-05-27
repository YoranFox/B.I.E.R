//
// Created by jasper-jan on 06-02-22.
//

#ifndef MEGAV2_COMMAND_PROCESSOR_H
#define MEGAV2_COMMAND_PROCESSOR_H
#include "stdio.h"

//List of all commands and their IDs
#define COMMAND_SET_NEW_SPEED 0x01  //id,int16_t
#define COMMAND_SET_NEW_ANGLE 0x02  // 


class CommandProcessor {
public:
    CommandProcessor();

    /**
    * Distribute the received command form the RX
    * @param data
    * @param length
    */
    void distribute_received_command(char *data, int length);

    /*
     * Quick brainstorm what kind of commands the robot can receive
     *  new_rotation_heading
     *  new_driving_heading
     *  new_motor_speed
     *  force_stop_motor
     */
private:
    /**
     * processes the command for the new motor speed
     * @param new_speed
     */
    void new_motor_speed(int16_t new_speed);

};

#endif //MEGAV2_COMMAND_PROCESSOR_H
