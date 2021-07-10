height_irl_qr = 50
width_irl_qr = 50
focal_length = 4.76
sensor_height = 6

import math


def calculate_angle_correction(rect, pic_width, distance):

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

def calculate_distance(qr_height, pic_height):
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
def calculate_location_from_qr(id_location, rect, shape, robot_rotation):
    pic_height, pic_width, bands = shape
    distance = calculate_distance(rect[0][1] - rect[1][1], pic_height)
    camera_angle_correction = calculate_angle_correction(rect, pic_width, distance)
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
        math.ceil(side_x) + id_location[0],
        math.ceil(side_y) + id_location[1],
    )
    return location_robot