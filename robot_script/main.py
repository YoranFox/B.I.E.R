# IMPORTS
import logging
import os
import logging.config
from modules.arduino_module import ArduinoConnection
from modules.vision_module import VisionModule

from modules import connection_method_mapper
from configure_logging import configure_logging

# SCRIPT VARIABLES

fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

def main():
    # init services
    logger.info('Initializing services')
    # init modules
    logger.info('Initializing modules')
    arduinoConnection = ArduinoConnection()
    visionModule = VisionModule()
    visionModule.setup_camera(0)
    # visionModule.setup_camera(1)
    # init AI
    logger.info('Initializing AI')

    while True:
        connection_method_mapper.loop_connections()

if __name__ == '__main__':
    configure_logging()
    main()


# delta_location = location_service.calculate_delta_from_qr(solution['value'], frame.shape, rotation_robot)