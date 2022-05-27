//
// Created by jasper-jan on 14-07-21.
//

#include "Magneto_HMC5883.h"
#include "timer_implementations.h"
Adafruit_HMC5883_Unified mag;
bool request_new_heading;
uint16_t heading_timeout_counter;


void displaySensorDetails(void)
{
    sensor_t sensor;
    mag.getSensor(&sensor);
    Serial.println("------------------------------------");
    Serial.print  ("Sensor:       "); Serial.println(sensor.name);
    Serial.print  ("Driver Ver:   "); Serial.println(sensor.version);
    Serial.print  ("Unique ID:    "); Serial.println(sensor.sensor_id);
    Serial.print  ("Max Value:    "); Serial.print(sensor.max_value); Serial.println(" uT");
    Serial.print  ("Min Value:    "); Serial.print(sensor.min_value); Serial.println(" uT");
    Serial.print  ("Resolution:   "); Serial.print(sensor.resolution); Serial.println(" uT");
    Serial.println("------------------------------------");
    Serial.println("");
}

/**
 * Sets the request flag for new magnetometer data. Throws a timeout warning if no new data is recieved.
 * Note disable flag after data is recieved.
 */
void increment_magneto_timeout(){
    if (!request_new_heading) {
        request_new_heading = timer_loop(1, 5, &heading_timeout_counter);
    }else{
        bool temp = timer_loop(1, 5, &heading_timeout_counter);
        if (temp){
            Serial.println("Magnetometer request timeout detected no new data recieved in last 100 ms.");
            Magneto_HMC5883_init();
        }
    }
}

void Magneto_HMC5883_init(){
    //timeouts
    request_new_heading = false;
    heading_timeout_counter = 0;

    Serial.println("HMC5883 Magnetometer init"); Serial.println("");

    /* Initialise the sensor */
    mag = Adafruit_HMC5883_Unified(12345);
    while(!mag.begin())
    {
        //ToDo add some sort of hard fault handler here.
        /* There was a problem detecting the HMC5883 ... check your connections */
        Serial.println("No HMC5883 detected ...");
        delay(500);
    }

    /* Display some basic information on this sensor */
    displaySensorDetails();
}

/**
 * Source is adafruit example code
 * @param debug do we want debug print statements
 * @return
 */
float get_heading(bool debug) {
    sensors_event_t event;
    mag.getEvent(&event);
    // Hold the module so that Z is pointing 'up' and you can measure the heading with x&y
    // Calculate heading when the magnetometer is level, then correct for signs of axis.
    float heading = atan2(event.magnetic.y, event.magnetic.x);

    // Once you have your heading, you must then add your 'Declination Angle', which is the 'Error' of the magnetic field in your location.
    // Find yours here: http://www.magnetic-declination.com/
    // Mine is: -13* 2' W, which is ~13 Degrees, or (which we need) 0.22 radians
    // If you cannot find your Declination, comment out these two lines, your compass will be slightly off.
    float declinationAngle = 0.22;
    heading += declinationAngle;

    // Correct for when signs are reversed.
    if(heading < 0)
        heading += 2*PI;

    // Check for wrap due to addition of declination.
    if(heading > 2*PI)
        heading -= 2*PI;

    // Convert radians to degrees for readability.
    float headingDegrees = heading * 180/M_PI;

    if (debug) {
        Serial.print("Heading (degrees): ");
        Serial.println(headingDegrees);
    }
    return headingDegrees;
}

void Magneto_HMC5883_tick(){
    increment_magneto_timeout();
}
void Magneto_HMC5883_update(){
    if(request_new_heading) {
        request_new_heading = false;
        float headingDegrees = get_heading(0);
    }
}





/***************************************************************************
  This is a library example for the HMC5883 magnentometer/compass

  Designed specifically to work with the Adafruit HMC5883 Breakout
  http://www.adafruit.com/products/1746

  *** You will also need to install the Adafruit_Sensor library! ***

  These displays use I2C to communicate, 2 pins are required to interface.

  Adafruit invests time and resources providing this open source code,
  please support Adafruit andopen-source hardware by purchasing products
  from Adafruit!

  Written by Kevin Townsend for Adafruit Industries with some heading example from
  Love Electronics (loveelectronics.co.uk)

 This program is free software: you can redistribute it and/or modify
 it under the terms of the version 3 GNU General Public License as
 published by the Free Software Foundation.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 ***************************************************************************/