// public/core.js

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

const monthName = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

var app = angular.module('vacplan', ['ngFileUpload']);


app.controller('indexPage', ['$scope', 'Upload', '$http', function($scope, Upload, $http){
    $scope.currTime = getDateTime(new Date());
    $scope.refreshCal = function(){
        $scope.getCal = monthName;
    };
    
    /*
        Getter function to retrieve all calendar dates
    */
    // $http.get('/api/calendar').then(function(response){
    //     angular.forEach(response.data, function(value, key){
    //         //hang on for now
    //     })
    // });
    
    $scope.getCal = monthName;

}]);