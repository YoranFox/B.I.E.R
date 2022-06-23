from gzip import WRITE
import json
import logging
import os
import time
import serial

from configure_logging import configure_logging
from modules import connection_method_mapper
from robot_instructions import RobotInstructions


fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

arduino = None
conn = None

RECIEVE_SYSTEM_INFORMATION_KEY = "S"
RECIEVE_DEBUG_LOG_KEY = 'D'
RECIEVE_ERROR_LOG_KEY = 'E'
WRITE_INSTRUCTIONS_KEY = "I"
HANDSHAKE_KEY = "H"

HANDSHAKE_SECRET = "secret"
ARDUINO_SECRET = "secret"

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
    
    def confirm_connection(self, sleep_time=2):
        logger.debug('Confirming connection with arduino Shake shake')
        try:

            """Make sure connection is established by sending
            and receiving bytes."""
            # Close and reopen
            self.arduino.close()
            self.arduino.open()

            # self.ready = True

            # return self.ready

            # Chill out while everything gets set
            time.sleep(sleep_time)

            # Read and discard everything that may be in the input buffer
            _ = self.arduino.read_all()

            # Set a long timeout to complete handshake
            timeout = self.arduino.timeout
            self.arduino.timeout = 2


            

            message = HANDSHAKE_KEY + HANDSHAKE_SECRET
            # Send request to Arduino
            self.write(message)

            line = self.arduino.read_until()

            # line = self.read()
            line = line[0:-1]

            if(line[0] != "H"):
                raise serial.SerialTimeoutException('No handshake key recieved')

            # Read in what Arduino sent
            handshake_message = line[1:-1]

            if(handshake_message != ARDUINO_SECRET):
                raise serial.SerialTimeoutException('Handshake Secret does not match')

            self.ready = True
            # Print the handshake message, if desired
            logger.debug("Handshake message: " + handshake_message.decode())

        except serial.SerialTimeoutException as err:
            logger.error('Connection with arduino unsuccesfull: Timeout %s', err)
            pass
        except Exception as err:
            logger.error(err)
            pass
        # Reset the timeout
        self.arduino.timeout = timeout
        return self.ready


    # Check if arduino has new data
    def hasData(self):
        return self.arduino.inWaiting() > 0

    # Read serial connection for new line
    def read(self):
        return self.arduino.read_until()

    def write(self, data):
        data = data + '\n'
        self.arduino.write(data.encode('UTF8'))
        # self.arduino.flush()


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

    connection_method_mapper.add_function(conn, write_instructions, WRITE_INSTRUCTIONS_KEY)

    mapped_responses = {
        RECIEVE_SYSTEM_INFORMATION_KEY: lambda line : recieve_arudino_state(line),
        RECIEVE_DEBUG_LOG_KEY: lambda line: recieve_debug_log(line),
        RECIEVE_ERROR_LOG_KEY: lambda line: recieve_error_log(line),
    }

    alive = True

    conn.send([ARDUINO_READY_KEY])
    while alive:
        connection_method_mapper.loop_connections()
        if(arduino.hasData()):
            try:
                line = arduino.read()
                line = line[0:-1]
                # logger.debug('Recieved data from arduino: %s', line)
                mapped_responses[line[0]](line[1:-1])
            except Exception as e:
                logger.error('Error: %s', e)

def recieve_debug_log(line):
    logger.debug('Arduino line: %s', line)

def recieve_error_log(line):
    logger.error('Arduino line: %s', line)

def recieve_arudino_state(data):
    #Remove unicode typing
    arduino_state_unicode = json.loads(data)
    arduino_state = { k.encode('ascii', 'ignore'): v for k, v in arduino_state_unicode.items() }
    arduino_state['last_update'] = time.time()
    logger.debug('Recieved arduino state: %s', arduino_state)
    conn.send([RECIEVE_SYSTEM_INFORMATION_KEY, [arduino_state]])

def write_instructions(instructions):
    # type: (RobotInstructions) -> None

    json_data = json.dumps(instructions.get_instructions())

    arduino.write(WRITE_INSTRUCTIONS_KEY + json_data)


