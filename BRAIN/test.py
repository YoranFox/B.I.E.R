import serial
import time

arduino = serial.Serial(port='com3', baudrate=9600, timeout=.1)



while 1 :
    # get keyboard input
    input = raw_input(">> ")
        # Python 3 users
        # input = input(">> ")
    if input == 'exit':
        ser.close()
        exit()
    else:
        # send the character to the device
        # (note that I happend a \r\n carriage return and line feed to the characters - this is requested by my device)
        arduino.write(input + '\n')
        print(type(input))
        out = ''
        # let's wait one second before reading output (let's give device time to answer)
        time.sleep(2)
        while arduino.inWaiting() > 0:
            out += arduino.read(1)

        if out != '':
            print ">>" + out