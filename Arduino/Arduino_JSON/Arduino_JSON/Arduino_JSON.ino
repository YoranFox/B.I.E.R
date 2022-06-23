#include <ArduinoJson.h>
#include <TimerOne.h>
//#include <SoftwareSerial.h>


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
void Send_System_Information(int debug, int* counter){
  
  if (*counter < send_every_x_ticks){
    //Serial.println("counter:");
    //Serial.println(*counter);
    *counter = *counter+1;
    return;
  }else{

    // Create the JSON document
    StaticJsonDocument<200> Sys_information_send_doc;
    Sys_information_send_doc["rotation"] = json_rotation;
    Sys_information_send_doc["Distance_estimate"] = json_distance_estimate;
    Sys_information_send_doc["last_update"] = json_distance_estimate;
    
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
void Recieve_System_Information(int debug, int* counter){

        // Allocate the JSON document
        // This one must be bigger than for the sender because it must store the strings
//        static StaticJsonDocument<300> instructions_motors;
//
//        const auto deser_err = deserializeJson(instructions_motors, Serial);
//        if (deser_err) {
//            Serial.print(send_error_log_key);
//            Serial.print("Failed to deserialize, reason: \"");
//            Serial.print(deser_err.c_str());
//            Serial.println('"');
//        } else  {
//            Serial.print(send_debug_log_key);
//            Serial.print("Recevied valid json document with ");
//            Serial.print(instructions_motors.size());
//            Serial.println(" elements.");
//            Serial.print(send_debug_log_key);
//            Serial.print("Pretty printed back at you:");
//            serializeJsonPretty(instructions_motors, Serial);
//            Serial.println();
//        }
//    Serial.print(send_debug_log_key);
//    Serial.println(Serial.available());


  
  if( Serial.available() > 0) {

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



/**
 * System ticks every 10 ms and executes every function inside. 
 */
void sys_tick(){
  Send_System_Information(0,send_system_information_counter_pt);
  Recieve_System_Information(0, recieve_system_information_counter_pt);
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
//  
//  Timer1.attachInterrupt(sys_tick); // blinkLED to run every 0.15 seconds
  
}

void loop() {
   Recieve_System_Information(0, recieve_system_information_counter_pt);
   if(started) {
       Send_System_Information(0,send_system_information_counter_pt);
   }


   
  // Wait
  delay(1);
}
