from multiprocessing import Process
import multiprocessing
from arduino_serial import ArduinoSerial
import time
import requests
import json


def start_api_process(conn):
    alive = True
    port = None
    url = None
    api_active = False
    last_command_check = 0

    while alive:

        if(api_active):

            # check api for commands every 5 second
            if(last_command_check < time.time() * 1000 - 5000):
                r = requests.get('http://' + url + ':' + port + '/api/commands')
                data = json.loads(r.text)
                if(len(data['commands']) > 0):
                    for key, value in data['commands'].iteritems():
                        conn.send(['command', key, value])
                last_command_check = time.time() * 1000

        if(conn.poll()):
            data = conn.recv()
            if(data == 0):
                # Clean up
                alive = False

            elif(data[0] == 'init'):
                url = data[1]
                port = data[2]

                r = requests.get('http://' + url + ':' + port + '/api/status')
                data = json.loads(r.text)
                if(data['status'] == 'ONLINE'):
                    api_active = True
                    conn.send(['api_success'])
            
                else:
                    conn.send(['error', 'could not connect to api'])

            elif(data[0] == 'map'):
                r = requests.get('http://' + url + ':' + port + '/api/map')
                data = json.loads(r.text)
                if(data['status'] == 'COMPLETE'):
                    conn.send(['map', data])
                else:
                    conn.send(['error', 'cannot retrieve map, error code: ' + data['status']])


def start_arduino_process(conn):
    alive = True
    arduino = None

    while alive:
        
        # check if arduino has new line for us
        if(arduino != None):
            line = ''

            arduino.main_loop()
            line = arduino.read()

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

            # Init arduino on specified port in data[1]
            elif(data[0] == 'init'):
                arduino = ArduinoSerial(data[1])
                # wait for connection
                time.sleep(4)
                arduino.write("i")

            elif(arduino != None):
                if(data[0] == 'command'):
                    tmp = data[1]
                    if(len(data) == 3):
                        tmp += data[2]
                    arduino.write(tmp)

            # Trying to send to arduino but no arduino is initialized
            else:
                conn.send(['error', 'arduino is not initialized'])


class CommunicationDriver():  
    
    def __init__(self):
        self.arduino_conn, arduino_child_conn = multiprocessing.Pipe()
        self.arduino_process =  Process(name='Arduino Driver', target=start_arduino_process, args=(arduino_child_conn,))
        self.arduino_process.deamon = True

        self.api_conn, api_child_conn = multiprocessing.Pipe()
        self.api_process = Process(name='Api Driver', target=start_api_process, args=(api_child_conn,))
        self.api_process.deamon = True

        self.arduino_values = {'rotation': {'last_update': time.time() * 1000, 'value': 0}}
        self.api_values = {}

        self.arduino_active = False
        self.api_active = False

        self.api_process.start()
        self.arduino_process.start()


        self.values_pending = []


    # ARDUINO FUNCTIONS

    def init_arduino_conn(self, port='com3'):
        print(' [INFO] Initializing the connection to arduino...')
        self.arduino_conn.send(['init', port])

    def request_state_arduino(self, value):
        if(value in self.values_pending):
            return

        self.arduino_conn.send(['command', 'r', value])
        self.values_pending.append(value)
    
    def request_rotation(self):
        self.request_state_arduino('rotation')


    # API FUNCTIONS
    
    def init_api_conn(self, url='localhost', port='8080'):
        print(' [INFO] Initializing the connection to api...')
        self.api_conn.send(['init', url, port])
        self.api_conn.send(['map'])


    # MAIN LOOP

    def main_loop(self):

        # Check for data from arduino
        if(self.arduino_conn.poll()):
            data = self.arduino_conn.recv()

            if(data[0] == 'error'):
                print(' [ERROR] Arduino Driver: ' + data[1])

            elif(data[0] == 'arduino_success'):
                self.arduino_active = True
                print(' [INFO] Arduino successfully connected')
            
            elif(data[0] == 'value'):
                x = data[1].split(":")
                self.arduino_values[x[0]]['value'] = int(x[1])
                self.arduino_values[x[0]]['last_update'] = time.time() * 1000
                if(x[0] in self.values_pending):
                    self.values_pending.remove(x[0])
            
            else:
                print( ' [WARNING] Communication driver: Unknown command (' + data[0] + ')')


        if(self.api_conn.poll()):
            data = self.api_conn.recv()

            if(data[0] == 'error'):
                print(' [ERROR] Api Driver: ' + data[1])

            elif(data[0] == 'api_success'):
                self.api_active = True
                print(' [INFO] Connection to api succesfull')

            elif(data[0] == 'map'):
                data[1]['last_update'] = time.time() * 1000
                self.api_values['map'] = data[1]

            elif(data[0] == 'command'):
                print(' [INFO] Recieved command: ' + data[1])
            
            else:
                print( ' [WARNING] Communication driver: Unknown command (' + data[0] + ')')
        
    
    def on_destroy(self):
        self.arduino_conn.send(0)
        self.api_conn.send(0)
        