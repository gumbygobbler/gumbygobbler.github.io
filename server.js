const PORT = 8000;
const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// Replace the uri string with your connection string.
const uri = "mongodb+srv://devAccess:cantLoseThisAgain@clustersdge.td7vftc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
let userID = "203";
const homes = client.db("Homes");
//will eventually need to read things from loginServer once this or that is ported to other

    async function queryUser(userID) {
      try {
  
          specUser = homes.collection(userID);
          let result = await specUser.find().toArray();
          // for await (const doc of result) {
          //     console.log(doc);
          //   }
          return result;
        } finally {
          await client.close();
        }
      }
    
    async function main() {
       
      
  let userApps = await queryUser(userID).catch(console.dir);
      // dataID = Object.values(userApps[0])[5];
      
      // let userData = await queryData(dataID).catch(console.dir);
      
      app.get('/data', function(req, res) {
        res.send(userApps);
      });

      // app.get('/data', (req, res) => {
      //   res.send(userData);
      // });

      app.post('/', function(req, res) {
        const login = req.body;
        console.log(login);
        res.status(200).send({status : 'recieved'});
        
      })
      app.listen(PORT);



    }
    main();




 
