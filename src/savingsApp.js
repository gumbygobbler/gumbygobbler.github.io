const BASELINE130 = 400;
const MININDAY = 96;
const SUMMERSTART = 6;
const WINTERSTART = 12;
const pricesBelow = 0.452;
const pricesAbove = 0.570;

// function getEnergyPlan(planName) {
//     let timeIntervals = []; //array containing time intervals in hours for determining price. weekdays then weekends if applicable
//     let pricesBelow = [];    //arrays containing prices below and above 130. summers then winters if applicable
//     let pricesAbove = [];
    
//     if (planName == "DR") {
//         timeIntervals = 24;
//         pricesBelow = 0.452;
//         pricesAbove = 0.570;
//     }
//     else if(planName == 'TOU-DR1') {
//         timeIntervals = [[6, 16, 21, 24], [14, 16, 21, 24]];
//         pricesBelow = [[0.355, 0.520, 0.833, 0.520], [0.527, 0.552, 0.636, 0.552]];
//         pricesAbove = [[0.472, 0.637, 0.950, 0.637], [0.644, 0.669, 0.753, 0.669]];
//     }
//     else if(planName == 'TOU-DR2') {
//         timeIntervals = [16, 21, 24];
//         pricesBelow = [[0.449, 0.840, 0.449], [0.540, 0.636, 0.540]];
//         pricesAbove = [[0.566, 0.957, 0.566], [0.657, 0.753, 0.657]];
//     }
//     return(timeIntervals, pricesBelow, pricesAbove);
// }

function getPricesFromMonth(monthData, currentDate) {

    let totalNRG, 
    cost, 
    fromBaseline, 
    dailyNRG, 
    dailyCost, 
    yesterdayNRG, 
    yesterdayCost, 
    weeklyNRG, 
    weeklyCost = 0;

    //getting amount of days already spent in month
    let days = parseInt(currentDate.substring(3));

    //get total amount of energy spent up until today
    for(let i = 0; i < (days * MININDAY); ++i) {
        totalNRG = totalNRG + monthData[i];
    }
    fromBaseline = BASELINE130 - totalNRG;
    
    //get total amount of energy spent today
    for(let i = monthData.length; i > (monthData.length - MININDAY); i--) {
        dailyNRG = dailyNRG + monthData[i];
    }

    //get total amount of energy spent yesterday
    for(let i = (monthData.length - MININDAY); i > (monthData.length - (MININDAY * 2)); i--) {
        yesterdayNRG = yesterdayNRG + monthData[i];
    }   

    //get total amount of energy spent this week
    for(let i = (monthData.length); i > (monthData.length - (MININDAY * 7)); i--) {
        weeklyNRG = weeklyNRG + monthData[i];
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
        totalNRG,     
        cost,            
        fromBaseline, 
        dailyNRG,    
        dailyCost,   
        yesterdayNRG,    
        yesterdayCost,     
        weeklyNRG,    
        weeklyCost]);      
}

function editPage(applianceType, data, currentDate, username) {
    
    let dataPackages = [];
    
    for(let i = 0; i < (applianceType.length) - 2; ++i) {
        dataPackages.push(getPricesFromMonth(data[i][7], currentDate));
    }
    
    //first, configure topbox
    let gridIndex = applianceType.indexOf("grid");
    let gridData = data[gridIndex];

    let totalNRG = gridData[0];     
    let cost = gridData[1];
    let fromBaseline = gridData[2];
    let dailyNRG = gridData[3];   
    let dailyCost = gridData[4];  
    let yesterdayNRG = gridData[5];  
    let yesterdayCost = gridData[6];
    let weeklyNRG = gridData[7];
    let weeklyCost = gridData[8];
    
    let dayComparison = "";
    let difference = 0;
    let differencePercentage = "";
    if (dailyNRG > yesterdayNRG) {
        dayComparison = "higher than";
        difference = ((dailyNRG / yesterdayNRG) - 1) * 100;
        differencePercentage = difference.toString() + "%";
    }
    else if (dailyNRG < yesterdayNRG) {
        dayComparison = "lower than"
        difference = (1 - (dailyNRG / yesterdayNRG)) * 100;
        differencePercentage = difference.toString() + "%";
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

    let firstBox = document.getElementById(topBox);
    firstBox.innerHTML = (
        "Hello " + username + "\n" +"Your total energy usage today was " + dailyNRG + 
        " kWh, which cost you $" + dailyCost + ".\n" + "This was " + differencePercentage + 
        " " + dayComparison + "yesterday's usage, which was " + yesterdayNRG + "kWh.\n" + 
        passedBaseline + "Top three appliances by energy usage today:\n" + "1. " 
    ) 
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
})