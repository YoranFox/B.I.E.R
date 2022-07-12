import cv2.aruco as aruco
import cv2
import numpy as np
from utils import aruco_display
from utils import ARUCO_DICT 


class DetectAruco:
    def __init__(self, aruco_type):
        if aruco_type not in ARUCO_DICT:
            raise ValueError
        self.aruco_type = aruco_type
        self.aruco_params = aruco.DetectorParameters_create()


    # Detects the aruco codes and returns the possible and confirmed detections
    def detect(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        (corners, ids, rejected) = aruco.detectMarkers(gray, aruco.Dictionary_get(ARUCO_DICT[self.aruco_type]), parameters=self.aruco_params)

        # aruco_display(corners, ids, rejected, image)

        found = []
        if type(ids) is not type(None): 
            ids = map(lambda x: x[0], ids)
            corners = map(lambda x: x[0], corners)
            found = zip(ids, corners)
           
            # for c in corners:
                
            #     cv2.rectangle(image, (c[0][0], c[0][1]), (c[2][0], c[2][1]), (13, 230, 30), 3)


        if type(rejected) is not type(None):
            rejected = map(lambda x: x[0], rejected)

        cv2.imshow('aruco visualizer', image)
        return found, rejected


    def getType():
        return 'aruco'