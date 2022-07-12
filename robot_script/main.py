# IMPORTS
import logging
import os
import logging.config

from dotenv import load_dotenv



from configure_logging import configure_logging
import robot

# SCRIPT VARIABLES
fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])
robot_active = False

def main():
    init_succesfull = robot.init(arduino_port=os.getenv('ARDUINO_COM'), camera=0)
    if(init_succesfull):
        logger.info('Robot succesfully initialized Beep Boop')
        robot.run()


if __name__ == '__main__':
    configure_logging()
    load_dotenv()
    main()


