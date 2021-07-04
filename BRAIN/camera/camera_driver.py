import cv2
import multiprocessing
from camera.qr_detection.qrdetector import QrDetector
import math
from datetime import datetime
from multiprocessing import Process
import time

# Process start and loop defenition

def start_camera(conn, camera):
    cap = cv2.VideoCapture(camera)
    qr_detector = QrDetector()

    # First read to calculate shape of frame
    ret, frame = cap.read()
    conn.send(['shape', frame.shape])

    active = False
    alive = True
    while alive:
        ret, frame = cap.read()
        if(active):
           
            if(type(frame) != type(None)):

                # Get the solutions from frame
                solutions = qr_detector.check(frame)
                pic_height, pic_width, channels = frame.shape
                

            if(len(solutions) != 0):

                conn.send(['solutions', solutions, time.time() * 1000])
            
            if(stop_time < time.time() * 1000):
                active = False

        # Check if data is available from process
        if(conn.poll()):
            data = conn.recv()
            if(data == 0):
                # Clean up
                alive = False
            elif(data[0] == 'start'):
                active = True
                stop_time = time.time() * 1000 + data[1]
            elif(data[0] == 'stop'):
                active = False

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break


class CameraDriver:
    def __init__(self, camera=1):
        self.shape = (0,0)
        self.solutions = []
        self.last_update = time.time()
        self.conn, child_conn = multiprocessing.Pipe()
        self.process =  Process(name='Camera ' + str(camera), target=start_camera, args=(child_conn, camera))
        self.process.deamon = True

        self.process.start()

    def main_loop(self):
        # Check for data from camera
        if(self.conn.poll()):
            data = self.conn.recv()
            if(data[0] == 'shape'):
                self.shape = data[1]
            elif(data[0] == 'solutions'):
                self.solutions = data[1]
                self.last_update = data[2]

    def search_qr(self, time=1000000):
        # Qr will stop after 10000 seconds wihtout other specified
        self.conn.send(['start', time])

    def stop_search(self):
        self.conn.send(['stop'])

    def onDestroy(self):
        self.conn.send(0)





    
    
    



        


