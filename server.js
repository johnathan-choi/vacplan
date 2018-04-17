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
var dbconnect = mongoose.connect('mongodb://@ds247619.mlab.com:47619/vacplan', vacplandb).then(
    function(){ //success
        console.log("Connected to database.");
    }, 
    function(error){ //failure
        console.log("Cannot connect to database. Check credentials.");
        process.exit(1);
    }
);

// define & declare table schemae
var calSchema = new mongoose.Schema({
    date        : { //date in UNIX, unique index
        type        : Number, 
        index       : true,
        unique      : true },
    day         : Number,
    dayName     : String,
    month       : Number,
    monthName   : String,
    year        : Number,
    isHoliday   : Boolean,
    sLimit      : Number,
    sFilled     : Number,
    mLimit      : Number,
    mFilled     : Number
});
var Calendar = mongoose.model('calendar', calSchema, 'calendars');

function createCal(iYear){ // create one document per day in iYear for calendar collection
    //names of the week; months of the year
    var sDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];    
    var sMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    //Jan 1 and Dec 31, including daylight savings (GMT-8)
    var dStart = new Date(iYear+"-01-01").getTime()+(8*60*60*1000);
    var dEnd = new Date(iYear +"-12-31").getTime()+(8*60*60*1000);

    for (var d=dStart; d<=dEnd; d=d+(24*60*60*1000)){
        if(new Date(d).getDay()==0||new Date(d).getDay()==6){
            var bHoliday = true;
        }
        else{
            var bHoliday = false;
        }

        Calendar.create({
            date      : new Date(d),
            day       : new Date(d).getDate(),
            dayName   : sDay[new Date(d).getDay()],
            month     : new Date(d).getMonth()+1,
            monthName : sMonth[new Date(d).getMonth()],
            year      : new Date(d).getFullYear(),
            isHoliday : bHoliday,
            sLimit    : 0, //separate function to update limits
            sFilled   : 0,
            mLimit    : 0,
            mFilled   : 0
        });
    }
}
//createCal(2019); //blows up the collection. Use only when needed

app.listen(PORT);
console.log("App listening on port "+ PORT);