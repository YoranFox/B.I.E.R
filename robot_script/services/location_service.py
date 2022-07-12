height_irl_qr = 50
width_irl_qr = 50
focal_length = 3.8
sensor_height = 2.54

import math

def calculate_angle_correction(rect, pic_width, distance):

    half_qr_px = (rect[0][1] - rect[1][1]) / 2
    middle_qr_y = half_qr_px + rect[0][0]
    middle_qr_x = half_qr_px + rect[1][1]
    delta_px_center = middle_qr_y - (pic_width / 2)
    delta_mm_center = (width_irl_qr / (rect[0][1] - rect[1][1])) * delta_px_center
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

def calculate_delta_from_shape(rect, shape, robot_rotation):
    pic_height, pic_width, bands = shape
    distance = calculate_distance(int(rect[0][1] - rect[1][1]), int(pic_height))
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

    if mirror:
        side_x = math.cos(math.radians(angle_b)) * distance
        side_y = math.sin(math.radians(angle_b)) * distance
    else:
        side_y = math.cos(math.radians(angle_b)) * distance
        side_x = math.sin(math.radians(angle_b)) * distance

    side_x = side_x * x_multiplier
    side_y = side_y * y_multiplier
    delta_robot = (
        math.ceil(side_x),
        math.ceil(side_y),
    )
    return delta_robot

def calculate_location(delta_from_qr, qr_position):
    location_robot = (
        int(delta_from_qr[0] + qr_position[0]),
        int(delta_from_qr[1] + qr_position[1]),
    )

    return location_robot