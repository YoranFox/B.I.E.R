# IMPORTS
import logging
import os
import logging.config
import time
from modules import arduino_module
import cv2 as cv

from modules import connection_method_mapper
from configure_logging import configure_logging
from modules import ai_module
from modules import socket_module
from modules import vision_module
from modules import location_module

# SCRIPT VARIABLES
fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])
robot_active = False

def main():
    global robot_active
    robot_active = True
    # init modules
    logger.info('Initializing modules')
    arduino_module.create_arduino_connection()
    vision_module.setup_camera(0)
    socket_module.startup_function = None
    if(not socket_module.socket_alive):
        socket_module.create_socket('localhost', 3000)
    socket_module.shutdown_robot_function = shutdown_robot

    # init AI
    logger.info('Waiting for ready checks')
    init_succesfull = False

    while not init_succesfull:
        connection_method_mapper.loop_connections()
        init_succesfull = arduino_module.connection.arduino_ready and socket_module.socket_alive and vision_module.shape != None
        
    logger.info('Robot succesfully initialized')

    ai_module.start_ai()
    while robot_active:
        ai_module.ai_loop()
        location_module.calculate_location()
        connection_method_mapper.loop_connections()

        # For visualization can be removed later
        if cv.waitKey(1) == ord('q'):
            break
    
    socket_module.startup_function = main

    while not robot_active:
        connection_method_mapper.loop_connections()

def shutdown_robot():
    global robot_active
    logger.warn('Shutting down robot')
    arduino_module.on_shutdown()
    socket_module.on_shutdown()
    vision_module.on_shutdown()
    robot_active = False


if __name__ == '__main__':
    configure_logging()
    main()


