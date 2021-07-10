from __future__ import division
import cv2
import numpy as np
import math
import sys
import itertools

from camera.qr_detection.detection_strategies.detect_aruco import DetectAruco


class QrDetector:

    def __init__(self, detection_strategy='aruco', tunnel_factor=1, tunnel_frames=10):
        self.tunnel_factor = tunnel_factor
        self.tunnel_frames = tunnel_frames
        self.cached_solutions = []
        self.cache_guard = []
        if(detection_strategy == 'aruco'):
            self.strategy = DetectAruco("DICT_6X6_50")


    # Check a frame for qr code
    def check(self, frame):

        pic_height, pic_width, channels = frame.shape

        
        found, rejected = self.strategy.detect(frame)
        cached = self.cached_solutions

        # Get cached_solutions with found
        values_found = map(lambda f: f[0], found)
        cached = filter(lambda s: s[0] not in values_found, cached)

        # Get cached_solutions that match with rejected within tunnel parameters
        tunnel_solutions = filter(lambda x: self.is_tunnel(x, cached), rejected)
        values_found = values_found + map(lambda x: x[0], tunnel_solutions)
        cached = filter(lambda x: x not in values_found, cached)

        # Create solutions
        solutions = found + tunnel_solutions

        # Update cached_solutions with new solutions and add counter to old
        self.cache_guard = map(self.update_cache_guard, cached)
        to_remove = filter(lambda x: x[1] >= self.tunnel_frames, self.cache_guard)
        self.cache_guard = filter(lambda x: x[1] < self.tunnel_frames, self.cache_guard)
        self.cache_guard = self.cache_guard + map(lambda x: [x[0], 1], solutions)
        self.cached_solutions = filter(lambda x: x[0] not in map(lambda y: y[0], to_remove), self.cached_solutions) + solutions


        # Return new and tunnel solutions
        return solutions

 
    def update_cache_guard(self, cache):
        guard = filter(lambda y: y[0] == cache[0], self.cache_guard)[0]
        if guard:
            guard[1] += 1
            return guard
        else:
            return [cache[0], 1]


    def is_tunnel(self, solution, cached):
        return False











    



    


# define names of each possible ArUco tag OpenCV supports



