#include <ArduinoJson.h>
#include <TimerOne.h>
//#include <SoftwareSerial.h>


//define in headerfile
volatile int json_orientation = 0;
volatile int json_distance_estimate = 0; 
int send_system_information_counter = 0;
int * send_system_information_counter_pt = &send_system_information_counter;
char send_system_information_key = 'S';

/**
 * Sending the information to the Raspberry Pi using the JSON library
 * @param debug: Allow for serial monitor output. 
 * @param flag:  Is there new information to send?
 */
void Send_System_Information(int debug, int* counter){
  int send_every_x_ticks = 500;
  
  if (*counter < send_every_x_ticks){
    //Serial.println("counter:");
    //Serial.println(*counter);
    *counter = *counter+1;
    return;
  }else{
    if (debug){
    // Values we want to transmit 
    // Print the values on the "debug" serial port
    Serial.print("Orientation = ");
//    Serial.println(orientation);
//    Serial.print("Distance_estimate = ");
//    Serial.println(distance_estimate);
    Serial.println("---");
    }
    // Create the JSON document
    StaticJsonDocument<200> Sys_information_send_doc;
    Sys_information_send_doc["Orientation"] = json_orientation;
    Sys_information_send_doc["Distance_estimate"] = json_distance_estimate;
  
    // Send the JSON document over the "link" serial port
    Serial.print(send_system_information_key);
    serializeJson(Sys_information_send_doc, Serial);
    Serial.println();
    *counter = 0;
  }
}


/**
 * Recieve the json packages from the Rasp pi
 * @return Write to robot data struct;
 */
void Recieve_System_Information(){
    if (Serial.available()) 
  {
    // Allocate the JSON document
    // This one must be bigger than for the sender because it must store the strings
    StaticJsonDocument<300> Sys_information_recieve_doc;

    // Read the JSON document from the "link" serial port
    DeserializationError err = deserializeJson(Sys_information_recieve_doc, Serial);

    if (err == DeserializationError::Ok) 
    {
      // Print the values
      // (we must use as<T>() to resolve the ambiguity)
      Serial.print("Orientation = ");
      Serial.println(Sys_information_recieve_doc["Orientation"].as<int>());
      Serial.print("Distance_estimate = ");
      Serial.println(Sys_information_recieve_doc["Distance_estimate"].as<int>());
    } 
    else 
    {
      // Print error to the "debug" serial port
      Serial.print("deserializeJson() returned ");
      Serial.println(err.c_str());
  
      // Flush all bytes in the serial port buffer
      while (Serial.available() > 0)
        Serial.read();
    }
  }
}


void heartbeat(){
  //Blink a led every second. 
}
/**
 * System ticks every 10 ms and executes every function inside. 
 */
void sys_tick(){
  //Serial.println("Sys_Tick");
  Send_System_Information(0,send_system_information_counter_pt);

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
  Timer1.initialize(1000); //system tick speed every 10 ms. might be changed to 1ms later
  Timer1.attachInterrupt(sys_tick); // blinkLED to run every 0.15 seconds
  
}

void loop() {

  // Wait
  delay(5000);
}
