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

//Creating Map with mapbox, center it to Münster
//source: https://leafletjs.com/examples/quick-start/
//######Please add your own accessToken########

var busstopInfos= [];
var basemap = L.map('mapid', {
  center:[51.96225013358843,7.62451171875],
  zoom:13});
var data = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
//#######please fill in your accessToken########################################
    accessToken: 'pk.eyJ1IjoibWE5ZGFsZW44IiwiYSI6ImNrYTZ4ZGdqNDBibWUyeHBuN3JmN2lrdDcifQ.SgZHAThfZLyx2Avk3th2Lg'
}).addTo(basemap);

/**
*@function mappingBusstops
*@desc creating for each point in the Busstop GeoJSON a circle on the map
*
*/

var allBusstops;
function mappingBusstops(){

 allBusstops=L.geoJSON(JSON.parse(x.responseText),{
  pointToLayer: function(features, latlng){
    return L.circle(latlng);
  },
  //creating popup with the BusstopId und Busstopname
  onEachFeature: function(feature, layer){
    departureTimeResults=feature.properties.nr;
    layer.bindPopup('<strong>'+feature.properties.lbez+'</strong> <br/>'+departureTimeResults );
    departureTimeResults=[];
  }
}).addTo(basemap).on('click', onClick); // eventlistener click on Circle event
}

/**
*@function onClick
*@desc waits for an click event, starts the departureTime Calculation for clicked Busstop
*/
var popup;
var busstopName;

function onClick(e){
  popup = e.latlng;
  var businfos= e.layer.getPopup();
  basemap.closePopup();

  businfos=businfos._content;
  // saving Popupinfos in variables
  var busstopId= businfos.slice(-7);
  busstopName= businfos.slice(0,-7);
  //console.log(busstopId);
  //console.log(busstopName);

  departureTimes(busstopId);
  busstopId='';

}

/**
*@function showingDatabaseContent
*@desc shows the MongoDB database content
*/

async function showingDatabaseContent(){
  let result =await promise();
  checkboxList(result);
}

/**
*@function promise
*@desc sends a request to the server via /item
*/

function promise(){

  return new Promise(function (res, req){
    $.ajax({
      url:"/item",
      success: function (result){res(result);},
      error: function (err) {console.log(err);}
    });
  });
}

/**
*@function checkboxList
*@desc creates a checkbox (radio button) list with all database objects and shows it on the main-webpage
*/

var datalength;
function checkboxList(result){
  datalength=result.length;
  //creates unordered radio button list with all elements of the database
  for(var i=0; i<result.length; i++){
    //console.log(result[i]);
    var ul = document.getElementById('ul');
    var li = document.createElement('li'+i);

    var checkbox = document.createElement('input');
    checkbox.type = "radio";
    checkbox.id = "checkboxid" + i;
    checkbox.value=JSON.stringify(result[i]);
    checkbox.name="location";
    //console.log(checkbox.name);

    //adds all elements to the website
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(JSON.stringify(result[i])));
    ul.appendChild(li);
    ul.appendChild(document.createElement("br"));
    ul.appendChild(document.createElement("br"));
  }
}

/**
*@function getValue
*@desc if necessary converts data of checked item to float values and calls startCalculation function
*/

function getValue(){
  var value=[];
  var databaseCoordinates;
  //saving the checked item in a variable
  for(var i =0; i<datalength;i++){
    if(document.getElementById("checkboxid"+i).checked){
      value=document.getElementById("checkboxid"+i).value;
      value=JSON.parse(value);
      databaseCoordinates=value.geometry.coordinates;

      //if the coordinates are a string--> transforms it to a float
      if(typeof databaseCoordinates[0] === "string"){

        databaseCoordinates=databaseCoordinates[0];
        databaseCoordinates=databaseCoordinates.split(',');
        parseFloat(databaseCoordinates[0]);
        parseFloat(databaseCoordinates[1]);
        inputLocation=databaseCoordinates;
        mappingUserInput(inputLocation);
        startCalculation();
    }
    else{
      inputLocation=value.geometry.coordinates;
       //console.log(inputLocation);
    startCalculation();
    mappingUserInput(inputLocation);
  }}

}
//console.log(document.getElementById("checkboxid1").checked);
}
/**
*@function mappingUserInput
*@desc displaying User Input address on the draw Map, Mapbox
*/
var inputMarker={};
var combinedConvertedAddress = [];
function mappingUserInput (convertedAdress){

  if (combinedConvertedAddress.length == 0) {
inputMarker.length=0;
inputMarker =L.marker([convertedAdress[1], convertedAdress [0]], {}).addTo(basemap);
console.log(inputMarker);
combinedConvertedAddress[0] = [convertedAdress[1], convertedAdress [0]];
console.log(combinedConvertedAddress);
}

else {
  combinedConvertedAddress[0].setMap(null);
  inputMarker.length=0;
  inputMarker =L.marker([convertedAdress[1], convertedAdress [0]], {}).addTo(basemap);
  console.log(inputMarker);
  combinedConvertedAddress [0] = [convertedAdress[1], convertedAdress [0]];
}

}
