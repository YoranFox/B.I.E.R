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

class VisionModule:

    last_solutions = (0, 0)
    last_update = None

    def __init__(self):
        logger.info('Initializing vision module')
        

    def setup_camera(self, camera_number=0):
        self.conn, child_conn = multiprocessing.Pipe()
        add_function(self.conn, self.set_solutions, 'solutions')
        self.process =  multiprocessing.Process(name='Camera ' + str(camera_number), target=start_camera, args=(child_conn, camera_number))
        self.process.start()

    def get_last_solutions(self):
        return self.last_solutions

    def set_solutions(self, solutions, timestamp):
        self.last_solutions = solutions
        self.last_update = timestamp


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

def main():
    visionModule = VisionModule()

if __name__ == '__main__':
    configure_logging()
    main()