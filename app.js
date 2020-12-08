// init project
const express = require("express"); // the library we will use to handle requests
const mongodb = require("mongodb"); // load mongodb
const urls = require("url");

const port = 5000; // port to listen on

const app = express(); // instantiate express
//app.use(require("cors")()); // allow Cross-domain requests
//app.use(require("body-parser").json()); // automatically parses request data to JSON
//app.use(express.urlencoded());


const uri = "mongodb+srv://atlasAdmin:Amakuru123@@cluster0.uw6oh.mongodb.net/companies?retryWrites=true&w=majority"; // put your URI HERE


mongodb.MongoClient.connect(uri, (err, db) => {
  // connect to our database
  const dbo = db.db("companies");
  const collection = dbo.collection("companies");

  // Responds to GET requests with the route parameter being the form.
  app.get("/:company", (req, res) => {
    var qobj = urls.parse(req.url, true).query
    var querys;
    if (qobj.name != '') {
        //name query 
        querys = {'name' : qobj.name};
    } else if (qobj.ticker != '') {
        //ticker query
        querys = {'ticker': qobj.ticker};
    } 
    // search the database (collection) for all users with the `user` field being the `user` route paramter
    collection.find(querys).toArray(async (err, docs) => {
      if (err) {
        // if an error happens
        res.send("Error in GET req.");
      } else {
        // if all works
        var results = "";
        await docs.forEach(function(item){
            results += item.name + " : " + item.ticker + "\n"; // send back all users found with the matching username
        });
        if (docs.length === 0) {
          results = "No Match Found!";
        }
        res.end(results);
      }
    });
  });

  // listen for requests
  var listener = app.listen(port, () => {
    console.log("This app is listening on port " + listener.address().port);
  });
});