import cv2.aruco as aruco
import cv2 as cv
import numpy as np

# define names of each possible ArUco tag OpenCV supports
ARUCO_DICT = {
    "DICT_4X4_50": aruco.DICT_4X4_50,
    "DICT_4X4_100": aruco.DICT_4X4_100,
    "DICT_4X4_250": aruco.DICT_4X4_250,
    "DICT_4X4_1000": aruco.DICT_4X4_1000,
    "DICT_5X5_50": aruco.DICT_5X5_50,
    "DICT_5X5_100": aruco.DICT_5X5_100,
    "DICT_5X5_250": aruco.DICT_5X5_250,
    "DICT_5X5_1000": aruco.DICT_5X5_1000,
    "DICT_6X6_50": aruco.DICT_6X6_50,
    "DICT_6X6_100": aruco.DICT_6X6_100,
    "DICT_6X6_250": aruco.DICT_6X6_250,
    "DICT_6X6_1000": aruco.DICT_6X6_1000,
    "DICT_7X7_50": aruco.DICT_7X7_50,
    "DICT_7X7_100": aruco.DICT_7X7_100,
    "DICT_7X7_250": aruco.DICT_7X7_250,
    "DICT_7X7_1000": aruco.DICT_7X7_1000,
    "DICT_ARUCO_ORIGINAL": aruco.DICT_ARUCO_ORIGINAL,
}

locations = {
    1: (1000, 1000)
}


class DetectAruco:
    def __init__(self, aruco_type):
        if aruco_type not in ARUCO_DICT:
            raise ValueError
        self.aruco_type = aruco_type
        self.aruco_params = aruco.DetectorParameters_create()


    # Detects the aruco codes and returns the possible and confirmed detections
    def detect(self, image):
        gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
        (corners, ids, rejected) = aruco.detectMarkers(gray, aruco.Dictionary_get(ARUCO_DICT[self.aruco_type]), parameters=self.aruco_params)
        found = []
        if type(ids) is not type(None):
            ids = map(lambda x: x[0], ids)
            corners = map(lambda x: x[0], corners)
            
            found = zip(ids, corners)
            
            for solution in found:
                c = solution[1]
                (x1, y1) = (c[0][0], c[0][1])
                cv.rectangle(image, (x1, y1), (c[2][0], c[2][1]), (13, 230, 30), 3)
                text = "Id: " + str(solution[0]) + " | Location:  " + str(locations[solution[0]][0]) + "," + str(locations[solution[0]][1])
                cv.putText(image, text, (int(x1), int(y1)-70), cv.FONT_HERSHEY_SIMPLEX, .6, (36,255,12), 2)

        if type(rejected) is not type(None):
            rejected = map(lambda x: x[0], rejected)

        cv.imshow('aruco visualizer', image)
        return found, rejected


    def getType():
        return 'aruco'


strategy = DetectAruco("DICT_6X6_50")
cap = cv.VideoCapture(0)

while(True):

    

    ret, frame = cap.read()
    # if frame is read correctly ret is True
    if not ret:
        print('stopping')
        break

    solutions = strategy.detect(frame)

    if cv.waitKey(1) == ord('q'):
        break