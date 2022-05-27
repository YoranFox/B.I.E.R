//
// Created by jasper-jan on 08-11-21.
//

#include "timer_implementations.h"

// TODO: make this an object instead of a single function
/**
 * Timer that increments, when desired value is reached it will return true and reset
 * its internal timer to 0.
 * @param increment_amount counter increment steps.
 * @param time_limit value reset and return true.
 * @param timeout_counter the actual counter.
 * @return true if counter >= time_limit, false if counter < time_limit.
 */
bool timer_loop(uint8_t increment_amount, uint16_t time_limit, uint16_t* timeout_counter){
    *timeout_counter  = *timeout_counter + increment_amount;
    if (*timeout_counter >= time_limit){
        *timeout_counter = 0;
        return true;
    }
    return false;
}
