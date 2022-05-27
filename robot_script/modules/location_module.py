# Map: [[]
import json
import logging
import os
import time
from cv2 import FILLED, log
import numpy as np
from services import location_service
import cv2 as cv

from modules import arduino_module as am
from modules import vision_module as vm

fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])



qr_locations = {
    3: (1000, 1000),
    1: (1300, 1000)
}
location = None
last_update = None

SOLUTIONS_RATE = .01
SOLUTIONS_TIMEOUT_CUTOFF = .1

last_used_arduino_state = None


def generate_map():
    global map
    map = np.zeros((300, 300))



def calculate_location():
    global location
    global last_update
    global last_used_arduino_state


    if(last_update and time.time() - last_update < SOLUTIONS_RATE):
        return

    arduino_state = am.arduino_state
    solutions = vm.get_last_solutions()

    if(arduino_state == None or solutions == None):
        return
    
    arduino_last_udpate = arduino_state['last_update']

    # Dont do calculation if latest arduino update is used again (should not happen but you know, just in case)
    if(last_used_arduino_state and arduino_last_udpate == last_used_arduino_state['last_update']):
        return

    old_solutions = solutions
    # Lets do a check on the time difference between the solution and arduino state
    solutions = dict(filter(lambda elem: time.time() - elem[1]['last_update'] < SOLUTIONS_TIMEOUT_CUTOFF, solutions.items()))

    if(len(solutions) == 0):
        return

    rotation = arduino_state['rotation']

    calculated_locations = []

    for qr_id in solutions:
        solution = solutions[qr_id]
        delta_location = location_service.calculate_delta_from_shape(solution['value'], vm.shape, rotation)
        qr_location = qr_locations[qr_id]
        calculated_locations.append((qr_id, location_service.calculate_location(delta_location, qr_location)))

    average_location = np.average(map(lambda x: x[1], calculated_locations), axis=0)
    average_location = (int(average_location[0]), int(average_location[1]))
    last_update = time.time()
    location = average_location

    last_used_arduino_state = arduino_state

    # Send to arduino
    am.connection.write_arduino_state(json.dumps({'location': location}))
    draw_solutions(old_solutions, solutions, calculated_locations)


def draw_solutions(all_solutions, current_solutions, calculated_locations):
    image_name = 'ROBOT LOCATION'
    cv.namedWindow(image_name)
    img = np.zeros([3000,3000,3],dtype=np.uint8)
    img.fill(255)

    TEXT_FACE = cv.FONT_HERSHEY_DUPLEX
    TEXT_SCALE = 1
    TEXT_THICKNESS = 1
 
    for solution in all_solutions:
        CENTER = qr_locations[solution]
        TEXT = str(solution)     
        text_size, _ = cv.getTextSize(TEXT, TEXT_FACE, TEXT_SCALE, TEXT_THICKNESS)
        cv.circle(img, CENTER, 20, (255,0,0), thickness=FILLED)
        text_origin = (CENTER[0] - text_size[0] / 2, CENTER[1] + text_size[1] / 2)
        cv.putText(img, TEXT, text_origin, TEXT_FACE, TEXT_SCALE, (127,255,127), TEXT_THICKNESS, cv.LINE_AA)
        

    for l in calculated_locations:
        CENTER = l[1]
        cv.circle(img, CENTER, 30, (0,255,255), thickness=FILLED)
        text_origin = (CENTER[0] - text_size[0] / 2, CENTER[1] + text_size[1] / 2)
        TEXT = str(l[0])     
        text_size, _ = cv.getTextSize(TEXT, TEXT_FACE, TEXT_SCALE, TEXT_THICKNESS)
        cv.putText(img, TEXT, text_origin, TEXT_FACE, TEXT_SCALE, (127,255,127), TEXT_THICKNESS, cv.LINE_AA)
        cv.line(img, qr_locations[l[0]], l[1], (0,0,0), 5)
        

    cv.circle(img, location, 50, (0,0,255), thickness=FILLED)

    width = 1200
    height = 1200
    resized_img = cv.resize(img, (width, height), interpolation= cv.INTER_LINEAR)
    cv.imshow(image_name, resized_img)

    if cv.waitKey(1) == ord('q'):
        return