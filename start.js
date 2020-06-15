//****various Linter configs****
// jshint esversion: 6
// jshint browser: true
// jshint node: true
// jshint -W097

let bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
const mongodb = require('mongodb');
const express = require('express');
const app = express();
//const assert =require('assert');
const port = 3000;

/**
*@function connectMongoDB
*@desc initializes the database
*/

async function connectMongoDB() {
    try {
        //connect to database server
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true });
        //connect do database "itemdn"
        app.locals.db = await app.locals.dbConnection.db("itemdb");
        console.log("Using db: " + app.locals.db.databaseName);

    }
    catch (error) {
        console.dir(error);
        setTimeout(connectMongoDb, 3000);
    }
}
//Start connecting
connectMongoDB();

app.use('/public', express.static(__dirname + '/public'));
app.use('/save-input', bodyParser.json());
app.use('/delete-input', bodyParser.json());
app.use('/update-input', bodyParser.json());
app.use('/item', bodyParser.json());
app.use ('/jquery', express.static (__dirname +'/node_modules/jquery/dist'));

//connects websites
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/mainIndex.html');
});
app.get('/linkedIndex.html', (req, res) => {
  res.sendFile(__dirname+'/linkedIndex.html');
});

//Returns all items stored in collection items
app.get("/item", (req,res) => {

    //Search for all items in mongodb
    app.locals.db.collection('items').find({}).toArray((error, result) => {
        if (error) {
            console.dir(error);
        }
        //console.log(result);
        res.json(result);

    });
});

// adds data to the database
app.post('/save-input', (req, res) => {
console.log("POST",req.body);
  app.locals.db.collection('items').insertOne(req.body);
});

// deletes data from the database
app.delete('/delete-input', (req, res)=> {
  //console.log(req.body._id);
  app.locals.db.collection('items').deleteOne({"_id":ObjectId(req.body._id)});
  });

// updates data of the database
app.put('/update-input',(req, res)=>{
  app.locals.db.collection('items').updateOne({"_id":ObjectId(req.body._id)},
                                              {$set:{['geometry.coordinates'] : [req.body.geometry.coordinates]}});
});

app.listen(port,
   () => console.log(`Example app
      listening at http://localhost:${port}`));
