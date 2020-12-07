// init project
const { query } = require("express");
const express = require("express"); // the library we will use to handle requests
const mongodb = require("mongodb"); // load mongodb
const urls = require("url");

const port = 8080; // port to listen on

const app = express(); // instantiate express
app.use(require("cors")()); // allow Cross-domain requests
app.use(require("body-parser").json()); // automatically parses request data to JSON
app.use(express.urlencoded());


const uri = "mongodb+srv://atlasAdmin:Amakuru123@@cluster0.uw6oh.mongodb.net/companies?retryWrites=true&w=majority"; // put your URI HERE


mongodb.MongoClient.connect(uri, (err, db) => {
  // connect to our database
  const dbo = db.db("companies");
  const collection = dbo.collection("companies");

  // Responds to GET requests with the route parameter being the form.
  // Returns with the JSON data about the company (if company or ticker exist)
  app.get("/:company", (req, res) => {
    var qobj = urls.parse(req.url, true).query
    var querys;
    if (qobj.name != '') {
        //name query 
        querys = {name : qobj.name};
    } else if (qobj.ticker != '') {
        //ticker query
        querys = {ticker: qobj.ticker};
    } 
    // search the database (collection) for all users with the `user` field being the `user` route paramter
    collection.find(querys).toArray((err, docs) => {
      if (err) {
        // if an error happens
        res.send("Error in GET req.");
      } else {
        // if all works
        docs.forEach(function(item){
            res.send(item.name + " : " + item.ticker); // send back all users found with the matching username
        });
      }
    });
  });

  // Responds to POST requests with the route parameter being the username.
  // Creates a new user in the collection with the `user` parameter and the JSON sent with the req in the `body` property
  // Example request: https://mynodeserver.com/myNEWusername
//   app.post("/:user", (req, res) => {
//     // inserts a new document in the database (collection)
//     collection.insertOne(
//       { ...req.body, user: req.params.user }, // this is one object to insert. `requst.params` gets the url req parameters
//       (err, r) => {
//         if (err) {
//           res.send("Error in POST req.");
//         } else {
//           res.send("Information inserted");
//         }
//       }
//     );
//   });

  // this doesn't create a new user but rather updates an existing one by the user name
  // a request looks like this: `https://nodeserver.com/username23` plus the associated JSON data sent in
  // the `body` property of the PUT request
//   app.put("/:user", (req, res) => {
//     collection.find({ user: req.params.user }).toArray((err, docs) => {
//       if (err) {
//         // if and error occurs in finding a user to update
//         res.send("Error in PUT req.");
//       } else {
//         collection.updateOne(
//           { user: req.params.user }, // if the username is the same, update the user
//           { $set: { ...req.body, user: req.params.user } }, // update user data
//           (err, r) => {
//             if (err) {
//               // if error occurs in actually updating the data in the database
//               console.log("Error in updating database information");
//             } else {
//               // everything works! (hopefully)
//               res.send("Updated successfully");
//             }
//           }
//         );
//       }
//     });

//     // if someone goes to base route, send back they are home.
//     app.get("/", (req, res) => {
//       res.send("You are home 🏚.");
//     });
//   });

  // listen for requests
  var listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
});