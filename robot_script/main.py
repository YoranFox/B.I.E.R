# IMPORTS
import logging
import os
import logging.config
import time
from modules import arduino_module
import cv2 as cv

from modules import connection_method_mapper
from configure_logging import configure_logging
import robot

# SCRIPT VARIABLES
fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])
robot_active = False

def main():
    init_succesfull = robot.init()
    if(init_succesfull):
        logger.info('Robot succesfully initialized Beep Boop')
        robot.run()


if __name__ == '__main__':
    configure_logging()
    main()


