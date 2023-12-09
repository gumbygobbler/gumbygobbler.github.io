//initialization of express, cors, mongodb, and port
const PORT = 8000;
const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const uri = "mongodb+srv://devAccess:cantLoseThisAgain@clustersdge.td7vftc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
let userID = "203";
const homes = client.db("Homes");
//will eventually need to read things from loginServer once this or that is ported to other

const minInDay = 96;
const dayInMonth = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 30]
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

//queries entire data of user from their id
async function queryUser(userID) {
  try {
      specUser = homes.collection(userID);
      let result = await specUser.find().toArray();
      return result;
    } finally {
      await client.close();
  }
}

//gets daily data, unedited
function getDailyData(appliance) {
    return appliance.slice(appliance.length - minInDay);
}

//takes daily data and takes most recent month's worth of data
function sliceDataByMonth(applianceDailyValues) {
  return applianceDailyValues.slice(applianceDailyValues.length - 31);
}

function sliceDataByHalfYear(applianceWeeklyValues) {
  return applianceWeeklyValues.slice(applianceWeeklyValues.length - 26);
}

//gets dates
function getDates(dbdoc) {
  let dateArray = [];

  for (let i = 1; i < dbdoc.length; i += minInDay) {
    let data = Object.values(dbdoc[i])[2]
    data = data.substring(5,10);
    dateArray.push(data);
  }

  return dateArray;
}  

//gets times
function getTimes(dbdoc) {
  let slice = dbdoc.slice(dbdoc.length - minInDay);
  let timeArray = [];

  for (let i = 0; i < minInDay; ++i) {
    time = Object.values(slice[i])[2];
    time = time.substring(11, 16)
    
    if (time.substring(0,2) == '00')
      time = '12:' + time.substring(3,5) + ' AM'
    else if (time.substring(0,2) == '12')
      time = '12:' + time.substring(3,5) + ' PM'
    else if(parseInt(time.substring(0,2)) > 12) {
      time = (parseInt(time.substring(0,2)) - 12).toString() + time.substring(2)
    }
    timeArray.push(time)
  }

  return timeArray
}

//package all the above compiled data
function makeDataPackage(appliance) {
  let dailyAverages = getDailyAverages(appliance);
  let dailyPeaks = getDailyPeaks(appliance);
  let weeklyAverages = getWeeklyAverages(dailyAverages);
  let weeklyPeaks = getWeeklyPeaks(dailyPeaks);
  let monthlyAverages = getMonthlyAverages(dailyAverages);
  let monthlyPeaks = getMonthlyPeaks(dailyAverages);
  let dailyData = getDailyData(appliance);

  dailyAverages = sliceDataByMonth(dailyAverages);
  dailyPeaks = sliceDataByMonth(dailyPeaks);
  weeklyAverages = sliceDataByHalfYear(weeklyAverages);
  weeklyPeaks = sliceDataByHalfYear(weeklyPeaks);


  return ([dailyData, dailyAverages, dailyPeaks, weeklyAverages, weeklyPeaks, monthlyAverages, monthlyPeaks]);
}

//extracts data from the document sent by Mongodb into a more usable form
function parseData(dbdoc, applianceIndex) {
  let applianceValues = []
  for (let i = 1; i < dbdoc.length; ++i) {
    applianceValues.push(Object.values(dbdoc[i])[applianceIndex]);
  }

  return applianceValues;
}

//gets appliance types
function getApplianceTypes(dbdoc) {
  return Object.keys(dbdoc[1]).slice(3);
}

//get name of user
function getName(dbdoc) {
  const name = Object.values(dbdoc[0])[1] + " " + Object.values(dbdoc[0])[2];
  return name;
}
//runs the top level program
async function main() {   
  //after login, have a loading wheel while stuff loads
  let rawData = await queryUser(userID).catch(console.dir);

  
  let applianceTypes = getApplianceTypes(rawData);
  let dataPackages = [];
  let dates = getDates(rawData);
  let times = getTimes(rawData);
  let username = getName(rawData);
  
  for (let i = 0; i < applianceTypes.length; ++i) {
  
    let applianceValues = parseData(rawData, i + 3);
    let dataPackage = makeDataPackage(applianceValues);
    dataPackages.push(dataPackage);
  }

  console.log("data compiled")
  
  app.get('/data', function(req, res) {
  
    res.send([username, applianceTypes, dates, times, dataPackages])
    //at this point, data sent is like this:
    //[name, [appliance types], [dates], times], [data Packages]]
    // in [data Packages], [[data Package], [data Package], [data Package], ...]
    // in [data Package], [[DD], [DA], [DP], [WA], [WP], [MA], [MP]]
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
  app.listen(PORT);

}

main();




 
