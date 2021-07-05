# Importing Libraries
import serial
import time

class ArduinoSerial:

    def __init__(self, port):
        self.arduino = serial.Serial(port=port, baudrate=9600, timeout=.1)
        self.commands = []
        self.last_write = time.time() * 1000
    
    def main_loop(self):
        # send the commands every 2/10 second
        if(self.last_write < time.time() * 1000 - 200):
            for command in self.commands:
                self.arduino.write(command)
            self.commands = []
            self.last_write = time.time() * 1000 

    # Check if arduino has new data
    def hasData(self):
        return self.arduino.inWaiting() > 0

    # Read serial connection for new line
    def read(self):
        return self.arduino.readline()

    # Save command in array and check if no duplicates
    def write(self, data):
        if(not data + '\n' in self.commands):
            self.commands.append(data + '\n')
