from __future__ import division
import cv2
import numpy as np
import math
import sys
import qrcode
from qrtools import QR
import seaborn as sn



print (sys.argv)

image_url = sys.argv[1]


height_irl_qr = 20
width_irl_qr = 20
focal_length = 4.76
sensor_height = 6

robot_rotation = 0

qr_map_location = (3000,3000)
pic_height = None

font = cv2.FONT_HERSHEY_SIMPLEX
fontScale = 2
fontColor = (255,255,255)
lineType = 2

map_width = 6000
map_height = 6000

layout = np.zeros((map_height,map_width,3), np.uint8)
layout[:,:] = (255,255,255)
cv2.circle(layout, qr_map_location, 50, (0,0,0),10)




def getAngle(a, b, c):
    ang = math.degrees(math.atan2(c[1]-b[1], c[0]-b[0]) - math.atan2(a[1]-b[1], a[0]-b[0]))
    return ang

def calculate_distance(qr_height):
    distance = (focal_length * height_irl_qr * pic_height)/(qr_height * sensor_height)
    return distance

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

def add_angle(angle1, angle2):
    new_angle = angle1 + angle2
    if(new_angle < 0):
        return 360 + new_angle
    if(new_angle >= 360):
        return new_angle - 360
    else:
        return new_angle

def decode_QR_code(image):
    cv2.imwrite('testing_qr.png', image)
    qr = QR()
    qr.decode('testing_qr.png')
    print(qr.data)
    return qr.data
    # barcodes = pyzbar.decode(image)
    # barcode_info = barcodes[0].data.decode('utf-8')
    # return barcode_info

def calculate_location(solution):
    distance = calculate_distance(solution['h'])
    solution['distance'] = distance
    print('distance of the object is', distance)
    ROIS = ResizeWithAspectRatio(ROI, height=500)
    cv2.imshow('ROI', ROIS)
    cv2.putText(image,'Distance: ' + str(distance), (50, 100), font, fontScale, fontColor, lineType)

    delta_px_center = solution['x'] - (pic_width / 2)
    delta_mm_center = (width_irl_qr / solution['h']) * delta_px_center
    angle_multiplier = 1
    if(delta_mm_center < 0):
        delta_mm_center = delta_mm_center * -1
        angle_multiplier = -1
 
    c = (0,0)
    a = (0, delta_mm_center)
    b = (distance, 0)
    camera_angle_correction = getAngle(a, b, c) * angle_multiplier
    solution['camera_angle_correction'] = camera_angle_correction
    robot_sensor_angle = add_angle(camera_angle_correction, robot_rotation)
    mirror = False
    if(robot_sensor_angle < 90):
        # robot is on bottom left
        print('bottom left')
        x_multiplier = -1
        y_multiplier = 1
    elif(robot_sensor_angle < 180):
        # robot is on top left
        print('top left')
        x_multiplier = -1
        y_multiplier = -1
        mirror = True
    elif(robot_sensor_angle < 270):
        # robot is on top right
        print('top right')
        x_multiplier = 1
        y_multiplier = -1
    else:
        # robot is on bottom right
        print('bottom right')
        x_multiplier = 1
        y_multiplier = 1
        mirror = True

    angle_b = robot_sensor_angle % 90

    print('angle camera correction', camera_angle_correction)
    print('angle b', angle_b)
    print('')

    angle_a = 90 - angle_b
    if(mirror):
        side_x = math.cos(math.radians(angle_b)) * distance
        side_y = math.sin(math.radians(angle_b)) * distance
    else:
        side_y = math.cos(math.radians(angle_b)) * distance
        side_x = math.sin(math.radians(angle_b)) * distance
    # side_x = (distance * math.sin(math.radians(angle_b))/math.sin(math.radians(90)))
    # side_y = (distance * math.sin(math.radians(angle_a))/math.sin(math.radians(90)))

    side_x  = side_x * x_multiplier
    side_y = side_y * y_multiplier
    print('side_x',side_x)
    print('side_y',side_y)
    location_robot = (solution['location_x'] + math.ceil(side_x), solution['location_y'] + math.ceil(side_y))
    solution['location_robot'] = location_robot
    return solution


# Load imgae, grayscale, Gaussian blur, Otsu's threshold
image = cv2.imread(image_url)
pic_height, pic_width, channels = image.shape
original = image.copy()
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (9,9), 0)
thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

# Morph close
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
close = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

# Find contours and filter for QR code
cnts = cv2.findContours(close, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnts = cnts[0] if len(cnts) == 2 else cnts[1]
possible_solutions = []
for c in cnts:
    peri = cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, 0.1 * peri, True)
    x,y,w,h = cv2.boundingRect(approx)
    area = cv2.contourArea(c)
    ar = w / float(h)
    print('ar',ar)
    print('area',area)
    print('')
    cv2.rectangle(image, (x, y), (x + w, y + h), (36,0,255), 3)

    if len(approx) == 4 and area > 400 and (ar > .7 and ar < 1.3):
        print('found solution')
        print('area',area)
        print('ar', ar)
        print('')

        
        cv2.rectangle(image, (x, y), (x + w, y + h), (36,255,12), 3)
        ROI = original[y:y+h, x:x+w]

        decode_a = y - 50
        if(decode_a < 0):
            decode_a = 0
        decode_b = y+h + 50
        if(decode_b > pic_height):
            decode_b = pic_height

        decode_c = x -50
        if(decode_c < 0):
            decode_c = 0
        decode_d = x+w+50
        if(decode_d > pic_width):
            decode_d = pic_width

        DECODE_ROI = original[decode_a:decode_b, decode_c:decode_d]
        possible_solutions.append({'approx': approx, 'area': area, 'ar': ar, 'img':ROI, 'decode_img': DECODE_ROI, 'x': x, 'y':y, 'w':w, 'h': h})
        
        
    # else:
        # cv2.rectangle(image, (x, y), (x + w, y + h), (36,12,255), 3)
        # if len(approx) == 4:
        #     print('area',area)
        #     print('ar', ar)
        #     print('')
        
qr_solutions = []
qr_locations = {'WIFI:S:NETGEAR85;T:WPA2;P:icyballoon890;SN:58B90ABP00278;SK:R6260-100PES;MAC:9CC9EB501446;': (3000, 3000)}

# check images for qr code
for solution in possible_solutions:
    decoded_qr = decode_QR_code(solution['decode_img'])
    if(decoded_qr != 'NULL'):
        location = qr_locations.get(decoded_qr)
        solution['location_x'] = location[0]
        solution['location_y'] = location[1]
        qr_solutions.append(solution)

qr_count = 0

# calculate location robot from qr codes
for solution in qr_solutions:
    qr_count = qr_count + 1

    solution = calculate_location(solution)
    location_robot = solution['location_robot']

    print(location_robot)
    cv2.circle(layout, (int(location_robot[0]), int(location_robot[1])), 50, (255,0,0), 20)
    cv2.line(layout, (int(location_robot[0]), int(location_robot[1])), (solution['location_x'], solution['location_y']), (0,0,255))

    #  print chosen qr code
    save_string = 'QR' + str(qr_count) + '.png'
    cv2.imwrite(save_string, solution['img'])

    camera_angle_correction = solution['camera_angle_correction']
    cv2.putText(layout,'Angle camera correction: ' + str(camera_angle_correction), (solution['location_x'] + 300, solution['location_y']), font, 2, (0,0,0), lineType)
    cv2.putText(layout, 'distance: ' + str(solution['distance']), (solution['location_x'] + 300, solution['location_y'] + 100), font, 2, (0,0,0), lineType)

cv2.line(image, (int(math.ceil(pic_width/2)), 0), (int(math.ceil(pic_width/2)), pic_height),(255,0,12))    
   
threshS = ResizeWithAspectRatio(thresh, height=1000)
imageS = ResizeWithAspectRatio(image, height=1000)
closeS = ResizeWithAspectRatio(close, height=1000)
layoutS = ResizeWithAspectRatio(layout, height=1000)

cv2.imshow('thresh', threshS)
cv2.imshow('close', closeS)
cv2.imshow('image', imageS)
cv2.imshow('map', layoutS)

cv2.waitKey()    