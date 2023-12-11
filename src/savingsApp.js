const BASELINE130 = 400;
const MININDAY = 96;
const SUMMERSTART = 6;
const WINTERSTART = 12;
const pricesBelow = 0.452;
const pricesAbove = 0.570;

function readableName(dataName) { //weird issues with how theyre named in mongodb
    dataNames = ['air', 'air2', 'air3', 'airwindowunit1', 'aquarium1', 'bathroom1', 'bathroom2',
                    'bedroom1', 'bedroom2', 'bedroom3', 'bedroom4', 'bedroom5', 'battery1', 'car1', 'car2', 'circpump1', 
                    'clotheswasher1', 'clotheswasher_dryg', 'diningroom1', 'diningroom2', 'dishwasher',
                    'disposal1', 'drye1', 'dryg1', 'freezer1', 'furnace', 'furnace2', 'garage1', 'garage2', 
                    'grid', 'heater1', 'heater2', 'heater3', 'housefan1', 'icemaker1', 'jacuzzi1', 'kitchen1', 
                    'kitchen2', 'kitchenapp1', 'kitchenapp2', 'lights_plugs1', 'lights_plugs2', 
                    'lights_plugs3', 'lights_plugs4', 'lights_plugs5', 'lights_plugs6', 'livingroom1', 
                    'livingroom2', 'microwave', 'office1', 'outsidelights_plugs1', 
                    'outsidelights_plugs2', 'oven', 'oven2', 'pool1', 'pool2', 'poollight1', 'poolpump1', 
                    'pump1', 'range1', 'refrigerator', 'refrigerator2', 'security1', 'sewerpump1', 'shed1', 
                    'solar', 'solar2', 'sprinkler1', 'sumppump1', 'utilityroom1', 'venthood1', 'waterheater1', 
                    'waterheater2', 'winecooler1', 'wellpump1', 'leg1v', 'leg2v']

     readableNames = ['air compressor', 'second air compressor', 'third compressor', 'Window AC', 'aquarium', 'first bathroom', 'second bathroom',
                    'first bedroom', 'second bedroom', 'third bedroom', 'fourth bedroom', 'fifth bedroom', 'home battery', 'electric car charger', 'second electric car charger', 'circulating pump', 
                    'washing machine', 'washing machine and dryer', 'dining room', 'additional dining room circuit', 'dishwasher',
                    'garbage disposal', 'electric dryer', 'gas dryer', 'freezer', 'furnace', 'second furnace', 'garage', 'additional garage circuit', 
                    'the grid', 'heater', 'second heater', 'third heater', 'house fan', 'icemaker', 'jacuzzi', 'kitchen', 
                    'additional kitchen circuit', 'kitchen appliance', 'second kitchen appliance', 'light plugs', 'second set of light plugs', 
                    'third set of light plugs', 'fourth set of light plugs', 'fifth set of light plugs', 'sixth set of light plugs', 'living room', 
                    'additional living room circuit', 'microwave', 'office', 'outside light plugs', 
                    'second set of outside light plugs', 'oven', 'second oven', 'pool', 'second pool circuit', 'pool light', 'pool pump', 
                    'pump', 'kitchen range', 'refrigerator', 'second refrigerator', 'security system', 'sewer pump', 'shed', 
                    'solar system', 'second solar system', 'sprinkler', 'sump pump', 'utility room', 'vent hood', 'water heater', 
                    'second water heater', 'wine cooler', 'well pump', 'VOLTAGE1', 'VOLTAGE2']

    let i = dataNames.findIndex(name => name == dataName);
    return readableNames[i];
}

function nonEssentialAppliance(dataName) {
    dataNames = ['air', 'air2', 'air3', 'airwindowunit1', 'aquarium1', 'bathroom1', 'bathroom2',
                    'bedroom1', 'bedroom2', 'bedroom3', 'bedroom4', 'bedroom5', 'battery1', 'car1', 'car2', 'circpump1', 
                    'clotheswasher1', 'clotheswasher_dryg', 'diningroom1', 'diningroom2', 'dishwasher',
                    'disposal1', 'drye1', 'dryg1', 'freezer1', 'furnace', 'furnace2', 'garage1', 'garage2', 
                    'grid', 'heater1', 'heater2', 'heater3', 'housefan1', 'icemaker1', 'jacuzzi1', 'kitchen1', 
                    'kitchen2', 'kitchenapp1', 'kitchenapp2', 'lights_plugs1', 'lights_plugs2', 
                    'lights_plugs3', 'lights_plugs4', 'lights_plugs5', 'lights_plugs6', 'livingroom1', 
                    'livingroom2', 'microwave', 'office1', 'outsidelights_plugs1', 
                    'outsidelights_plugs2', 'oven', 'oven2', 'pool1', 'pool2', 'poollight1', 'poolpump1', 
                    'pump1', 'range1', 'refrigerator', 'refrigerator2', 'security1', 'sewerpump1', 'shed1', 
                    'solar', 'solar2', 'sprinkler1', 'sumppump1', 'utilityroom1', 'venthood1', 'waterheater1', 
                    'waterheater2', 'winecooler1', 'wellpump1', 'leg1v', 'leg2v']

    isEssentialAppliance = [false, false, false, false, true, false, false, false, false, false, false, false, true, true, true, 
                            true, true, true, false, false, true, true, true, true, true, true, true, false, false, true, true,
                            true, true, true, true, false, false, false, false, false, false, false, false, false, false, false,
                            false, false, false, false, false, false, true, true, true, true, false, true, true, true, true, true,
                            true, true, false, true, true, true, true, false, false, true, true, true, true, true, true]

    let i =  dataNames.indexOf(dataName);
    return isEssentialAppliance[i];
}

function detectOverPower(dailyValues) {
    //take average of daily value, compare with max of todays value, if average is over 50%,
    //could indicate wasting of energy.
    let average = 0;
    let peak = Math.max(...dailyValues);
    for(let i = 0; i < dailyValues.length; ++i) {
        average = average + dailyValues[i];
    }
    average = average / dailyValues.length;

    if ((average * 2) >= peak) {
        return true;
    }
    else {
        return false;
    }
}

function getPricesFromMonth(monthData, currentDate) {

    let totalNRG = 0,
    cost = 0, 
    fromBaseline = 0, 
    dailyNRG = 0, 
    dailyCost = 0, 
    yesterdayNRG = 0, 
    yesterdayCost = 0, 
    weeklyNRG = 0, 
    weeklyCost = 0;
    //getting amount of days already spent in month
    let days = parseInt(currentDate.substring(3));
    //get total amount of energy spent up until today
    for(let i = 0; i < (days * MININDAY); ++i) {
        totalNRG = totalNRG + parseFloat(monthData[i]);
    }
    fromBaseline = BASELINE130 - totalNRG;
    //get total amount of energy spent today
    for(let i = (monthData.length - 1); i > (monthData.length - MININDAY); i--) {
        dailyNRG = dailyNRG + parseFloat(monthData[i]);
    }

    //get total amount of energy spent yesterday
    for(let i = (monthData.length - MININDAY); i > (monthData.length - (MININDAY * 2)); i--) {
        yesterdayNRG = yesterdayNRG +parseFloat(monthData[i]);
    }   

    //get total amount of energy spent this week
    for(let i = (monthData.length - 1); i > (monthData.length - (MININDAY * 7)); i--) {
        weeklyNRG = weeklyNRG + parseFloat(monthData[i]);
    }  

    //get cost of energy
    if (totalNRG < BASELINE130) {
            cost = totalNRG * pricesBelow;
            dailyCost = dailyNRG * pricesBelow;
            yesterdayCost = yesterdayNRG * pricesBelow;
            weeklyCost = weeklyNRG * pricesBelow;
        }
    else if(totalNRG > BASELINE130) {
        cost = BASELINE130 * pricesBelow;
        cost += (totalNRG - BASELINE130) * pricesAbove;
        dailyCost = dailyNRG * pricesAbove;
        yesterdayCost = yesterdayNRG * pricesAbove;
        weeklyCost = weeklyNRG * pricesAbove;
    }
    
    return([
        totalNRG.toFixed(3),     
        cost.toFixed(2),            
        fromBaseline, 
        dailyNRG.toFixed(3),    
        dailyCost.toFixed(2),   
        yesterdayNRG.toFixed(3),    
        yesterdayCost.toFixed(2),     
        weeklyNRG.toFixed(3),    
        weeklyCost.toFixed(2)]);      
}

function editPage(applianceType, data, currentDate, username) {
    
    let dataPackages = [];
    let modAppliance = [...applianceType];
    modAppliance.pop();
    modAppliance.pop();
    
    for(let i = 0; i < (modAppliance.length); ++i) {
        dataPackages.push(getPricesFromMonth(data[i][7], currentDate));
    }

    let gridIndex = applianceType.indexOf("grid");
    let gridData = dataPackages.splice(gridIndex, 1)[0];
    let blah = modAppliance.splice(gridIndex, 1);

    let totalNRG = gridData[0];     
    let cost = gridData[1];
    let fromBaseline = gridData[2];
    let dailyNRG = gridData[3];   
    let dailyCost = gridData[4];  
    let yesterdayNRG = gridData[5];  
    
    let dayComparison = "";
    let difference = 0;
    let differencePercentage = "";
    if (dailyNRG > yesterdayNRG) {
        dayComparison = "higher than";
        difference = ((dailyNRG / yesterdayNRG) - 1) * 100;
        differencePercentage = difference.toFixed(2).toString() + "%";
    }
    else if (dailyNRG < yesterdayNRG) {
        dayComparison = "lower than"
        difference = (1 - (dailyNRG / yesterdayNRG)) * 100;
        differencePercentage = difference.toFixed(2).toString() + "%";
    }
    else {
        dayComparison = "the same as";
    }

    let passedBaseline = "";
    if(fromBaseline > 0) {
        passedBaseline = "You are " + fromBaseline + "kWh away from exceeding your baseline.\n"
    }
    else {
        passedBaseline = "You have exceeded the baseline. Please try to save energy next time.\n"
    }
    //find top three appliances
    let dailyApplianceNRGs=[];
    for (let i = 0; i < (dataPackages.length); i++) {
        dailyApplianceNRGs.push(dataPackages[i][3]);
    }

    let top = [];
    let topApps = [];
    
    for (let i = 0; i < 3; i++) {
        let max = Math.max(...dailyApplianceNRGs);
        let maxIndex = dailyApplianceNRGs.indexOf(max.toString());
        top.push(dailyApplianceNRGs.splice(maxIndex, 1));
        topApps.push(modAppliance.splice(maxIndex, 1));
    }

    document.getElementById("savingsText").innerHTML = username + "'s " + "Cost Metrics"
    let firstBox = document.getElementById("topBox");
    firstBox.innerHTML = (
        "Your total energy usage today was " + dailyNRG + " kWh, which cost you $" + dailyCost + 
        "." + "<br />" + "This was " + differencePercentage + " " + dayComparison +
        " yesterday's usage, which was " + yesterdayNRG + " kWh." + "<br />" +
        "Your total energy usage this this month is " + totalNRG + " kWh, and your current bill is $" +
        cost + "." + "<br />" + passedBaseline + "<br />" + "Top three appliances by energy usage today:" + 
        "<br />" + "1. " + readableName(topApps[0]) + ": " + top[0] + " kWh." + "<br />" + "2. " +
        readableName(topApps[1]) + ": " + top[1] + " kWh." + "<br />" + "3. " + readableName(topApps[2]) + 
        ": " + top[2] + " kWh."
    )

    //take care of second box
    //need weekly cost and weeklyNRG
    let weeklyApplianceNRGs=[];
    let weeklyApplianceCosts=[];
    for (let i = 0; i < (dataPackages.length); i++) {
        weeklyApplianceNRGs.push(dataPackages[i][7]);
        weeklyApplianceCosts.push(dataPackages[i][8]);
    }

    let topCosts = [];
    top = [];
    topApps = [];
    modAppliance = [...applianceType];
    modAppliance.pop();
    modAppliance.pop();
    blah = modAppliance.splice(gridIndex, 1);

    for (let i = 0; i < (dataPackages.length); i++) {
        let max = Math.max(...weeklyApplianceNRGs);
        let maxIndex = weeklyApplianceNRGs.indexOf(max.toString());
        top.push(weeklyApplianceNRGs.splice(maxIndex, 1));
        topCosts.push(weeklyApplianceCosts.splice(maxIndex, 1));
        topApps.push(modAppliance.splice(maxIndex, 1));
    }

    let secondBox = document.getElementById("Ranking");
    for (let i = 0; i < top.length; i++) {
        let entry = document.createElement('li')
        entry.appendChild(document.createTextNode(
            readableName(topApps[i]) + " used " + top[i] + " kWh and cost $" + topCosts[i]));
        entry.style.marginBottom = "2%";
        secondBox.appendChild(entry)
    }

    let nonEssentials = [];
    let nonEssentialsData = [];
    for(let i = 0; i < applianceType.length; i++) {
        if(!nonEssentialAppliance(applianceType[i])) {
            nonEssentials.push(applianceType[i]);
            nonEssentialsData.push(data[i][0])
        }
    }

    let excessAppliance = [];
    for(let i = 0; i < nonEssentials.length; i++) {
        if(detectOverPower(nonEssentialsData[i])) {
            excessAppliance.push(nonEssentials[i]);
        }
    }

    let thirdBox = document.getElementById("bottomBox");
    if (excessAppliance.length == 0) {
        thirdBox.innerHTML = (
            "No unnecessary devices/appliances are detected to be constantly on." + "<br />" +
            "You are being energy efficient. Keep up the good work!")
    }
    else {
        thirdBox.innerHTML = (
            "The devices/appliances below have been detected to be running longer than " 
            +"necessary. Please search the regions and consider turning off or unplugging any "
            +"devices you are currently not using."
        )
        let list = document.getElementById("bottomList");
        excessAppliance.forEach((appliance) => {
            let entry = document.createElement('li')
            entry.appendChild(document.createTextNode(readableName(appliance)))
            entry.style.marginBottom = "2%";
            list.appendChild(entry)
        })
    }
    

}
    

fetch("http://localhost:8000/data")
.then(response => response.json())
.then(data => {
    console.log("data read");
        username = data[0]
        applianceType = data[1];
        dates = data[2];
        times = data[3];
        dataPackages = data[4];
    })
    .then(itemOfInterest => {
        editPage(applianceType, dataPackages, dates[dates.length - 1], username)
})