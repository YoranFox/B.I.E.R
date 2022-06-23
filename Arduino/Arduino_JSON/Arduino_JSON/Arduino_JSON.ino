#include <ArduinoJson.h>
#include <Arduino.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_HMC5883_U.h>
#include <Wire.h>

//for the loop
unsigned long previousMillis = 0; 
const long interval = 100;

//Magentometer
Adafruit_HMC5883_Unified mag;
bool request_new_heading;
uint16_t heading_timeout_counter;


//define in headerfile
volatile int json_rotation = 0;
volatile int json_distance_estimate = 0; 
int send_system_information_counter = 0;
int recieve_system_information_counter = 0;
int * send_system_information_counter_pt = &send_system_information_counter;
int * recieve_system_information_counter_pt = &recieve_system_information_counter;
char send_system_information_key = 'S';
char recieve_instructions_key = 'I';
char send_debug_log_key = 'D';
char send_error_log_key = 'E';
String ARDUINO_SECRET = "secret";
String PYTHON_SECRET = "secret";
char HANDSHAKE_KEY = 'H';
String  payload;
int send_every_x_ticks = 500;


boolean started = false;
/**
 * Sending the information to the Raspberry Pi using the JSON library
 * @param debug: Allow for serial monitor output. 
 * @param flag:  Is there new information to send?
 */
void Send_System_Information(int debug){
  
    // Create the JSON document
    StaticJsonDocument<200> Sys_information_send_doc;
    Sys_information_send_doc["rotation"] = json_rotation;
    Sys_information_send_doc["Distance_estimate"] = json_distance_estimate;
    Sys_information_send_doc["last_update"] = json_distance_estimate;
    
    // Send the JSON document over the "link" serial port
    Serial.print(send_system_information_key);
    serializeJson(Sys_information_send_doc, Serial);
    Serial.println();
}


/**
 * Recieve the json packages from the Rasp pi
 * @return Write to robot data struct;
 */
void Recieve_System_Information(int debug){
  
  while( Serial.available() > 0) {

    char a = Serial.read();

    if(a == '\n') {
      // Handshake stuff cool
      char command = payload.charAt(0);
      payload.remove(0, 1);
      if(command == 'H') {
        // check if secret is ok
        if(payload == PYTHON_SECRET) {
          Serial.print(HANDSHAKE_KEY);
          Serial.println(ARDUINO_SECRET);
          started = true;
        }
      }

      if(!started) {
        return;
      }

      if(command == 'I') {
        StaticJsonDocument<512> doc;
    
        DeserializationError error = deserializeJson(doc, payload);
        if (error) {
          Serial.print(send_error_log_key);
          Serial.println(error.c_str()); 
          return;
        }
        
        Serial.print(send_debug_log_key);
        serializeJson(doc, Serial);
        Serial.println();

      }

      if(command == 'C') {
        started = false;
      }
      
      payload = "";
    }
    else {
          payload += a;
    }
  } 
 }

bool timer_loop(uint8_t increment_amount, uint16_t time_limit, uint16_t* timeout_counter){
    *timeout_counter  = *timeout_counter + increment_amount;
    if (*timeout_counter >= time_limit){
        *timeout_counter = 0;
        return true;
    }
    return false;
}


void displaySensorDetails(void)
{
    sensor_t sensor;
    mag.getSensor(&sensor);
//    Serial.println("------------------------------------");
//    Serial.print  ("Sensor:       "); Serial.println(sensor.name);
//    Serial.print  ("Driver Ver:   "); Serial.println(sensor.version);
//    Serial.print  ("Unique ID:    "); Serial.println(sensor.sensor_id);
//    Serial.print  ("Max Value:    "); Serial.print(sensor.max_value); Serial.println(" uT");
//    Serial.print  ("Min Value:    "); Serial.print(sensor.min_value); Serial.println(" uT");
//    Serial.print  ("Resolution:   "); Serial.print(sensor.resolution); Serial.println(" uT");
//    Serial.println("------------------------------------");
//    Serial.println("");
}

/**
 * Sets the request flag for new magnetometer data. Throws a timeout warning if no new data is recieved.
 * Note disable flag after data is recieved.
 */
void increment_magneto_timeout(){
    if (!request_new_heading) {
        request_new_heading = timer_loop(1, 1, &heading_timeout_counter);
    }else{
        bool temp = timer_loop(1, 1, &heading_timeout_counter);
        if (temp){
//            Serial.println("Magnetometer request timeout detected no new data recieved in last 100 ms.");
            Magneto_HMC5883_init();
        }
    }
}

void Magneto_HMC5883_init(){
    //timeouts
    request_new_heading = false;
    heading_timeout_counter = 0;

//    Serial.println("HMC5883 Magnetometer init"); Serial.println("");

    /* Initialise the sensor */
    mag = Adafruit_HMC5883_Unified(12345);
    while(!mag.begin())
    {
        //ToDo add some sort of hard fault handler here.
        /* There was a problem detecting the HMC5883 ... check your connections */
//        Serial.println("No HMC5883 detected ...");
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
//        Serial.print("Heading (degrees): ");
//        Serial.println(headingDegrees);
    }
    return headingDegrees;
}

void Magneto_HMC5883_tick(){
    increment_magneto_timeout();
}
void Magneto_HMC5883_update(){
    if(request_new_heading) {
        request_new_heading = false;
        json_rotation = (int) get_heading(0);
    }
}

/**
 * System ticks every 10 ms and executes every function inside. 
 */
void sys_tick(){
  Magneto_HMC5883_tick();
  Magneto_HMC5883_update();
  if(started) {
      Send_System_Information(0);
  }

  Recieve_System_Information(0);
}

/**
 * System update, Functions that take longer in the background and don't require to be equal with Tick function
 */
void sys_update(){
  
}


void setup() {
  // Initialize "debug" serial port
  // The data rate must be much higher than the "link" serial port
  Serial.begin(9600);
  while (!Serial) continue;
  

  //timer one settings
//  Timer1.initialize(1000); //system tick speed every 10 ms. might be changed to 1ms later
//  '
//  Timer1.attachInterrupt(sys_tick); // blinkLED to run every 0.15 seconds

  Magneto_HMC5883_init();
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    //DO stuff here: 
    sys_tick();
  }
}
