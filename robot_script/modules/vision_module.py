import multiprocessing
import os
import logging
from time import time
from connection_method_mapper import *
import cv2 as cv

from detection_strategies.detect_aruco import DetectAruco
from configure_logging import configure_logging

fileName = os.path.basename(os.path.realpath(__file__))
logger = logging.getLogger(fileName.split(".")[0])

last_solutions = None
last_update = None
shape = None
process = None

def setup_camera(camera_number=0):
    global process
    conn, child_conn = multiprocessing.Pipe()
    add_function(conn, set_solutions, 'solutions')
    add_function(conn, set_shape, 'shape')
    process = multiprocessing.Process(name='Camera ' + str(camera_number), target=start_camera, args=(child_conn, camera_number))
    process.start()

def get_last_solutions():
    return last_solutions

def set_solutions(solutions, timestamp):
    global last_solutions
    global last_update
    last_solutions = solutions
    last_update = timestamp

def set_shape(s):
    global shape
    shape = s

def start_camera(conn, camera_number):
    configure_logging()
    logger.info('Starting camera %s', camera_number)

    strategy = DetectAruco("DICT_6X6_50")
    solutions_found = {}
    send_solutions = {}
    refresh_rate_send = .2 # seconds
    last_send = time()

    # Init camera
    cap = cv.VideoCapture(camera_number)
    
    if not cap.isOpened():
        logger.error('Camera %s cannot be opened', camera_number)
        return

    # get the shape to send to module
    ret, frame = cap.read()
    if not ret:
        logger.warn("Can't receive frame (stream end?). Exiting ...")
        return

    conn.send(['shape', [frame.shape]])

    while True:
        ret, frame = cap.read()
        # if frame is read correctly ret is True
        if not ret:
            logger.warn("Can't receive frame (stream end?). Exiting ...")
            break

        solutions = check_qr(strategy, frame)

        if(len(solutions) != 0):
            for solution in solutions:
                solutions_found[solution[0]] = {'last_update': time(), 'value': solution[1]}

        if(last_send < time() - refresh_rate_send):
            has_change = False
            solutions_changed_count = 0
            for key in solutions_found:
                solution = solutions_found[key]
                if(key in send_solutions and solution['last_update'] == send_solutions[key]['last_update']):
                    continue

                has_change = True
                solutions_changed_count += 1
                send_solutions[key] = solution

            if(has_change):
                logger.debug('Solutions changed sending to main thread - Count: %s', solutions_changed_count)
                conn.send(['solutions', [send_solutions, time()]])

        if cv.waitKey(1) == ord('q'):
            break


# Check a frame for qr code
def check_qr(strategy, frame):
    
    found, rejected = strategy.detect(frame)

    # Create solutions
    solutions = found

    return solutions

def on_shutdown():
    global process
    process.terminate()

def main():
    setup_camera()

if __name__ == '__main__':
    configure_logging()
    main()