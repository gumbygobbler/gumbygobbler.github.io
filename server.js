const PORT = 8000;
const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// Replace the uri string with your connection string.
const uri = "mongodb+srv://devAccess:cantLoseThisAgain@clustersdge.td7vftc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);




async function run() {
    try {
    
        // Get the database and collection on which to run the operation
        const homes = client.db("Homes");
        const users = homes.collection("Users");
        // Query for a movie that has the title 'The Room'
        let specUser = await users.find({dataid: "203"}).toArray();
        // Print the document returned by findOne()
        
        const dataid = 5;
        specUser = homes.collection(Object.values(specUser[0])[dataid]);
        let result = await specUser.find({dataid: "203"}).toArray();
        for await (const doc of result) {
            console.log(doc);
          }
        return result;
      } finally {
        await client.close();
      }
    }

    
    
    async function main() {
       
      
      let userApps = await run().catch(console.dir);
      console.log(userApps);
      app.get('/', function(req, res) {
        res.send(userApps);
      });
      app.post('/', function(req, res) {
        const login = req.body;
        console.log(login);
        res.status(200).send({status : 'recieved'});
        
      })
      app.listen(PORT);



    }
    main();
    //THE START OF EXPRESS STUFF
    //app.METHOD(PATH, HANDLER)
    //app.get();
    //gets data from a certain resource or path
    //app.post();
    //adds data to a certain resource or path
    //app.put();
    //edits data from a certain resource or path
    //app.delete();
    //deletes data from a certain resource or path
    //PATH on server, which is defined by us
    //HANDLER is a callback function that gets executed when we visit the path

// app.get('/', function(req, res) {
//   res.json('testing');
// })





 