from multiprocessing import Process
import multiprocessing
from arduino_serial import ArduinoSerial
import time


def start_process(conn):
    alive = True
    arduino = None
    while alive:
        
        # check if arduino has new line for us
        if(arduino != None):
            line = ''

            arduino.main_loop()

            line = arduino.read()
            # print('>> ' + line)
            if(line != ''):

                # Transform line into command and data parts
                command = line[0]
                data = line[1:-1]

                # Call back arduino connection successfull
                if(command == 'i'):
                    conn.send(['arduino_success'])
                if(command == 'v'):
                    conn.send(['value', data])
    
        # Check if data is available from process
        if(conn.poll()):
            data = conn.recv()
            if(data == 0):
                # Clean up
                alive = False
            elif(data[0] == 'arduino'):
                # Init arduino on specified port in data[2]
                if(data[1] == 'init'):
                    arduino = ArduinoSerial(data[2])
                    # wait for connection
                    time.sleep(4)
                    arduino.write("i")

                elif(arduino != None):
                    if(data[1] == 'command'):
                        tmp = data[2]
                        if(len(data) == 4):
                            tmp += data[3]
                        arduino.write(tmp)

                # Trying to send to arduino but no arduino is initialized
                else:
                    conn.send(['error', 'arduino is not initialized'])
    

class CommunicationDriver():  
    
    def __init__(self):
        self.conn, child_conn = multiprocessing.Pipe()
        self.process =  Process(name='Communication Driver', target=start_process, args=(child_conn,))
        self.process.deamon = True

        self.arduino_values = {'rotation': {'last_update': time.time() * 1000, 'value': 0}}

        self.arduino_active = False
        self.api_active = False


        self.process.start()


    def init_arduino_conn(self, port='com3'):
        print('initializing the connection to arduino...')
        self.conn.send(['arduino', 'init', port])

    def request_state_arduino(self, value):
        self.conn.send(['arduino', 'command', 'r', value])
    
    def request_rotation(self):
        self.request_state_arduino('rotation')


    def main_loop(self):
        # Check for data from camera
        if(self.conn.poll()):
            data = self.conn.recv()

            if(data[0] == 'error'):
                print('error has occurd on comm driver: ' + data[1])

            elif(data[0] == 'arduino_success'):
                self.arduino_active = True
                print('arduino successfully connected')
            
            elif(data[0] == 'value'):
                x = data[1].split(":")
                self.arduino_values[x[0]]['value'] = int(x[1])
                self.arduino_values[x[0]]['last_update'] = time.time() * 1000



        
    
    def on_destroy():
        self.arduino = None
        