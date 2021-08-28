# B.I.E.R
Beverage Infrastructure Extensible Robot

## About

B.I.E.R is a project to help further develop the automatization of home life. With the end goal being a self reliable robot with minimal setup required.

## Setup Development

Here the steps required to create the development environment are explained.

### Packages

This setup is for linux environment compatible with python 2 and 3.
It is possible to create one for windows but a lot more steps are required and only possible in python 2.

Modules installed via pip:

```
pip install numpy
pip install qrcode
pip install qrtools
pip install opencv-contrib-python (conda install opencv)
pip install zbar
```

You also need a working webcam for testing, it will auto detect of one is active.

#### BRAIN

Make sure you have python 3.9 and python 2.7 installed.
- version 3.9: : https://www.python.org/downloads/
- version 2.7: https://www.python.org/downloads/release/python-2718/

```
py -2.7 install_packages.py
```

#### API

Api is created with Express node js.

Make sure you have Node Js installed

Navigate to Api folder and run the following command in your terminal

```
npm install
```

##### windows
```
npm run start:sdk-windows
```

##### linux
```
npm run start:sdk-linux
```

#### Client App

App is created in [Angular](https://angular.io/).

In client folder
```
npm install
```

### Setup linux


