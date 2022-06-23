# Importing Libraries
import logging
import multiprocessing
import os
from connection_method_mapper import add_function
from arduino_serial import start_serial
from modules.arduino_serial import ARDUINO_READY_KEY
from modules import connection_method_mapper
from modules.arduino_serial import WRITE_INSTRUCTIONS_KEY
from robot_instructions import RobotInstructions
from modules.arduino_serial import RECIEVE_SYSTEM_INFORMATION_KEY

fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

# {'rotation': 0, 'location': (0,0)}
arduino_state = None
connection = None

class ArduinoConnection:

    def __init__(self, port='com3'):
        logger.info('Initializing arduino connection on %s', port)
        self.arduino_ready = False

        # Setup process for reading the serial port
        self.conn, child_conn = multiprocessing.Pipe()
        add_function(self.conn, self.recieve_arduino_state, RECIEVE_SYSTEM_INFORMATION_KEY)
        add_function(self.conn, self.on_arduino_ready, ARDUINO_READY_KEY)
        self.process = multiprocessing.Process(name='Serial reader', target=start_serial, args=(child_conn, port))
        self.process.start()

    def on_arduino_ready(self):
        logger.debug('Arduino ready check complete')
        self.arduino_ready = True

    def is_arduino_ready(self):
        return self.arduino_ready

    def write_instructions(self, instructions):
        # type: (RobotInstructions) -> None
        connection_method_mapper.send_via_conn(self.conn, WRITE_INSTRUCTIONS_KEY, [instructions])

    def recieve_arduino_state(self, json_state):
        global arduino_state
        arduino_state = json_state

    def __exit__(self):
        connection_method_mapper.remove_connection(self.conn)
        self.process.terminate()
        del self.conn
        logger.warn('Connection with arduino aborted')


def create_arduino_connection(port):
    global connection
    connection = ArduinoConnection(port)

def reset():
    global connection
    global arduino_state
    if(connection):
        connection.__exit__()
        del connection
        del arduino_state
