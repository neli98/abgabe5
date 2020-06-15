
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

//________________________________________________________________________________________________________________________________
//###############################################################XMLHttpRequests##################################################


// global variables
var resource = "https://rest.busradar.conterra.de/prod/haltestellen";
var x = new XMLHttpRequest();
var pointCollection={};

busstops();


/**
*@function busstops
*@desc handling the XMLHttpRequest
*/
function busstops () {

  x.onload = loadcallback;
  x.onerror = errorcallback;
  x.onreadystatechange = statechangecallback;
  x.open("GET", resource, true);
  x.send();

}

/**
*@function statechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, transforming it into a JSON, calls startCalculation
*/
function statechangecallback() {
  if (x.status == "200" && x.readyState == 4) {

    pointCollection = x.responseText;
    pointCollection = JSON.parse(pointCollection);
    pointArray=pointCollection;
    console.log(pointCollection);

    if (document.getElementById('mapid')){
    mappingBusstops();}
  }
}

/**
*@function errorcallback
*@desc informs the User about an error
*/
function errorcallback(e) {
  document.getElementById("errors").innerHTML = "errorcallback: check web-console";
}

/**
*@function loadcallback
*@desc informs about an incorrect format in the console
*/
function loadcallback() {
  if(x.status!="200"){
    console.log(x.status);
  }
}

/**
*@function departureTimes
*@desc fetching the departure Json for the requested Busstop, next 15 min
*/

// global variables
var y = new XMLHttpRequest();
var departure;
var allDepartures=[];

function departureTimes (resultGeoCalc) {
    var departureLink = "https://rest.busradar.conterra.de/prod/haltestellen/" +resultGeoCalc + "/abfahrten?sekunden=900";

    y.onload = loadcallback2;
    y.onerror = errorcallback2;
    y.onreadystatechange = statechangecallback2;
    y.open("GET", departureLink, true);
    y.send();
}


/**
*@function statechangecallback2
*@desc checking if the XMLHttpRequest is in the correct form, transforming it into a JSON, calls unixConverter
*/

var departureArray=[];

function statechangecallback2 () {
  if (y.status == "200" && y.readyState == 4) {
    departure = y.responseText;
    console.log(y.responseText);

    departure=JSON.parse(departure);
    // creation of an array with all departure-JSON-objects
    for (var i = 0; i < departure.length; i++) {
      departureArray.push(departure[i]);
    }
    departure=departureArray;
    unixConverter(departure);

  }
}

/**
*@function errorcallback2
*@desc informs the User about an error
*/

function errorcallback2(e) {
    document.getElementById('error hints').innerHTML = "errorcallback: check web-console";
}

/**
*@function loadcallback2
*@desc informs about an incorrect format in the console
*/

function loadcallback2() {
    if(y.status!="200"){
    console.log(y.status);
  }}


//_______________________________________________________________________________________________________________________________
//################################################################Input Location#################################################
//

/**
*@function getLocation callback function
*@desc connected to browserLocation Button, asks for the Browser Location
*source: https://www.w3schools.com/html/html5_geolocation.asp
*/

function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    document.getElementById('browserLocation').innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  /**
  *@function showPosition callback function
  *@desc converts browser location into GeoJSON
  *source: https://www.w3schools.com/html/html5_geolocation.asp
  */
  function showPosition(position) {
    let userLocation = {"type":"FeatureCollection",
      "features":[
          {"type": "Feature",
          "geometry":{"type": "Point", "coordinates":[ position.coords.longitude, position.coords.latitude]},
          "properties":{}}]};
    JSON.parse('{"userLocation":true}');
    inputLocation=userLocation.features[0].geometry.coordinates;
    //document.getElementById('browserLocation').innerHTML=JSON.stringify(userLocation);
    console.log(userLocation);
  mappingLocation();
  }
