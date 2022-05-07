import logging
import os


fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

mapped_functions = {}

    
def add_function(conn, function, key):
    if(conn not in mapped_functions):
        mapped_functions[conn] = {}
    mapped_functions[conn][key] = function
    logger.debug('Mapped -> Connection: %s - Function: %s - key: %s', conn, function.__name__, key)

def remove_function(conn, key):
    del mapped_functions[conn][key]

def remove_connection(conn):
    del mapped_functions[conn]

def loop_connections():
    for conn in mapped_functions:
        # data available
        if(conn.poll()):
            data = conn.recv()
            function = mapped_functions[conn][data[0]]
            function(*data[1])
