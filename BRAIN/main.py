import time
import logging
from location_service import location_service
from communication.communication_driver import CommunicationDriver
from camera.camera_driver import CameraDriver
from datetime import datetime

camera = None
calibrating = False
last_location_update = 0
looper = []
connections = {}
process_values = {}
house_map = []
id_locations = {}

params_fetched = False
max_delta_time = 100

camera = CameraDriver()
communication = CommunicationDriver()

calibrating = False
last_location_update = time.time()


# create logger
logger = logging.getLogger('simple_example')
logger.setLevel(logging.DEBUG)

# create console handler and set level to debug
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

# create formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# add formatter to ch
ch.setFormatter(formatter)

# add ch to logger
logger.addHandler(ch)

def update_map(map):
    global map_last_update
    global id_lcoations
    
    # Update acuro id locations
    for key, value in map['acuro'].iteritems():
        coords = value.split(',')
        id_locations[int(key)] = (int(coords[0]), int(coords[1]))

    map_last_update = map['last_update']
    logger.info('Updated map value')


def main_loop():
    is_init = True
    values_initialized = False

    global map_last_update
    map_last_update = None


    while True:
        # Run all the loops that are connected
        for loop in looper:
            loop()

        # Check if all components are initialized
        if(communication.arduino_active & communication.api_active & is_init):
            print(' [INFO] Init succesfull')
            is_init = False


        # Wait for all drivers and connections to be initialized
        if(not is_init):

            # check if map needs update
            if('map' in communication.api_values):
                # First time updating
                if(map_last_update == None):
                    update_map(communication.api_values['map'])

                # Check if last_update value is later then current
                elif(map_last_update < communication.api_values['map']['last_update']):
                    update_map(communication.api_values['map'])


            if(values_initialized):
                if((time.time() * 1000) - last_location_update > 10000 ):
                    recalibrate()

            # Check if all values are initialized
            elif(map_last_update != None):
                    values_initialized = True


def recalibrate():
    global calibrating
    global last_location_update
    global max_delta_time
    if(not calibrating):

        # Activate camera detection for aruco codes
        camera.search_qr()
        calibrating = True

    else:
        # request data from the arduino for rotation
        communication.request_rotation()

        # Now check if solutions are found in the last second
        if(camera.last_update > (time.time() * 1000) - 1000):
            
            solutions = camera.solutions

            # Check if rotations with the same time exists (atleast close)
            if(communication.arduino_values['rotation']['last_update']  >= camera.last_update - max_delta_time and communication.arduino_values['rotation']['last_update'] <= camera.last_update + max_delta_time):
                rotation = communication.arduino_values['rotation']['value']
                print(solutions)
            
                # Calculate the location of the robot 
                # TODO if multiple solutions calc average
                # TODO take average of min 3 solutions?
                for solution in solutions:
                    location = location_service.calculate_location_from_qr(id_locations[solution[0]], solution[1], camera.shape, rotation)
                
                # TODO heck if delta location is within the treshold
                print(' [INFO] Found new location: ' + str(location) + '\trotation: ' + str(rotation))

                # if Yes accept the new location as truth
                last_location_update = time.time() * 1000
                camera.stop_search()
                calibrating = False

            # TODO if No keep searching


def main():

    looper.append(camera.main_loop)
    looper.append(communication.main_loop)

    communication.init_arduino_conn()
    communication.init_api_conn()

    main_loop()


if __name__ == '__main__':
    main()




