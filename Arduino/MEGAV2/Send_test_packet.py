import serial
import LaunchBoxProtocol
import struct

#TODO make sure this list is always the same as the arduino list
COMMAND_SET_NEW_SPEED = 0x01  #id,int16_t

# ser = serial.Serial('/dev/ttyUSB0', 115200, serial.EIGHTBITS, serial.PARITY_NONE, serial.STOPBITS_ONE)
ser = serial.Serial('/dev/ttyUSB0', 115200)
ser.flushInput()
ser.flushOutput()

#init
data = None

def shutdown():
    if ser is not None:
        a = ser
        ser = None
        a.close()

#in the main

def send_packet_uint8_t(id,b1=0,b2=0,b3=0,b4=0):
    data = struct.pack(">BBBBB",id,b1,b2,b3,b4)

    com_pack = LaunchBoxProtocol.CommsPacketBuilder()
    com_pack.AddData(data)
    v = com_pack.GetPacket()
    if ser is not None:
        ser.write(v)

counter = 0
while (True):
    # Check if incoming bytes are waiting to be read from the serial input buffer.
    # NB: for PySerial v3.0 or later, use property `in_waiting` instead of function `inWaiting()` below!
    # source: https://stackoverflow.com/questions/17553543/pyserial-non-blocking-read-loop
    if ser.inWaiting() > 0:
        # read the bytes and convert from binary array to ASCII
        data_str = ser.read(ser.inWaiting()).decode('ascii')
        # print the incoming string without putting a new-line
        # ('\n') automatically after every print()
        print(data_str, end='')

    counter = counter+1
    if (counter == 100):
        counter = 0
        speed_counter += 1
        if speed_counter == 254:
            speed_counter = -254


        temp = struct.pack('>h', speed_counter)
        first, second = struct.unpack('>BB', temp)
        print(first)
        print(second)
        send_packet_uint8_t(COMMAND_SET_NEW_SPEED, first, second)
    # Put the rest of your code you want here


# Optional, but recommended: sleep 10 ms (0.01 sec) once per loop to let
# other threads on your PC run during this time.
time.sleep(0.01)

"""
for i in range(0, 50):
    data = ser.readline()
    if data:
        print(data)
print()
print("sending data")
print()

values = bytearray([0x55])
ser.write(values)

for i in range(0, 50):
    data = ser.readline()
    if data:
        print(data)

print()
print("sending data")
print()

values = bytearray([0x50])
ser.write(values)

while True:
    data = ser.readline()
    if data:
        print(data)
"""
