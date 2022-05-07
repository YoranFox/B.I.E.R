import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

install('numpy')
install('qrcode')
install('qrtools')
install('pyserial')
install('opencv-contrib-python')
install('requests')
install('pathlib')
install('async-timeout')