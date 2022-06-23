from enum import Enum, unique
import logging
import os
import time
import cv2 as cv

from modules import connection_method_mapper
from location import Location
from robot_instructions import RobotInstructions
from order import OrderState
import modules.location_module as lm
from order import Order
from modules.ai_module import order_state

fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

@unique
class RobotState(Enum):
    IDLE = 0,
    ORDER = 1,
    OFF = 2,
    ERROR = 3

@unique
class ActionState(Enum):
    NONE = 0,
    MOVING = 1,
    

action_state = ActionState.NONE
robot_state = RobotState.OFF
robot_instructions = RobotInstructions()
new_robot_instructions = None
robot_transform = None
has_beer = False
current_order = None
moving_object = None


fridge_location = Location(100, 100)

def init(arduino_port = "COM3"):
    """
    Initializes all the necesary modules that are used
    Returns True if is succesfull
    """
    import modules.arduino_module as am
    
    import modules.socket_module as sm
    import modules.vision_module as vm

    # Lets reset all modules
    am.reset()
    vm.reset()
    sm.reset()

    # Initialize all the modules
    am.create_arduino_connection(arduino_port)
    vm.setup_camera(2)
    sm.create_socket('localhost', 3000)

    # init AI
    logger.info('Waiting for ready checks')
    init_succesfull = False

    while not init_succesfull:
        connection_method_mapper.loop_connections()
        init_succesfull = am.connection.arduino_ready and sm.socket_alive and vm.shape != None

    return True

def set_idle():
    pass

def start_order(order):
    # type: (Order) -> None
    global current_order
    global robot_state
    current_order = order
    robot_state = RobotState.ORDER

def shutdown():
    pass

def move_to_location(location):
    # type: (Location) -> lm.MovingObject
    obj = lm.MovingObject(location)
    return obj

def send_instructions():
    import modules.arduino_module as am

    am.connection.write_instructions(robot_instructions)

def run():
    global current_order
    global moving_object
    last_instruction_write = time.time()
    INSTRUCTION_WRITE_RATE = 1

    while True:
        lm.calculate_location()
        connection_method_mapper.loop_connections()

        # Recalibrate if latest true location update is later than idk 1 sec

        # Send the instructions to the arduino EYO
        if(time.time() - last_instruction_write > INSTRUCTION_WRITE_RATE):
            last_instruction_write = time.time()
            logger.debug('sending instructions')
            send_instructions()
        

        
        if(robot_state == RobotState.IDLE):
            # IDLE STUFF
            pass

        elif(robot_state == RobotState.ORDER):
            order_state_machine()

        if(action_state == ActionState.MOVING):
            if(moving_object):
                # If delta expected and actual is over treshold and first time:
                    # A* calculations with moving_object, robot_transform and lm.map
                
                # Use route to calculate robot_instructions at this point
                # If robot_instructions are different than last instructions send it to arduino
                pass


        # For visualization can be removed later
        if cv.waitKey(1) == ord('q'):
            break


def order_state_machine():
    global current_order

    if(current_order == None):
        return

    # Start of order
    if(current_order.state == OrderState.NOT_STARTED):
        next_state_order()


def next_state_order():
    global current_order
    if(current_order == None):
        return

    if(current_order.state == OrderState.NOT_STARTED):
        current_order.set_state(OrderState.MOVING_TO_LOCATION)
        moving_object = move_to_location(current_order.location)
        moving_object.set_on_done(next_state_order)
    
    if(current_order.state == OrderState.MOVING_TO_LOCATION):
        current_order.set_state(OrderState.DONE)
    
    