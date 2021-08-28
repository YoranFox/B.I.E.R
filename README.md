# B.I.E.R
Beverage Infrastructure Extensible Robot

## About

B.I.E.R is a project to help further develop the automatization of home life. With the end goal being a self reliable robot with minimal setup required.

## Setup Development

Here are the steps required to create and run the development environment explained.

#### BRAIN

Make sure you have python 3.9 and python 2.7 installed.
- version 3.9: : https://www.python.org/downloads/
- version 2.7: https://www.python.org/downloads/release/python-2718/

```
py -2.7 install_packages.py
```

#### API

Api is created with the framework Nest.js [Nest.js](https://nestjs.com/).

Make sure you have Node Js installed with npm
https://nodejs.org/en/download/

Install the CLI for nestjs
```
npm i -g @nestjs/cli
```

Navigate to Api folder and run the following command in your terminal
```
npm install
```

##### How to run the api
- windows
```
npm run start:dev-windows
```

- linux
```
npm run start:dev-linux
```

#### Client App

App is created in [Angular](https://angular.io/).

In bier-app folder
```
npm install
```

##### How to run the app
In bier-app folder 
```
npm run start:dev
```
