//
// Created by jasper-jan on 14-07-21.
//

#ifndef MEGACODE_MAGNETO_HMC5883_H
#define MEGACODE_MAGNETO_HMC5883_H

#include <stdint.h>
#include <stdbool.h>

void Magneto_HMC5883_init();
void Magneto_HMC5883_tick();
void Magneto_HMC5883_update();
#include "../lib/Adafruit_HMC5883_Unified/Adafruit_HMC5883_U.h"
#include "../lib/Adafruit_Unified_Sensor/Adafruit_Sensor.h"

#endif //MEGACODE_MAGNETO_HMC5883_H
