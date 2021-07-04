from multiprocessing import Process
import multiprocessing
import os
import time
from calculations import location_robot

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
id_locations = {1: (3000, 3000), 2: (2800,3000), 3: (3000,3000)}


def init_process(instance, child_conn, args):
    instance(*args).start(child_conn)


# def create_process(name, instance, args=()):

#     # Define pipe for messaging to and from processes
#     conn, child_conn = multiprocessing.Pipe()

#     # Create process
#     process = Process(name=name, target=init_process, args=(instance, child_conn, args))
#     process.deamon = True

#     connections[name] = conn
#     process_values[name] = {}

#     return process



# portal queue only accepts data with form of: [queue, [data]]
def check_connections():
    for name, conn in connections.items():
        if(conn.poll()):
            data = conn.recv()
            process_values[data[0]] = (data[1], datetime.now())




def main_loop():
    last_update = None
    is_init = True
    while True:
        for loop in looper:
            loop()


        if(communication.arduino_active):
            is_init = False


        # Wait for all drivers and connecitons to be initialized
        if(not is_init):
            recalibrate()
        # if((time.time() * 1000) - last_location_update > 10000 ):
            


def live_location_calculations():
    camera.search_qr_live()





def recalibrate():
    global calibrating
    global last_location_update
    if(not calibrating):

        # Activate camera detection for aruco codes for 10 seconds
        camera.search_qr()
        calibrating = True

    else:
        # request data from the arduino for rotation
        communication.request_rotation()

        # Now check if solutions are found in the last second
        if(camera.last_update > (time.time() * 1000) - 1000):
            solutions = camera.solutions
            # print(communication.arduino_values['rotation']['last_update'])
            # Check if rotations with the same time exists (atleast close)
            if(communication.arduino_values['rotation']['last_update']  >= camera.last_update - 100 and communication.arduino_values['rotation']['last_update'] <= camera.last_update + 100):
                rotation = communication.arduino_values['rotation']['value']

            
                # Calculate the location of the robot
                for solution in solutions:
                    location = location_service.calculate_location_from_qr(id_locations[solution[0]], solution[1], camera.shape, rotation)
                
                # Check if delta location is within the treshold
                print(location)

                # if Yes accept the new location as truth
                last_location_update = time.time() * 1000
                camera.stop_search()
                calibrating = False

            # if No keep searching





if __name__ == '__main__':

    camera = CameraDriver()
    communication = CommunicationDriver()



    calibrating = False
    last_location_update = time.time()


    looper.append(camera.main_loop)
    looper.append(communication.main_loop)


    communication.init_arduino_conn()

    main_loop()




