import serial
#ser = serial.Serial('/dev/ttyUSB0', 115200, serial.EIGHTBITS, serial.PARITY_NONE, serial.STOPBITS_ONE)
ser = serial.Serial('/dev/ttyUSB0', 115200)
ser.flushInput()
ser.flushOutput()

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
