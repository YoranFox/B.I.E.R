from argparse import Action
import logging
import os
import time
import numpy as np

from enum import Enum

from configure_logging import configure_logging
from modules import location_module

fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

class RobotState(Enum):
    IDLE = 0,
    ORDER = 1,
    OFF = 2,
    ERROR = 3

class ActionType(Enum):
    NONE = 0,
    MOVING = 1,
    OPEN_FRIDGE = 2,
    PICK_BEER = 3,
    CLOSE_FRIDGE = 4,
    WAIT_FOR_PICKUP = 5

MAX_DELTA_LOCATION = 100
RECALIBRATION_RATE = 500 # I think its in miliseconds :) Rate at wich the true location needs to be updated

fridge_location = (100, 100)
idle_location = (0, 0)

order = None
base_location = (0, 0)
robot_state = RobotState.OFF
current_action_type = ActionType.NONE


fridge_open = False
moving_done = False
has_beer =  False

def start_ai():
    global robot_state
    robot_state = RobotState.IDLE


def ai_loop():
    global robot_state

    if(location_module.location == None or time.time() - location_module.last_update > RECALIBRATION_RATE):
        recalibrate_location()
        return


    # Here we do the current action stuff yay
    if(current_action_type == ActionType.MOVING):
        pass


    # See what state the robot is in and do the state configs stuff yay
    if(robot_state == RobotState.IDLE):
        idle_state()
        

    elif(robot_state == RobotState.ORDER):
        order_state()
        # state machine for actions

        # IDLE
       
        # ACTION

        # MOVING

        # calculate latest location with all data we have

        # update path to take

        # update arduino state

        # WAIT

        # check if wait function is ok

        # if ok -> do next action

        # LOAD

        # Beverage loading on robot (custom logic)

        # CHARGE

        # charging logic

        # OFF (charging, chosen that the robot is off)

        # first loop shut down battery eating functions and modules

        # ERROR

        # unable to handle error or exception

        # needs manual reset

        # check api state for interupts

        # api call every 5 seconds probably in seperate process to update api state

# Idle logic
def idle_state():
    if(current_action_type == ActionType.NONE):
        # Check if the robot is close enough to the idle location
        delta_location = np.diff([location_module.location, idle_location], axis=0)
        if(np.average(delta_location) > MAX_DELTA_LOCATION):
            move_to_location(idle_location)
    if(current_action_type == ActionType.MOVING):
        pass


# Order logic
def order_state():
    global current_action_type

    # Start of order
    if(current_action_type == ActionType.NONE):
        logger.info('Performing magical journey to get bier')
        move_to_location(fridge_location)

    if(current_action_type == ActionType.MOVING):
        if(moving_done):
            if(not has_beer):
                open_fridge()
            else:
                wait_for_pickup()

    if(current_action_type == ActionType.OPEN_FRIDGE):
        if(fridge_open):
            pick_beer(order.bier_id)

    if(current_action_type == ActionType.PICK_BEER):
        if(has_beer):
            close_fridge()
    
    if(current_action_type == ActionType.CLOSE_FRIDGE):
        if(not fridge_open):
            move_to_location(order.location)

    if(current_action_type == ActionType.WAIT_FOR_PICKUP):
        if(not has_beer):
            current_action_type = ActionType.NONE


def move_to_location(location):
    global current_action_type
    global target_location
    current_action_type = ActionType.MOVING
    target_location = location 

def open_fridge():
    global current_action_type
    current_action_type = ActionType.OPEN_FRIDGE

def close_fridge():
    global current_action_type
    current_action_type = ActionType.CLOSE_FRIDGE

def pick_beer(beer_id):
    global current_action_type
    global target_beer
    current_action_type = ActionType.PICK_BEER
    target_beer = beer_id

def wait_for_pickup():
    global current_action_type
    current_action_type = ActionType.WAIT_FOR_PICKUP

def recalibrate_location():
    # based on last known position we are going to try to find a qr code for us to scan to know the location

    # For now we can try to do this by going in circles <>

    # TODO
    pass


if __name__ == '__main__':
    configure_logging()
    while True:
        ai_loop()