//this is the js file for an rpg game

let xp = 0; //use var to declare a variable
let health = 100; //apparently ; are unnecessary
let gold = 50; 
let currentWeapon = 0;
let fighting;
let monsterHealth;


//three ways to declare a variable in js: var, let, const
//var is more free in its use, can be function scoped or globally scoped
//can also be freely redefined
//let is block scoped, can be updated but not redefined
//const is a const variable
//let is preferred because you can declare it in multiple functions/blocks and those instances
//of those variables will only stay within those functions/blocks. If you were to use var,
//there could be issues where you accidently assign it in another function/block without knowing
// when trying to call it from the intended function/block, and this will cause bugs

let inventory = ["stick"]; // can use single or double or `
//create arrays by placing items in brackets

const button1 = document.querySelector("#button1");
//this takes input from the html element with id of button1 and 
//assigns it to variable button1. # operator specifies it as an id
//he Document method querySelector() returns the first Element within the document 
//that matches the specified selector, or group of selectors.
// If no matches are found, null is returned.
/*multi line comment*/
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
	{
		name: "stick",
		power: 5
	},
	{
		name: "dagger",
		power: 30
	},
	{
		name: "claw hammer",
		power: 50
	},
	{
		name: "sword",
		power: 100
	}
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
];

const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
		"button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
		"button functions": [buyHealth, buyWeapon, goTown],
		text: "You enter the store."
    },
    {
		name: "cave",
		"button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
		"button functions": [fightSlime, fightBeast, goTown],
		text: "You enter the cave. You see some monsters."
	},
    {
		name: "fight",
		"button text": ["Attack", "Dodge", "Run"],
		"button functions": [attack, dodge, goTown],
		text: "You are fighting a monster."
	},
    {
		name: "kill monster",
		"button text": ["Go to town square", "Go to town square", "Go to town square"],
		"button functions": [goTown, goTown, easterEgg],
		text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
        // can also escape quotes by having different quotes, such as using single quotes first
        //then using double quotes inside
	},
    {
		name: "lose",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You die. ☠️"
	},
    {
		name: "win",
		"button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
		"button functions": [restart, restart, restart],
		text: "You defeat the dragon! YOU WIN THE GAME! 🎉"
    },
    {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
]
//objects: created by surrounding them with curly braces, can hold a number of properties
//different values of the object are specified with keys, known as key value pairs

//initializing buttons
button1.onclick = goStore; //onclick: allows function to execute when
                           // specified button is clicked
button2.onclick = goCave;
button3.onclick = fightDragon;

//how to create a function
//basically how you think it works
//parameters go inside parentheses

function goStore() {
    update(locations[1]);
}
//console.log: essentially the print function, writes to console

function goCave() {
    update(locations[2]);
}



function buyHealth() {
    if (gold >= 10) {
        gold -= 10; //some shortcuts still work 
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } //if statements are still the same
    else {
        text.innerText = "Broke ass";
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) { //array.length: returns length of array
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++; //C was truly an innovator
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name; //can string dot notation and brackets
            text.innerText = "You now have a " + newWeapon + "."; //concatenation stays the same
            inventory.push(newWeapon); //array.push adds things to the end of an array
            text.innerText += " In your inventory you have: " + inventory;
        }
        else {
            text.innerText = "broke ass"
        }
    }
    else {
        text.innerText = "You already have the most powerful weapon.";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }

}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift(); 
        //.shift removes first element in array and returns the removed element
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
    } else { 
        text.innerText = "Don't sell you only weapon.";
    }
}

function update(location) {
    monsterStats.style.display = "none";
    //use .style to update css styles, then more dot notations to access different things
    button1.innerText = location["button text"][0]; 
    /*multiple indices. location to access the location array, then "button text"
    to access whichever part of the object, then another index to indicate
    which part of that part*/
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2]; //need to now set new options for buttons
    button1.onclick = location["button functions"][0]; 
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
    //can also use dot notation, but this only works if key is one word
    //innerText: text of that element on html
}
function goTown() {
   update(locations[0]); //indexing is the same
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block"; 
    //use .style to update css styles, then more dot notations to access
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;

}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level);
    }
    else {
        text.innerText += "You miss.";
    }
    health -= getMonsterAttackValue(monsters[fighting].level);
    monsterHealth -= weapons[currentWeapon].power +  Math.floor(Math.random() * xp) + 1;
    //Math.floor: returns the greatest integer less than or equal to its numeric argument.
    //Math.random: returns a random number between 0 and 1
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {

        fighting === 2 ? winGame() : defeatMonster();
        //== compares for equality after type conversion
        //=== compares for equality and two values have to be the EXACT same type
        // so no type conversions
        //ternary operator is still the same
    }

    if (Math.random() <= 0.1 && inventory.length !== 1) { 
        //!== can also be made to not do type conversions
        text.innerText += " Your " + inventory.pop() + " breaks.";
        //pop deletes last element of array and returns the deleted element
        currentWeapon--;
    }
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20; //logical operators are the same
}
function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
}

function defeatMonster() { 
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}
function restart() {
    xp = 0;
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ["stick"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goTown();
}

function easterEgg() {
    update(locations[7]);

}

function pickTwo() {
    pickTwo(2);
}

function pickEight() {
    pickEight(8);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11))
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
    for (let i = 0; i < 10; i++) { //for loops are the same, while loops are the same
        text.innerText += numbers[i] + "\n";
    }
    if (numbers.indexOf(guess) !== -1) { 
        //.indexOf returns the index of whatever you want it to search for
        //if it is not in the array, it returns -1, otherwise it returns the index
        text.innerText += "Right! You win 20 gold!"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health!"
        health -= 10;
        healthText.innerText = health
        if (health <= 0) {
          lose();
        }

    }
}