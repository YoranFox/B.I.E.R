height_irl_qr = 50
width_irl_qr = 50
focal_length = 3.8
sensor_height = 2.54

import math
import cv2.aruco as aruco
import cv2 as cv
import numpy as np

def calculate_angle_correction(rect, pic_width, distance, img):

    half_qr_px = (rect[0][1] - rect[1][1]) / 2
    middle_qr_y = half_qr_px + rect[0][0]
    middle_qr_x = half_qr_px + rect[1][1]
    delta_px_center = middle_qr_y - (pic_width / 2)
    delta_mm_center = (width_irl_qr / (rect[0][1] - rect[1][1])) * delta_px_center
    angle_multiplier = -1
    if delta_mm_center < 0:
        delta_mm_center = delta_mm_center * -1
        angle_multiplier = 1

    c = (0, 0)
    a = (0, delta_mm_center)
    b = (distance, 0)
    camera_angle_correction = getAngle(a, b, c) * angle_multiplier
    middle_qr_y = int(middle_qr_y)
    middle_qr_x = int(middle_qr_x)
    cv.line(img, (int((pic_width / 2)) + int(delta_px_center), middle_qr_x), (int(pic_width / 2), middle_qr_x), (0,0,0), 2)
    cv.line(img, (middle_qr_y, int(middle_qr_x - half_qr_px)), (middle_qr_y, int(middle_qr_x + half_qr_px)), (0,0,0), 2)

    return camera_angle_correction

def calculate_distance(qr_height, pic_height):
    top = focal_length * height_irl_qr * pic_height
    bot = qr_height * sensor_height
    distance = top / bot
    return distance

def getAngle(a, b, c):
    ang = math.degrees(
        math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
    )
    return ang


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
                pic_height, pic_width, bands = frame.shape
                distance = calculate_distance(int(c[0][1]) - int(c[1][1]), pic_height)
                delta_angle = calculate_angle_correction(c, pic_width, distance, image)
                (x1, y1) = (c[0][0], c[0][1])
                cv.rectangle(image, (x1, y1), (c[2][0], c[2][1]), (13, 230, 30), 3)
                text = "Id:  " + str(solution[0]) + " | Distance: " + str(distance)
                d = 1
                if(delta_angle < 0):
                    d = -1
                cv.putText(image, str(int(delta_angle)), (int(x1) + 70 * d, int(y1) - 20), cv.FONT_HERSHEY_SIMPLEX, .6, (36,255,12), 2)
                cv.putText(image, text, (int(x1), int(y1) - 70), cv.FONT_HERSHEY_SIMPLEX, .6, (36,255,12), 2)

        if type(rejected) is not type(None):
            rejected = map(lambda x: x[0], rejected)

        cv.imshow('aruco visualizer', image)
        return found, rejected


strategy = DetectAruco("DICT_6X6_50")
cap = cv.VideoCapture(1)

while(True):

    ret, frame = cap.read()
    # if frame is read correctly ret is True
    if not ret:
        print('stopping')
        break

    solutions = strategy.detect(frame)


    if cv.waitKey(1) == ord('q'):
        break



