# Importing Libraries
import logging
import multiprocessing

import os



from connection_method_mapper import add_function
from arduino_serial import start_serial
from configure_logging import configure_logging

fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

class ArduinoConnection:
    arduino_state = None

    def __init__(self, port='com3'):
        logger.info('Initializing arduino connection on %s', port)

        # Setup process for reading the serial port
        self.conn, child_conn = multiprocessing.Pipe()
        add_function(self.conn, self.recieve_arduino_state, 'recieve_arduino_state')
        self.process =  multiprocessing.Process(name='Serial reader', target=start_serial, args=(child_conn, port))
        self.process.start()


    def write_arduino_state(self, json):
        self.conn.send(['write_arduino_state', [{'rotation': 0}]])

    def recieve_arduino_state(self, json):
        self.arduino_state = json

    def __exit__(self, exc_type, exc_value, traceback):
        del self.arduino
        logger.warn('Connection with arduino aborted')
        if(traceback):
            logger.error('traceback: %s', traceback)



def main():
    com = raw_input("Enter com port (example: com3): ")
    arduino = ArduinoConnection(port=com)

if __name__ == '__main__':
    configure_logging()
    main()
