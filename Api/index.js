var express = require('express');        
var app = express();                 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;  
const router = express.Router();


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
