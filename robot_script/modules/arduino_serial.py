import logging
import os
import time
import serial

from connection_method_mapper import add_function
from configure_logging import configure_logging


fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

arduino = None

RECIEVE_SYSTEM_INFORMATION_KEY = "S"
WRITE_SYSTEM_INFORMATION_KEY = "W"

class ArduinoSerial:

    connected = False

    def __init__(self, port):
        try:
            self.arduino = serial.Serial(port=port, baudrate=9600, timeout=.1)
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

            self.connected = True
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


    # Check if arduino has new data
    def hasData(self):
        return self.arduino.inWaiting() > 0

    # Read serial connection for new line
    def read(self):
        return self.arduino.read_until()

    # Save command in array and check if no duplicates
    def write(self, data):
        self.arduino.write(data)


def start_serial(conn, port):
    configure_logging()
    logger.info('Serial initializing')
    logger.debug('Arduino on port: %s', port)
    alive = True

    arduino = ArduinoSerial(port)
    arduino.confirm_connection()

    add_function(conn, write_arduino_state, 'write_arduino_state')

    mapped_responses = {
        RECIEVE_SYSTEM_INFORMATION_KEY: lambda line : conn.send(['recieve_arduino_state', [line]])
    }

    if(not arduino.connected):
        return

    while alive:
        if(arduino.hasData()):
            line = arduino.read()
            line = line.decode()
            line = line[0:-1]
            logger.debug('Recieved data from arduino: %s', line)
            mapped_responses[line[0]](line[1:-1])



def write_arduino_state(state):
    arduino.write(WRITE_SYSTEM_INFORMATION_KEY + state)