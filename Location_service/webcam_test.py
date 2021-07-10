from __future__ import division
import cv2

# import cv2.aruco as aruco
import numpy as np
import math
import qrcode
import sys

if sys.version_info[0] == 3:
    from qrtools.qrtools import QR
else:
    from qrtools import QR
import itertools

calc_refresh_rate = 1

cap = cv2.VideoCapture(0)

height_irl_qr = 50
width_irl_qr = 50
focal_length = 4.76
sensor_height = 6

# Tunneling vars
object_linking_factor = 10
max_frames_skipped = 10

# define names of each possible ArUco tag OpenCV supports
ARUCO_DICT = {
    "DICT_4X4_50": cv2.aruco.DICT_4X4_50,
    "DICT_4X4_100": cv2.aruco.DICT_4X4_100,
    "DICT_4X4_250": cv2.aruco.DICT_4X4_250,
    "DICT_4X4_1000": cv2.aruco.DICT_4X4_1000,
    "DICT_5X5_50": cv2.aruco.DICT_5X5_50,
    "DICT_5X5_100": cv2.aruco.DICT_5X5_100,
    "DICT_5X5_250": cv2.aruco.DICT_5X5_250,
    "DICT_5X5_1000": cv2.aruco.DICT_5X5_1000,
    "DICT_6X6_50": cv2.aruco.DICT_6X6_50,
    "DICT_6X6_100": cv2.aruco.DICT_6X6_100,
    "DICT_6X6_250": cv2.aruco.DICT_6X6_250,
    "DICT_6X6_1000": cv2.aruco.DICT_6X6_1000,
    "DICT_7X7_50": cv2.aruco.DICT_7X7_50,
    "DICT_7X7_100": cv2.aruco.DICT_7X7_100,
    "DICT_7X7_250": cv2.aruco.DICT_7X7_250,
    "DICT_7X7_1000": cv2.aruco.DICT_7X7_1000,
    "DICT_ARUCO_ORIGINAL": cv2.aruco.DICT_ARUCO_ORIGINAL,
}

average_over_frames = 10


qr_locations = {
    0: (3000, 2000),
    1: (2650, 2000),
}

robot_rotation = 0  # Not able to do on webcam alone

pic_height = None

font = cv2.FONT_HERSHEY_SIMPLEX
fontScale = 2
fontColor = (0, 0, 255)
lineType = 1

map_width = 6000
map_height = 6000

layout = np.zeros((map_height, map_width, 3), np.uint8)
layout[:, :] = (255, 255, 255)


def ResizeWithAspectRatio(image, width=None, height=None, inter=cv2.INTER_AREA):
    dim = None
    (h, w) = image.shape[:2]

    if width is None and height is None:
        return image
    if width is None:
        r = height / float(h)
        dim = (int(w * r), height)
    else:
        r = width / float(w)
        dim = (width, int(h * r))

    return cv2.resize(image, dim, interpolation=inter)


def do_calculations(frame):
    def getAngle(a, b, c):
        ang = math.degrees(
            math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
        )
        return ang

    def add_angle(angle1, angle2):
        new_angle = angle1 + angle2
        if new_angle < 0:
            return 360 + new_angle
        if new_angle >= 360:
            return new_angle - 360
        else:
            return new_angle

    def calculate_location(solution):
        distance = calculate_distance(solution["h"])
        solution["distance"] = distance

        delta_px_center = solution["x"] - (pic_width / 2)
        delta_mm_center = (width_irl_qr / solution["h"]) * delta_px_center
        angle_multiplier = 1
        if delta_mm_center < 0:
            delta_mm_center = delta_mm_center * -1
            angle_multiplier = -1

        c = (0, 0)
        a = (0, delta_mm_center)
        b = (distance, 0)
        camera_angle_correction = getAngle(a, b, c) * angle_multiplier
        solution["camera_angle_correction"] = camera_angle_correction
        robot_sensor_angle = add_angle(camera_angle_correction, robot_rotation)
        mirror = False
        if robot_sensor_angle < 90:
            # robot is on bottom left
            x_multiplier = -1
            y_multiplier = 1
        elif robot_sensor_angle < 180:
            # robot is on top left
            x_multiplier = -1
            y_multiplier = -1
            mirror = True
        elif robot_sensor_angle < 270:
            # robot is on top right
            x_multiplier = 1
            y_multiplier = -1
        else:
            # robot is on bottom right
            x_multiplier = 1
            y_multiplier = 1
            mirror = True

        angle_b = robot_sensor_angle % 90

        angle_a = 90 - angle_b
        if mirror:
            side_x = math.cos(math.radians(angle_b)) * distance
            side_y = math.sin(math.radians(angle_b)) * distance
        else:
            side_y = math.cos(math.radians(angle_b)) * distance
            side_x = math.sin(math.radians(angle_b)) * distance
        # side_x = (distance * math.sin(math.radians(angle_b))/math.sin(math.radians(90)))
        # side_y = (distance * math.sin(math.radians(angle_a))/math.sin(math.radians(90)))

        side_x = side_x * x_multiplier
        side_y = side_y * y_multiplier
        location_robot = (
            solution["location_x"] + math.ceil(side_x),
            solution["location_y"] + math.ceil(side_y),
        )
        solution["location_robot"] = location_robot
        return solution

    # Load imgae, grayscale, Gaussian blur, Otsu's threshold
    image = frame
    pic_height, pic_width, channels = image.shape
    original = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (9, 9), 0)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Morph close
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    close = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

    # Find contours and filter for QR code
    cnts = cv2.findContours(close, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    possible_solutions = []
    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.1 * peri, True)
        x, y, w, h = cv2.boundingRect(approx)
        area = cv2.contourArea(c)
        ar = w / float(h)

        #
        # cv2.putText(image,'area: ' + str(area), (x, int(math.ceil(y - w * 0.15))), font, .005 * w + 1, fontColor, lineType)

        if len(approx) == 4 and area > 30 and (ar > 0.75 and ar < 1.3):
            # print('found solution')
            # print('area',area)
            # print('ar', ar)
            # print('')

            ROI = original[y : y + h, x : x + w]
            decode_a = y - 50
            if decode_a < 0:
                decode_a = 0
            decode_b = y + h + 50
            if decode_b > pic_height:
                decode_b = pic_height

            decode_c = x - 50
            if decode_c < 0:
                decode_c = 0
            decode_d = x + w + 50
            if decode_d > pic_width:
                decode_d = pic_width

            DECODE_ROI = original[decode_a:decode_b, decode_c:decode_d]
            possible_solutions.append(
                {
                    "approx": approx,
                    "area": area,
                    "ar": ar,
                    "img": ROI,
                    "decode_img": DECODE_ROI,
                    "x": x,
                    "y": y,
                    "w": w,
                    "h": h,
                }
            )

        # else:

        # if len(approx) == 4:
        #     print('area',area)
        #     print('ar', ar)
        #     print('')

    qr_solutions = []
    # check images for qr code
    for solution in possible_solutions:

        if solutions != None:
            # check last solutions for simulary solutions
            for last_solution in solutions:
                s1_area = solution.get("area")
                s1_x = solution.get("x")
                s1_y = solution.get("y")
                s2_area = last_solution.get("area")
                s2_x = last_solution.get("x")
                s2_y = last_solution.get("y")
                f = object_linking_factor

                if s1_area < s2_area + f * 10 and s1_area > s2_area + f * -10:
                    if s1_x < s2_x + f * 2 and s1_x > s2_x + f * -2:
                        if s1_y < s2_y + f * 2 and s1_y > s2_y + f * -2:
                            solution["id"] = last_solution["id"]
                            solution["type"] = "predicted"
                            solution["frames_skipped"] = 0
                            solution["location_x"] = last_solution["location_x"]
                            solution["location_y"] = last_solution["location_y"]

        (decoded_qr, type_qr) = decode_QR_code(solution["decode_img"])
        if decoded_qr != "NULL" and decoded_qr != None:

            if type_qr == "aruco":
                location = qr_locations.get(decoded_qr[0])
                solution["id"] = decoded_qr[0]
                solution["frames_skipped"] = 0
                solution["location_x"] = location[0]
                solution["location_y"] = location[1]
                solution["type"] = "calculated"

            elif type_qr == "qr":
                print("found a qr code: ", decoded_qr)

        if "type" in solution:

            qr_solutions.append(solution)

    qr_count = 0

    # calculate location robot from qr codes
    for solution in qr_solutions:
        qr_count = qr_count + 1

        solution = calculate_location(solution)
        # print(solution.get('id'), solution.get('distance'), solution.get('h'), pic_height)
        location_robot = solution["location_robot"]

        # cv2.circle(layout, (int(location_robot[0]), int(location_robot[1])), 50, (255,0,0), 20)
        # cv2.line(layout, (int(location_robot[0]), int(location_robot[1])), (solution['location_x'], solution['location_y']), (0,0,255))

        #  print chosen qr code
        save_string = "QR" + str(qr_count) + ".png"

        camera_angle_correction = solution["camera_angle_correction"]
    #     cv2.putText(layout,'Angle camera correction: ' + str(camera_angle_correction), (solution['location_x'] + 300, solution['location_y']), font, 2, (0,0,0), lineType)
    #     cv2.putText(layout, 'distance: ' + str(solution['distance']), (solution['location_x'] + 300, solution['location_y'] + 100), font, 2, (0,0,0), lineType)

    # cv2.line(image, (int(math.ceil(pic_width/2)), 0), (int(math.ceil(pic_width/2)), pic_height),(255,0,12))

    # Add cached solutions if not over max skipped frames
    if solutions != None:
        for cached_solution in solutions:
            exists = False
            if cached_solution.get("frames_skipped") < max_frames_skipped:
                for solution in qr_solutions:
                    if solution.get("id") == cached_solution.get("id"):
                        exists = True
                if not exists:
                    cached_solution["frames_skipped"] = (
                        cached_solution.get("frames_skipped") + 1
                    )
                    cached_solution["type"] = "cached"
                    qr_solutions.append(cached_solution)

    return qr_solutions, possible_solutions


# MAIN LOOP
refresh_counter = 0
solutions = None
possible_solutions = None
original_layout = layout.copy()
total_solutions = []

solutions = {}

while True:

    average_over_frames = average_over_frames + 1
    layout = original_layout.copy()

    # Capture frame-by-frame
    ret, frame = cap.read()

    if pic_height == None:
        pic_height, pic_width, channels = frame.shape

    to_remove = []
    for id in solutions:
        if solutions[id]["frames_skipped"] == 10:
            to_remove.append(id)
        else:
            solutions[id]["frames_skipped"] += 1
            solutions[id]["type"] = "cached"

    for id in to_remove:
        solutions.pop(id)

    arucoParams = cv2.aruco.DetectorParameters_create()
    (corners, ids, rejected) = cv2.aruco.detectMarkers(
        frame,
        cv2.aruco.Dictionary_get(ARUCO_DICT["DICT_4X4_100"]),
        parameters=arucoParams,
    )

    if type(ids) is not type(None):
        for square, id in zip(corners, ids):
            solutions[id[0]] = {
                "rect": (
                    (int(square[0][0][0]), int(square[0][0][1])),
                    (int(square[0][2][0]), int(square[0][2][1])),
                ),
                "frames_skipped": 0,
                "type": "calc",
            }

    if type(rejected) is not type(None):
        for square in rejected:

            rect = (
                (int(square[0][0][0]), int(square[0][0][1])),
                (int(square[0][2][0]), int(square[0][2][1])),
            )
            cv2.rectangle(frame, rect[0], rect[1], (130, 0, 130), 3)
            for id in solutions:
                if solutions[id]["frames_skipped"] > 0:
                    x = np.array(
                        [
                            np.concatenate((rect)),
                            np.concatenate((solutions[id]["rect"])),
                        ]
                    )
                    diffs = np.diff(x, axis=0)

                    deltaRect = np.sum(np.absolute(diffs))

                    if deltaRect < 30:
                        solutions[id] = {
                            "rect": rect,
                            "frames_skipped": 0,
                            "type": "pred",
                        }

    # solutions, possible_solutions = do_calculations(frame)
    # total_solutions = total_solutions.append(solutions)

    # if(average_over_frames == average_over_frames):
    #     layout = draw_layout(layout, solutions)
    #     average_over_frames = 0
    #     total_solutions = []

    # if(solutions != None or possible_solutions != None):
    #     frame = draw_mask(frame, solutions, possible_solutions)

    def calculate_distance(qr_height):
        distance = (focal_length * height_irl_qr * pic_height) / (
            qr_height * sensor_height
        )
        return distance

    def getAngle(a, b, c):
        ang = math.degrees(
            math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
        )
        return ang

    def add_angle(angle1, angle2):
        new_angle = angle1 + angle2
        if new_angle < 0:
            return 360 + new_angle
        if new_angle >= 360:
            return new_angle - 360
        else:
            return new_angle

    # this might be better to calculate outside this script and only give back camera_correction and distance per qr
    def calculate_location(camera_angle_correction, distance, robot_rotation):
        robot_sensor_angle = add_angle(camera_angle_correction, robot_rotation)
        mirror = False
        if robot_sensor_angle < 90:
            # robot is on bottom left
            x_multiplier = -1
            y_multiplier = 1
        elif robot_sensor_angle < 180:
            # robot is on top left
            x_multiplier = -1
            y_multiplier = -1
            mirror = True
        elif robot_sensor_angle < 270:
            # robot is on top right
            x_multiplier = 1
            y_multiplier = -1
        else:
            # robot is on bottom right
            x_multiplier = 1
            y_multiplier = 1
            mirror = True

        angle_b = robot_sensor_angle % 90

        angle_a = 90 - angle_b
        if mirror:
            side_x = math.cos(math.radians(angle_b)) * distance
            side_y = math.sin(math.radians(angle_b)) * distance
        else:
            side_y = math.cos(math.radians(angle_b)) * distance
            side_x = math.sin(math.radians(angle_b)) * distance
        # side_x = (distance * math.sin(math.radians(angle_b))/math.sin(math.radians(90)))
        # side_y = (distance * math.sin(math.radians(angle_a))/math.sin(math.radians(90)))

        side_x = side_x * x_multiplier
        side_y = side_y * y_multiplier
        location_robot = (
            math.ceil(side_x),
            math.ceil(side_y),
        )
        return location_robot

    def calculate_angle_correction(rect):

        delta_px_center = (rect[0][0] + (rect[1][0] - rect[0][0]) / 2) - (pic_width / 2)
        delta_mm_center = (width_irl_qr / (rect[1][1] - rect[0][1])) * delta_px_center
        angle_multiplier = 1
        if delta_mm_center < 0:
            delta_mm_center = delta_mm_center * -1
            angle_multiplier = -1

        c = (0, 0)
        a = (0, delta_mm_center)
        b = (distance, 0)
        camera_angle_correction = getAngle(a, b, c) * angle_multiplier

        return camera_angle_correction

    for id in solutions:
        robot_rotation = 0
        distance = calculate_distance(
            solutions[id]["rect"][1][1] - solutions[id]["rect"][0][1]
        )
        solutions[id]["distance"] = distance
        camera_angle_correction = calculate_angle_correction(solutions[id]["rect"])
        solutions[id]["camera_angle_correction"] = calculate_angle_correction
        delta_location = calculate_location(
            camera_angle_correction, distance, robot_rotation
        )
        solutions[id]["delta_location"] = delta_location

    for id in solutions:
        solution = solutions[id]
        if solution["type"] == "calc":
            cv2.rectangle(
                frame, solution["rect"][0], solution["rect"][1], (13, 230, 30), 3
            )
            cv2.putText(
                frame,
                str(id),
                (solution["rect"][0][0], solution["rect"][0][1] - 10),
                font,
                0.005 * (solution["rect"][1][1] - solution["rect"][0][1]) + 0.3,
                fontColor,
                lineType,
            )
            cv2.putText(
                frame,
                str(solution["distance"]),
                (solution["rect"][0][0], solution["rect"][0][1] - 10),
                font,
                0.005 * (solution["rect"][1][1] - solution["rect"][0][1]) + 0.3,
                fontColor,
                lineType,
            )

        elif solution["type"] == "pred":
            cv2.rectangle(
                frame, solution["rect"][0], solution["rect"][1], (130, 0, 130), 3
            )
            cv2.putText(
                frame,
                str(id),
                (solution["rect"][0][0], solution["rect"][0][1] - 10),
                font,
                0.005 * (solution["rect"][1][1] - solution["rect"][0][1]) + 0.3,
                fontColor,
                lineType,
            )

    # Display the resulting frame
    cv2.imshow("frame", frame)
    # cv2.imshow('layout', layout)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
