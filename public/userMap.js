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
/* source: http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html */

// creating a Mapbx Draw map
//source: https://leafletjs.com/examples/quick-start/
//http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html

//######please fill in your own acessToken##########
document.getElementById('updateButton').style.display='none';
var userCoordinates;
var property;
var map = L.map('userMap', {drawControl: false}).setView([51.96225013358843,7.62451171875], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
//#######please fill in your accessToken########################################
    accessToken: ''
     }).addTo(map);

// creating a Toolbar on the Mapboxmap only option to set a marker
     var drawnItems = new L.FeatureGroup();
     map.addLayer(drawnItems);
     var drawControl = new L.Control.Draw({
          draw:{
            polygon: false,
            polyline: false,
            line: false,
            circle: false,
            rectangle: false
          },
          edit: {
              featureGroup: drawnItems
          }
      });
      map.addControl(drawControl);
// saving marker position
      map.on('draw:created', function (e){

        var type = e.layerType,
        layer = e.layer;
        userCoordinates=(layer.getLatLng());
        if (type === 'marker') {
          map.on('click', function(e) {
       }),
       layer.bindPopup('Your chosen Location: '+ layer.getLatLng()).openPopup();}

       //if (inputMarker != undefined){inputMarker.remove();}
       inputMarker=drawnItems.addLayer(layer);
       inputLocation=[userCoordinates.lng, userCoordinates.lat];
       property={"kind_of_input":"marker"};
       toJSONFeature(inputLocation, property);
       //sendToDB(userCoordinates);

       console.log(inputLocation);

   });



var g = new XMLHttpRequest();
var convertedAdress=[];
var userLocationString=' ';
var inputMarker;

/**
*@function geocoding
*@desc converts an adress into Coordinates using mapBox and XMLHttpRequest
*/
//#####please fill in your own accessToken######################################

function geocoding(){

  var street=document.getElementById('street').value;
  var nr=document.getElementById('nr').value;
  var city=document.getElementById('city').value;
//#####your accessToken#########################################################
  var access_token="";

  userLocationString= street+ ' '+nr+ ' ,'+city;
  var resource ="https://api.mapbox.com/geocoding/v5/mapbox.places/"+ street+ "%20"+ nr +"%20" + city +".json?country=DE&access_token="+access_token;
  console.log(resource);
  if (inputMarker != undefined){inputMarker.remove();}
    g.onload = loadcallback;
    g.onerror = errorcallback;
    g.onreadystatechange = statechangecallback;
    g.open("GET", resource, true);
    g.send();

}

/**
*@function statechangecallback
*@desc checking if the XMLHttpRequest is in the correct form, calls mappingUserInput function
*/
function statechangecallback() {
  if (g.status == "200" && g.readyState == 4) {

    convertedAdress = g.responseText;
    console.log(convertedAdress);
    convertedAdress= JSON.parse(convertedAdress);
    console.log(convertedAdress.features[0].geometry.coordinates);
    convertedAdress=convertedAdress.features[0].geometry.coordinates;
    mappingUserInput();
    }
}

/**
*@function errorcallback
*@desc informs the User about an error
*/
function errorcallback(e) {
  document.getElementById("result").innerHTML = "errorcallback: check web-console";
}

/**
*@function loadcallback
*@desc informs about an incorrect format in the console
*/
function loadcallback() {
  if(g.status!="200"){
    console.log(g.status);
  }
}

/**
*@function mappingUserInput
*@desc displaying User Input adress on the draw Map, Mapbox
*/
var inputMarker;
function mappingUserInput (){
   inputMarker =L.marker([convertedAdress[1], convertedAdress [0]], {

  }).addTo(map);
inputMarker.bindPopup(userLocationString).openPopup();
inputLocation=[inputMarker._latlng.lng,inputMarker._latlng.lat];
property={"kind_of_input":"adress"};
toJSONFeature(inputLocation,property);
console.log(inputLocation);

}

/**
*@function mappingLocation
*@desc sets a maker to the Browser location, after Button is clicked
*/
function mappingLocation(){
  L.marker([inputLocation[1], inputLocation[0]], {

  }).addTo(map);
  property={"kind_of_input":"browser Location"};
  toJSONFeature(inputLocation,property);
}
//#########################################CRUD#################################

/**
*@function toJSONFeature
*@desc converts position data to JSON and sends a request to the server via /save-input
*@param coordinateArray contains the coordinates of the location data
*@param probertiesObject if defined contains the properties of the JSON object (here: how the coordinates were created)
*/

var transformedJSON;
function toJSONFeature(coordinateArray, propertiesObject={}){
  //console.log(coordinateArray.length);
  transformedJSON={"type": "Feature",
                          "geometry":{"type":"Point", "coordinates": coordinateArray},
                          "properties":propertiesObject};
  document.getElementById("result").innerHTML= JSON.stringify(transformedJSON);
  //console.log(transformedJSON);
  //Server request
  fetch('/save-input', {
    method: 'post',
    body: JSON.stringify(transformedJSON),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}


/**
*@function showingDatabaseContent
*@desc shows the MongoDB database content
*/

var length;
async function showingDatabaseContent(){

  let result =await promise();
  checkboxList(result);
  length=result.length;
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
*@desc creates a checkbox list with all database objects and shows it on the webpage
*@param result contains all database objects
*/

function checkboxList(result){
  document.getElementById('ul').innerHTML='';
  //creating a unordered  list with checkboxes containing all database objects
  for(var i=0; i<result.length; i++){
    var ul = document.getElementById('ul');
    var li = document.createElement('li'+i);

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = "checkboxid" + i;
    checkbox.value=JSON.stringify(result[i]);
    //adds all elements to the website
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(JSON.stringify(result[i]),'<br/>'));
    ul.appendChild(li);
    ul.appendChild(document.createElement("br"));
    ul.appendChild(document.createElement("br"));
  }
}

/**
*@function deleteItem
*@desc deletes checked items from the list and sends a request to the server via /delete-input to delete them from the database
*/

function deleteItem(){
  var value=[];
  var id=[];
  //console.log("test"+length);
  //checks which elements are checked
  for(var i =0; i<length;i++){
    if(document.getElementById("checkboxid"+i).checked){
      value=document.getElementById("checkboxid"+i).value;
      value=JSON.parse(value);
      id=value._id;
      //console.log(id);
      //server request - deleting checked item by _id
      fetch("/delete-input",{
        method:'delete',
        body: JSON.stringify(value),
        headers: {
          'Content-Type': 'application/json'}
        }).then(res=>{if (res.ok) return res.json();}).then(showingDatabaseContent()); //reloading database content

    }else{
      console.log(i);
      }
  }
}

/**
*@function updateItem
*@desc updates a checked item from the list
*/

var value=[];
function updateItem() {
  //creating textarea for editing coordinates
  var id=[];
  var textfield;
  var div=document.getElementById("updateTextarea");

  textfield=document.createElement("textarea");
  textfield.id='update';
  textfield.style.width='300px';

  //checks which elements are checked, if more than one is checked only the last object is taken
  for(var i =0; i<length;i++){
    if(document.getElementById("checkboxid"+i).checked){
      value=document.getElementById("checkboxid"+i).value;
      value=JSON.parse(value);
      id=value._id;
      //console.log(value);
      }
  }
  //adding elements to the website
  div.appendChild(textfield);
  document.getElementById('update').value=value.geometry.coordinates;
  document.getElementById('updateButton').style.display='block';
}


/**
*@function serverCall
*@desc sends a request to the server via /update-input to update the database
*/

function serverCall(){
  // console.log(document.getElementById('update').value);
  var updatedValue=document.getElementById('update').value;
  value.geometry.coordinates=updatedValue;
  // console.log(value);
  //server request- updating changed coordinates by _id
  fetch("/update-input",{
    method:'put',
    body: JSON.stringify(value),
    headers: {
      'Content-Type': 'application/json'}
    }).then(res=>{if (res.ok) return res.json();}).then(showingDatabaseContent());//reloads database content
    //location.reload();
}
