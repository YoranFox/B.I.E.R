import logging
import multiprocessing
import os

from configure_logging import configure_logging
from socketIO_client_nexus import SocketIO, LoggingNamespace

from modules import connection_method_mapper
from modules import ai_module
from modules.ai_module import RobotState

import robot
from order import Order

fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])


socket_alive = False
SEND_COMMAND_TO_SOCKET_KEY = 'send_command_socket'

HANDSHAKE_KEY = 'handshake'
AUTH_KEY = 'superSecretKey'
ROBOT_ID = '1'

ROBOT_LOW_BATTERY_KEY = 'low_battery'
ROBOT_READY_KEY = 'robot_ready'
ROBOT_BUSY_KEY = 'robot_busy'
ROBOT_ASLEEP_KEY = 'robot_asleep'

RECIEVE_ORDER_KEY = 'order'
RECIEVE_SHUTDOWN_KEY = 'shutdown_robot'
RECIEVE_ACTIVATE_ROBOT_KEY = 'activate_robot'
RECIEVE_MOTOR_INSTRUCTIONS = 'instructions_motor'
SOCKET_READY_KEY = 'socket_ready'
SET_SOCKET_SLEEP_MODE_KEY = 'set_sleep_mode'
SET_SOCKET_ACTIVE_MODE_KEY = 'set_active_mode'

ORDER_DENIED_KEY = 'order_denied'
ORDER_ACCEPTED_KEY = 'order_accepted'

conn = None
process = None

class SocketIOHandShakeError(Exception):
    """
    Exception to be raised when socket-io raises handshake error.
    """
    pass

class Socket():
    """
    Class implementing real time communication using socket-io.
    This runs socket-io in a different process mapping our data.
    """

    def __init__(self, conn, ip='localhost', port=3000):
        logger.info('Initializing socket on %s:%s', ip, port)
        self.ip = ip
        self.port = port
        self.socket_alive = False
        self.conn = conn
        self.SOCKET_RATE = 10
    
    def send_command_to_socket(self, command):
        self.socketIO.emit(command)
    

    def connect_to_socket(self):
        """
        Function seting up the connection and doing a handshake.
        Returns a boolean indicating if successfull.
        """

        logger.debug('Waiting for socket connection')
        try:
            self.socketIO = SocketIO(self.ip, self.port, LoggingNamespace, params={'auth': AUTH_KEY, 'robot_id': ROBOT_ID})
            self.init_socket_handlers()
            counter = 0
            while(not self.socket_alive):
                counter += 1
                if(counter > 1):
                    logger.warn('Handshake failed.. lets try again (%i)', counter)

                if(counter > 5):
                    raise SocketIOHandShakeError('Retry limit reached')
                self.do_handshake()
        except SocketIOHandShakeError as e:
            logger.error('Socket handshake error: %s', e)
            return False
        except Exception as e:
            logger.error('Socket error %s', e)
            return False
        return True

    def do_handshake(self):
        logger.debug('Sending handshake to socket')
        
        self.socketIO.emit(HANDSHAKE_KEY)
        self.socketIO.wait(1)

    def setup_socket_handler_via_conn(self, key, conn_key=None):
        """
        map a handler with key to the connection pipe.

        conn_key is optional, if None will be set to key
        """
        if(conn_key == None):
            conn_key = key
        self.socketIO.on(key, lambda x=[]: connection_method_mapper.send_via_conn(self.conn, conn_key, [x]))

    def init_socket_handlers(self):
        self.socketIO.on(HANDSHAKE_KEY, self.socket_success)

    def socket_success(self):
        logger.info('APi handshake succesfull')
        self.socket_alive = True
        self.conn.send([SOCKET_READY_KEY])

    def disconnect(self):
        self.socketIO.disconnect()

    def run(self):
        while 1:
            try:
                connection_method_mapper.loop_connections()
                self.socketIO.wait(self.SOCKET_RATE)  #wait and process socket-io events
            except Exception as e:
                logger.error(e)
                self.disconnect()
                self.connect_to_socket() 

    # TODO NOT WORKINGGGG
    def active_mode(self):
        logger.debug('Setting active mode on socket')
        self.SOCKET_RATE = 3

    def sleep_mode(self):
        self.socketIO.emit(ROBOT_ASLEEP_KEY)
        self.SOCKET_RATE = 300

def socket_emit_command(key):
    connection_method_mapper.send_via_conn(conn, SEND_COMMAND_TO_SOCKET_KEY, [key])


def create_socket(ip, port):
    global conn
    global process
    # Setup process for reading the serial port
    conn, child_conn = multiprocessing.Pipe()

    # Add all public functions in process
    connection_method_mapper.add_function(conn, on_recieve_order, RECIEVE_ORDER_KEY)
    connection_method_mapper.add_function(conn, on_recieve_motor_instructions, RECIEVE_MOTOR_INSTRUCTIONS)
    connection_method_mapper.add_function(conn, on_socket_ready, SOCKET_READY_KEY)

    process_name = 'SocketProcess'
    process =  multiprocessing.Process(name=process_name, target=start_socket, args=(child_conn, ip, port))
    process.start()


def start_socket(conn, ip, port):
    configure_logging()
    socket = Socket(conn, ip, port)

    connected = socket.connect_to_socket()

    if(not connected):
        logger.error('Socket failed to start, stopping process')
        return

    socket.setup_socket_handler_via_conn(RECIEVE_ORDER_KEY)
    socket.setup_socket_handler_via_conn(RECIEVE_SHUTDOWN_KEY)
    socket.setup_socket_handler_via_conn(SOCKET_READY_KEY)
    socket.setup_socket_handler_via_conn(RECIEVE_MOTOR_INSTRUCTIONS)

    # Map functions to be accessible from the process to main
    connection_method_mapper.add_function(conn, socket.send_command_to_socket, SEND_COMMAND_TO_SOCKET_KEY)
    connection_method_mapper.add_function(conn, socket.sleep_mode, SET_SOCKET_SLEEP_MODE_KEY)
    connection_method_mapper.add_function(conn, socket.active_mode, SET_SOCKET_ACTIVE_MODE_KEY)

    socket.run()

def on_recieve_order(order):
    logger.debug('Recieved new action')
    if(ai_module.order != None):
        socket_emit_command(ORDER_DENIED_KEY)
        return

    # Map order
    order = Order((order.locationX, order.locationY), order.bierId)
    robot.start_order(order)

    socket_emit_command(ORDER_ACCEPTED_KEY)

def on_recieve_motor_instructions(i):
    robot.robot_instructions.set_direction(i.direction)
    robot.robot_instructions.set_move_speed(i.move_speed)
    robot.robot_instructions.set_rotation_speed(i.rotation_speed)

def on_socket_ready():
    global socket_alive
    logger.debug('Socket ready check complete')
    socket_alive = True

def on_sleep():
    connection_method_mapper.send_via_conn(conn, SET_SOCKET_SLEEP_MODE_KEY)

def reset():
    global process
    global conn
    if(process != None):
        process.terminate()
        connection_method_mapper.remove_connection(conn)
        del process
        del conn