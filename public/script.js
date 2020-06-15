/**
*@author Cornelius Zerwas
*czerwas@uni-muenster.de
*matr.Nr.: 505591
*13.06.2020
*/
//****various Linter configs****
// jshint esversion: 6
// jshint browser: true
// jshint node: true
// jshint -W097


// global variables
var pointArray={};
var inputLocation={};


/**
*@function distanceCalculation
*@desc takes two coordinates and calculates the shortest distance between them; source: www.movable-type.co.uk/scripts/latlong.html
*@param start array [lon,lat]
*@param end array [lon,lat]
*@returns the distance in Km
*/
function distanceCalculation(start, end){
  //transforming into rad
  var lat= toRad(end[1]-start[1]);
  var lon= toRad(end[0]-start[0]);
  //distance Calculation in rad
  var distance= Math.sin(lat/2)*Math.sin(lat/2)+Math.cos(toRad(start[1]))*Math.cos(toRad(end[1]))*Math.sin(lon/2)*Math.sin(lon/2);
  var dist= 2*Math.atan2(Math.sqrt(distance),Math.sqrt (1-distance));
  var distKM= Math.abs(6371*dist);
  var roundedDist= distKM.toFixed(3);
  return roundedDist;
}

/**
*@function bearingCalculation
*@desc calculates the angle two coordinates have between them; source: www.movable-type.co.uk/scripts/latlong.html
*@param start array [lon,lat]
*@param end array [lon,lat]
*@returns bearing value in degrees
*/
function bearingCalculation (start, end){
  //transforming into rad
  var lat= toRad(end[1]-start[1]);
  var lon= toRad(end[0]-start[0]);
  //bearing Calculation
  var y= Math.sin(lon)*Math.cos(toRad(end[1]));
  var x = Math.cos(toRad(start[1]))*Math.sin(toRad(end[1]))-
          Math.sin(toRad(start[1]))*Math.cos(toRad(end[1]))*Math.cos(lon);
  var brng=toDegrees(Math.atan2(y,x));

  //transforming bearing to 0 till 360° instead of from -180 bis 180°
  if (brng<0){
        brng+=360;}

  var roundedBrng =brng.toFixed(2);
  return roundedBrng;
}

/**
*@function toRad
*@desc helping function converts degree into radians
*@returns the value in rad
*/
function toRad(value){
        return value * Math.PI / 180;
    }

/**
*@function toDegrees
*@desc helping function converts radian into degrees
*@returns the value in degrees
*/
function toDegrees(value){
  return value*(180/Math.PI);
}

function toJSONFeature(coordinateArray, propertiesObject={}){
var transformedJSON;
  if(coordinateArray.length==1){
     transformedJSON={"type": "Feature",
                          "geometry":{"type":"Point", "coordinates": coordinateArray},
                          "properties":propertiesObject};
    return transformedJSON;
}else{
  for (var i=0; coordinateArray.length<i; i++){
     transformedJSON={"type": "Feature",
                          "geometry":{"type":"Point", "coordinates": coordinateArray[i]},
                          "properties":propertiesObject};
    return transformedJSON;
  }
}
}

/**
*@function cardinalDirection
*@desc depending on the bearing angle, defines the belonging cardinal direction
*@param bearing in degrees 0 till 360°
*@returns cardinal direction depending on angle
*/

function cardinalDirection(bearing){
  // assing orientation to bearing (8 orientations)
  let orientation='';
  switch(true){
    case (bearing >= 0 && bearing < 22.5):
      orientation='N'; break;
    case  (bearing >= 22.5 && bearing < 67.5):
      orientation='NO'; break;
    case (bearing >= 67.5 && bearing < 112.5):
      orientation='O'; break;
    case (bearing >= 112.5 && bearing < 157.5):
      orientation='SO'; break;
    case (bearing >= 157.5 && bearing < 202.5):
      orientation='S'; break;
    case (bearing >= 202.5 && bearing < 247.5):
      orientation='SW'; break;
    case (bearing >= 247.5 && bearing < 292.5):
      orientation='W'; break;
    case (bearing >= 292.5 && bearing <337.5):
      orientation='NW'; break;
    case (bearing >= 337.5 && bearing < 360):
      orientation='N'; break;
    default:
    orientation=' direction not valid'; break; }

    return orientation;
}

/**
*@function unixConverter
*@desc if busconnections are available, the function transforms the unix time into readable time and prints it into the table in the html
*@desc source of time-conversion-function: https://www.w3resource.com/javascript-exercises/javascript-date-exercise-17.php
*@param depature is an object with information about the departure time, the busline, the final destination of the busline
*/
var departureTimeResults;
function unixConverter (departure) {
  var popupResults=[];
  console.log(departure);
  // checks if busconnection is available
  if (departure.length < 1){
  L.circle(popup,{
  })
  .addTo(basemap)
  .bindPopup("No busconnections in the next 15min").openPopup();
  }
  // unixConversion
  else {
    for (var i = 0; i < departure.length; i++){
    var dt = new Date(departure[i].abfahrtszeit*1000);
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();
    var time= hr+':' + m.substr(-2) + ':' + s.substr(-2);
    var depatures = i+'. departure';
    var busdirection=i+'. Busdirection';
    var busnumber=i+'. Busnumber';

    //popupResults.push([['Departure at: '+ time+'<br/>'],['Busnumber: ' + departure[i].linienid],[' Busdirection: '+ departure[i].richtungstext+ '<br/>']]);
    popupResults.push([[time],[departure[i].linienid],[departure[i].richtungstext]]);

  }
  departureTimeResults=popupResults;
  setResult(departureTimeResults);
  popupResults.length=0;

  }
}
/**
*@function setResult
*@desc creating a popup witth the departure Infos of the clicked Busstop
*/
function setResult(departureTimeResults){
  document.getElementById("busstop").innerHTML="<h3>"+busstopName+"</h3>";
  var resultTable=document.getElementById("resultTable");

  if (resultTable.rows.length >0 ){
    emptyTable();
  }

  for (var j = 0; j < departureTimeResults.length; j++) {
      var newRow = resultTable.insertRow(j + 1);
      var cel1 = newRow.insertCell(0);
      var cel2 = newRow.insertCell(1);
      var cel3 = newRow.insertCell(2);

      cel1.innerHTML = departureTimeResults[j][0];
      cel2.innerHTML = departureTimeResults[j][1];
      cel3.innerHTML = departureTimeResults[j][2];

    }

    departure.length=0;
    departureTimeResults.length=0;
    busstopName='';
}
 function emptyTable(){
   var tableHeaderRowCount = 1;
     var table = document.getElementById('resultTable');
     var rowCount = table.rows.length;
     for (var i = tableHeaderRowCount; i < rowCount; i++) {
       table.deleteRow(tableHeaderRowCount);
     }
 }

/**
*@function startCalculation
*@desc function call for calculationg, distance, bearing, cardinalDirection, departureTimes, fillWebsite
*/

let resultGeoCalc=[];
function startCalculation(){

  console.log(pointArray);
  console.log(inputLocation);
    var lengthJSON= pointArray.features;
    for (let i=0; i<lengthJSON.length; i++){

    let resultDistance= distanceCalculation(inputLocation, pointArray.features[i].geometry.coordinates);
    let resultBearing= bearingCalculation(inputLocation, pointArray.features[i].geometry.coordinates);
    let resultOrientation=cardinalDirection(resultBearing);
    resultGeoCalc.push([[resultDistance],[pointArray.features[i].properties.lbez],[pointArray.features[i].properties.nr],[resultBearing],[resultOrientation],[pointArray.features[i].geometry.coordinates]]);

    }
  resultGeoCalc.sort();
  resultGeoCalc = resultGeoCalc.slice(0,5);
  /*if (document.getElementById('mapid')){

    closestBusstops(resultGeoCalc);}
  else{*/
  fillWebsite (resultGeoCalc, departureTimeResults);
  //}
}

/**
*@function fillWebsite
*@desc prints all results into a html table: busstop details of all busstops are displayed, busconnection-information-cells of the busstops that are not calculated are filled with "not calculated"
*/

function fillWebsite (resultGeoCalc, departureTimeResults ){

  for (let j=0; j<resultGeoCalc.length; j++){
    document.getElementById("distance" + j).innerHTML = resultGeoCalc[j][0];
    document.getElementById("ID" + j).innerHTML = resultGeoCalc[j][1];
    document.getElementById("direction" + j).innerHTML = resultGeoCalc[j][3];
    document.getElementById("orientation" + j).innerHTML = resultGeoCalc[j][4];
  }
  resultGeoCalc.length=0;
}

//####################################Client - Server ##################################################################################################################################################
