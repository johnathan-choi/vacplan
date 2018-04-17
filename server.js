//server.js

const PORT = process.env.PORT || 8080;

var express  = require('express');
var app      = express();                   
var morgan = require('morgan');     
var mongoose = require('mongoose');                     // mongoose for mongodb        
var bodyParser = require('body-parser');    
var methodOverride = require('method-override'); 
var xlsx = require('xlsx');
var fileUpload = require('express-fileupload');
var fs = require('fs-extra');
var request = require('request');
var rp = require('request-promise');
var async = require('async');

//load credential files. All must be found
try{
    var vacplandb = require('./private/credentials/vacplandb.json');
}
catch(e){
    console.error("Unable to find one or more credential files. Exiting.");
    process.exit(1);
}

app.use(express.static(__dirname + '/public'));                 
app.use(morgan('dev'));                                         
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());
app.use(fileUpload());

function getDateTime(date, mode){ //turns dates legible
    var month = date.getMonth()+1;
        if (month - 10 < 0){
            month = "0" + month;
        }
    var day = date.getDate();
        if (day - 10 < 0){
            day = "0" + day;
        }
    var hours = date.getHours();
        if (hours - 10 < 0){
            hours = "0" + hours;
        }
    var minutes = date.getMinutes();
        if (minutes - 10 < 0){
            minutes = "0" + minutes;
        }
    if (mode == "date"){ // YYYY/MM/DD
        return date.getFullYear() + "/" + month + "/" + day;
    }
    else if (mode == "date-"){ // YYYY-MM-DD
        return date.getFullYear() + "-" + month + "-" + day;
    }
    else if (mode == "time"){ // HH:MM
        return hours + ":" + minutes;
    }
    else{ // YYYY/MM/DD HH:MM
        return date.getFullYear() + "/" + month + "/" + day + " " + hours + ":" + minutes;
    }
}

// Connect to MongoDB via Mongoose
var dbconnect = mongoose.connect('mongodb://@ds247619.mlab.com:47619/vacplan', vacplandb);

app.listen(PORT);
console.log("App listening on port "+ PORT);