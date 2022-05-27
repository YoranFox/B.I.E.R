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
    to_delete = []
    for conn in mapped_functions:
        try:
        # data available
            if(conn.poll()):
                data = conn.recv()
                function = mapped_functions[conn][data[0]]
                args = []
                if(len(data) > 1):
                    args = data[1]
                function(*args)

        except IOError as e:
            logger.error('Mapped pipe (%s) error: %s', conn ,e)
            to_delete.append(conn)
            pass

        except Exception as e:
            logger.error('Error while calling mapped function: %s', e)
            pass

    for conn in to_delete:
        mapped_functions.pop(conn)

def send_via_conn(conn, command, args):
    """
    Method to call a function at the other connections end,

    conn: connection pipe to send it through
    command: key used to map function
    args: Array of arguments
    """
    conn.send([command, args])