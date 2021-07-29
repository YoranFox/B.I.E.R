var secret = require('./secret')

var express = require('express');        
var app = express();                 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;  
const router = express.Router();


let demoLogger = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      current_datetime.getHours() +
      ":" +
      current_datetime.getMinutes() +
      ":" +
      current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    let log = `[${formatted_date}] ${method}:${url} ${status}`;
    console.log(log);
    next();
  };


  let authMiddelware = (req, res, next) => {
    console.log(req);
    // set the user if auth is present
    if(req.auth) {
    }
    console.log(secret)

    next();
  }


  router.use(demoLogger)
  router.use(authMiddelware)


// Status of the API
router.get('/status', function(req, res) {
    res.json({status:'ONLINE', message:'API is Online!'});   
});

// Map variables
router.get('/map', function(req, res) {
    res.json(
        { 
            status: 'COMPLETE', 
            acuro: {
                1: "3000,3000", 
                2: "2800,3000", 
                3: "3000,3000"
            },
            dimensions: "5000,5000",
            objects: {

            }
    });   
});

router.get('/commands', function(req, res) {
    res.json(
        {
            commands: {
            }
    });
});




app.use('/api', router);
app.listen(port, '0.0.0.0', function() {
    console.log('Listening to port:  ' + port);
});
