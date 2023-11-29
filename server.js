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

const minInDay = 96;
const dayInMonth = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
//have index start at one essentially

//takes data, sends array of daily averages
function getDailyAverages(dataArray) {
  let holdingArray = [];
  let daySum = 0;
  let j = 0;
  for (let i = 0; i < dataArray.length; ++ i) {
      daySum += parseFloat(dataArray[i]);
      ++j;
      if (j == minInDay) {
          j = 0;
          daySum /= minInDay;
          holdingArray.push(daySum);
          daySum = 0;
      }
  }
  return holdingArray;
}

//takes data, returns daily peaks
function getDailyPeaks(dataArray) {
  let holdingArray = [];
  let dayMax = 0;
  let j = 0;
  for (let i = 0; i < dataArray.length; ++ i) {
      dayMax = Math.max(parseFloat(dataArray[i]), dayMax);
      ++j;
      if (j == minInDay) {
          j = 0;
          holdingArray.push(dayMax);
          dayMax = 0;
          
      }
  }
  return holdingArray;
}

//takes data, returns weekly average
function getWeeklyAverages(dataArray) {
  let holdingArray = [];
  let weekSum = 0;
  let j = 0;
  for (let i = 0; i < dataArray.length; ++ i) {
      weekSum += parseFloat(dataArray[i]);
      ++j;
      if (j == 7) {
          j = 0;
          weekSum /= 7;
          holdingArray.push(weekSum);
          weekSum = 0;
          
      }
  }
  return holdingArray;
}

//takes data, returns weekly peaks
function getWeeklyPeaks(dataArray) {
  let holdingArray = [];
  let weekMax = 0;
  let j = 0;
  for (let i = 0; i < dataArray.length; ++ i) {
      weekMax = Math.max(parseFloat(dataArray[i]), weekMax);
      ++j;
      if (j == 7) {
          j = 0;
          holdingArray.push(weekMax);
          weekMax = 0;
          
      }
  }
  return holdingArray;
}

//takes data, returns monthly averages
function getMonthlyAverages(dataArray) {
  let holdingArray = [];
  let monthSum = 0;
  let j = 0;
  let k = 1;
  for (let i = 0; i < dataArray.length; ++ i) {
      monthSum += parseFloat(dataArray[i]);
      ++j;
      if (j == dayInMonth[k]) {
          j = 0;
          monthSum /= dayInMonth[k];
          holdingArray.push(monthSum);
          monthSum = 0;
          k++;
      }
  }
  return holdingArray;
}

//takes data, returns monthly peaks
function getMonthlyPeaks(dataArray) {
  let holdingArray = [];
  let monthMax = 0;
  let j = 0;
  let k = 1;
  for (let i = 0; i < dataArray.length; ++ i) {
    monthMax = Math.max(parseFloat(dataArray[i]), monthMax);
      ++j;
      if (j == dayInMonth[k]) {
          j = 0;
          holdingArray.push(monthMax);
          monthMax = 0;
          k++;
      }
  }
  return holdingArray;
}

async function queryUser(userID) {
    try {
        specUser = homes.collection(userID);
        let result = await specUser.find().toArray();
        return result;
      } finally {
        await client.close();
    }
  }

  function makeDataPackage(appliance) {
    let dailyAverages = getDailyAverages(appliance);
    let dailyPeaks = getDailyPeaks(appliance);
    let weeklyAverages = getWeeklyAverages(dailyAverages);
    let weeklyPeaks = getWeeklyPeaks(dailyPeaks);
    let monthlyAverages = getMonthlyAverages(dailyAverages);
    let monthlyPeaks = getMonthlyPeaks(dailyAverages);

    console.log("data calculated")
    return ([dailyAverages, dailyPeaks, weeklyAverages, weeklyPeaks, monthlyAverages, monthlyPeaks]);
  }

  function parseData(dbdoc, applianceIndex) {
    console.log(dbdoc.length)
    let applianceValues = []
    for (let i = 1; i < dbdoc.length; ++i) {
      applianceValues.push(Object.values(dbdoc[i])[applianceIndex]);
    }
    return applianceValues;

  }

  function getApplianceTypes(dbdoc) {
    return Object.keys(dbdoc[1]).slice(3);
  }


  async function main() {   
    //after login, have a loading page while data is calculated
    let rawData = await queryUser(userID).catch(console.dir);

    
    let applianceTypes = getApplianceTypes(rawData);
    let dataPackages = [];
    for (let i = 0; i < applianceTypes.length; ++i) {

      let applianceValues = parseData(rawData, i + 3);
      let dataPackage = makeDataPackage(applianceValues);
      dataPackages.push(dataPackage);
    }
    
    app.get('/data', function(req, res) {
      
      res.send([applianceTypes, dataPackages])
      //at this point, data sent is like this:
      //[[appliance types], [data Packages]]
      // in [data Packages], [[data Package], [data Package], [data Package], ...]
      // in [data Package], [[DA], [DP], [WA], [WP], [MA], [MP]]
      // data package is aligned with order of appliance types
      // to access 1 appliance type: [0][i]
      // to access 1 specific data package: [1][i]
      // to access 1 specific stack of data: [1][i][j]
      // to access 1 specific data point: [1][i][j][k]
    });

    app.post('/', function(req, res) {
      const login = req.body;
      console.log(login);
      res.status(200).send({status : 'recieved'});
    })
    console.log("listening on port 8000");
    console.log(Object.values(rawData[1]))
    app.listen(PORT);

    }

    main();




 
