import json
import logging
import os
import time
import serial

from configure_logging import configure_logging
from modules import connection_method_mapper


fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

arduino = None
conn = None

RECIEVE_SYSTEM_INFORMATION_KEY = "S"
WRITE_SYSTEM_INFORMATION_KEY = "W"

ARDUINO_READY_KEY = 'arduino_ready'

class ArduinoSerial:

    def __init__(self, port):
        self.connected = False
        self.ready = False
        try:
            self.arduino = serial.Serial(port=port, baudrate=9600, timeout=.1)
            self.connected = True
        except serial.SerialException:
            logger.error('Could not open port %s', port)
            pass
    
    def confirm_connection(self, sleep_time=1, handshake_code=0):
        logger.debug('Confirming connection with arduino')
        try:
            arduino = self.arduino

            """Make sure connection is established by sending
            and receiving bytes."""
            # Close and reopen
            arduino.close()
            arduino.open()

            # Chill out while everything gets set
            time.sleep(sleep_time)

            # Set a long timeout to complete handshake
            timeout = arduino.timeout
            arduino.timeout = 2

            # Read and discard everything that may be in the input buffer
            _ = arduino.read_all()

            # Send request to Arduino
            arduino.write(bytes([handshake_code]))

            # Read in what Arduino sent
            handshake_message = arduino.read_until()

            if(handshake_message == ''):
                raise serial.SerialTimeoutException('Handshake 1')

            # Send and receive request again
            arduino.write(bytes([handshake_code]))
            handshake_message = arduino.read_until()

            if(handshake_message == ''):
                raise serial.SerialTimeoutException('Handshake 2')

            self.ready = True
            # Print the handshake message, if desired
            logger.debug("Handshake message: " + handshake_message.decode()[:-1])

        except serial.SerialTimeoutException as err:
            logger.error('Connection with arduino unsuccesfull: Timeout %s', err)
            pass
        except Exception as err:
            logger.error(err)
            pass
        # Reset the timeout
        arduino.timeout = timeout
        return self.ready


    # Check if arduino has new data
    def hasData(self):
        return self.arduino.inWaiting() > 0

    # Read serial connection for new line
    def read(self):
        return self.arduino.read_until()

    # Save command in array and check if no duplicates
    def write(self, data):
        self.arduino.write(data)


def start_serial(c, port):
    global conn
    global arduino
    conn = c
    configure_logging()
    logger.info('Serial initializing')
    logger.debug('Arduino on port: %s', port)
    alive = False
    counter = 0
    arduino = None
    while arduino == None or not arduino.connected:
        if(counter > 4):
            logger.error('Arduino connection error: Max retry reached')
            return

        logger.debug('Trying to create arduino connection (%i)', counter)
        arduino = ArduinoSerial(port)
        if(not arduino.connected):
            counter += 1
            time.sleep(2)

    arduino.confirm_connection()

    if(not arduino.ready):
        return

    connection_method_mapper.add_function(conn, write_arduino_state, 'write_arduino_state')

    mapped_responses = {
        RECIEVE_SYSTEM_INFORMATION_KEY: lambda line : recieve_arudino_state(line)
    }

    alive = True

    conn.send([ARDUINO_READY_KEY])
    while alive:
        connection_method_mapper.loop_connections()
        if(arduino.hasData()):
            line = arduino.read()
            line = line.decode()
            line = line[0:-1]
            logger.debug('Recieved data from arduino: %s', line)
            mapped_responses[line[0]](line[1:-1])


def recieve_arudino_state(data):
    #Remove unicode typing
    arduino_state_unicode = json.loads(data)
    arduino_state = { k.encode('ascii', 'ignore'): v for k, v in arduino_state_unicode.items() }
    arduino_state['last_update'] = time.time()
    conn.send(['recieve_arduino_state', [arduino_state]])

def write_arduino_state(state):
    arduino.write(WRITE_SYSTEM_INFORMATION_KEY + state)