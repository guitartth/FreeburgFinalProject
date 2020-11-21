const WEATHER_API_KEY = "33c06c3cce7ccfe0faffd41db8db83a3";

// Used to save user location locally
let userZip;
let userState;

window.onload = function() {
  //localStorage.clear();
  // Load default or user saved weather
  getLocation();
  if (userZip === 14767){
    userState = "NY";
    getCurrentWeather(14767);
  }
  else {
    getState(userZip);
    getCurrentWeather(userZip);
  }

  // Set up event listener for search button
  document.getElementById("search").addEventListener("click", function(event) {
    event.preventDefault();
    getState(document.getElementById("zipCode").value);
    getCurrentWeather(document.getElementById("zipCode").value);
  });

  // Set up event listener for save button
  document.getElementById("save").addEventListener("click", function(event) {
    event.preventDefault();
    saveLocation(document.getElementById("zipCode").value);
  });
}

// Get current weather by zip code
async function getCurrentWeather(zip) {
  document.getElementById('status').innerText = '';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=${WEATHER_API_KEY}`);
  const weatherData = await response.json();
  if (weatherData.cod!="200"){
    document.getElementById('status').innerText = weatherData.message;
  }
  else {
    displayWeather(weatherData);
    getFiveDayForecast(weatherData.coord.lat, weatherData.coord.lon);
  }
}

// Get weather for 5 day forecast
async function getFiveDayForecast(lat,lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${WEATHER_API_KEY}`)
  const weatherData = await response.json();
  displayFiveDays(weatherData);
}

// Display current weather
function displayWeather(weathers) {
  document.getElementById("cityState").innerText = weathers.name + ", " + userState;
  let day = getTheDay(0);
  let date = getTheDate(0);
  let month = getTheMonth(0);
  document.getElementById("dateDisplay").innerText = `${day}, ${month} ${date}`;
  document.getElementById("currentTempArea").innerHTML = Math.round(weathers.main.temp) + "&deg;";
  document.getElementById("currentTempIconArea").src = `https://openweathermap.org/img/wn/${weathers.weather[0].icon}@2x.png`;
  
  // search for 78521 for best odds!
  let woohoo = document.getElementById("woohoo");
  if(Math.round(weathers.main.temp) >= 80 || Math.round(weathers.main.temp) <= 32){
    woohoo.play();
  }
  document.getElementById("todayHighTemp").innerHTML = Math.round(weathers.main.temp_max) + "&deg;";
  document.getElementById("todayLowTemp").innerHTML = Math.round(weathers.main.temp_min) + "&deg;";
  document.getElementById("todayWind").innerText = Math.round(weathers.wind.speed) + 'mph';
  document.getElementById("todayHumidity").innerText = weathers.main.humidity + '%';
}

// Display five day forecast
function displayFiveDays(weathers) {
  let daily = weathers.daily;
  // Day 1
  let date1 = getTheDate(1);
  let day1 = getTheDay(1);
  document.getElementById("fiveDayDate1").innerText = `${day1}-${date1}`;
  document.getElementById("fiveDayHigh1").innerHTML = Math.round(daily[1].temp.max) + "&deg;";
  document.getElementById("fiveDayLow1").innerHTML = Math.round(daily[1].temp.min) + "&deg;";
  // Day 2
  let date2 = getTheDate(2);
  let day2 = getTheDay(2);
  document.getElementById("fiveDayDate2").innerText = `${day2}-${date2}`;
  document.getElementById("fiveDayHigh2").innerHTML = Math.round(daily[2].temp.max) + "&deg;";
  document.getElementById("fiveDayLow2").innerHTML = Math.round(daily[2].temp.min) + "&deg;";
  // Day 3
  let date3 = getTheDate(3);
  let day3 = getTheDay(3);
  document.getElementById("fiveDayDate3").innerText = `${day3}-${date3}`;
  document.getElementById("fiveDayHigh3").innerHTML = Math.round(daily[3].temp.max) + "&deg;";
  document.getElementById("fiveDayLow3").innerHTML = Math.round(daily[3].temp.min) + "&deg;";
  // Day 4
  let date4 = getTheDate(4);
  let day4 = getTheDay(4);
  document.getElementById("fiveDayDate4").innerText = `${day4}-${date4}`;
  document.getElementById("fiveDayHigh4").innerHTML = Math.round(daily[4].temp.max) + "&deg;";
  document.getElementById("fiveDayLow4").innerHTML = Math.round(daily[4].temp.min) + "&deg;";
  // Day 5
  let date5 = getTheDate(5);
  let day5 = getTheDay(5);
  document.getElementById("fiveDayDate5").innerText = `${day5}-${date5}`;
  document.getElementById("fiveDayHigh5").innerHTML = Math.round(daily[5].temp.max) + "&deg;";
  document.getElementById("fiveDayLow5").innerHTML = Math.round(daily[5].temp.min) + "&deg;";
}

// Sets userZip to locally saved user location
function getLocation () {
  userZip = localStorage.getItem("zipCode");
  if (userZip === null)
    userZip = 14767;
}

// Saves user location locally
function saveLocation (zip) {
  if (zip !== 14767 && zip !== undefined && zip !== null && zip !== "") {
    localStorage.setItem("zipCode", `${zip}`);
    document.getElementById('status').innerText = "Location saved successfully";
  }
  else {
    document.getElementById('status').innerText = "No location to save";
  }
}

// Returns day of the week
function getTheDay(add) {
  let date = new Date();
  let weekDay = new Array(7);
  weekDay[0] = "Sunday";
  weekDay[1] = "Monday";
  weekDay[2] = "Tuesday";
  weekDay[3] = "Wednesday";
  weekDay[4] = "Thursday";
  weekDay[5] = "Friday";
  weekDay[6] = "Saturday";
  let theDay = date.getDay();
  if( (theDay + add) > 6){
    return weekDay[date.getDay() + (add-7)];
  }
  else{
    return weekDay[date.getDay() + add];
  }
}

// Returns date of the month
function getTheDate(add) {
  let newDate = new Date();
  return (newDate.getDate() + add);
}

// Returns the month of the year
function getTheMonth(add) {
  let date = new Date();
  let month = new Array(12);
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  return month[date.getMonth() + add];
}

// Returns state by zip code
// Attempted using another API but cors issues caused me to just hard code it
// although I hate it. 
function getState(zipcode){
  let st;
  let state;

  // Code cases alphabetized by state 
  if (zipcode >= 35000 && zipcode <= 36999) {
      st = 'AL';
      state = 'Alabama';
  } else if (zipcode >= 99500 && zipcode <= 99999) {
      st = 'AK';
      state = 'Alaska';
  } else if (zipcode >= 85000 && zipcode <= 86999) {
      st = 'AZ';
      state = 'Arizona';
  } else if (zipcode >= 71600 && zipcode <= 72999) {
      st = 'AR';
      state = 'Arkansas';
  } else if (zipcode >= 90000 && zipcode <= 96699) {
      st = 'CA';
      state = 'California';
  } else if (zipcode >= 80000 && zipcode <= 81999) {
      st = 'CO';
      state = 'Colorado';
  } else if (zipcode >= 6000 && zipcode <= 6999) {
      st = 'CT';
      state = 'Connecticut';
  } else if (zipcode >= 19700 && zipcode <= 19999) {
      st = 'DE';
      state = 'Delaware';
  } else if (zipcode >= 32000 && zipcode <= 34999) {
      st = 'FL';
      state = 'Florida';
  } else if (zipcode >= 30000 && zipcode <= 31999) {
      st = 'GA';
      state = 'Georgia';
  } else if (zipcode >= 96700 && zipcode <= 96999) {
      st = 'HI';
      state = 'Hawaii';
  } else if (zipcode >= 83200 && zipcode <= 83999) {
      st = 'ID';
      state = 'Idaho';
  } else if (zipcode >= 60000 && zipcode <= 62999) {
      st = 'IL';
      state = 'Illinois';
  } else if (zipcode >= 46000 && zipcode <= 47999) {
      st = 'IN';
      state = 'Indiana';
  } else if (zipcode >= 50000 && zipcode <= 52999) {
      st = 'IA';
      state = 'Iowa';
  } else if (zipcode >= 66000 && zipcode <= 67999) {
      st = 'KS';
      state = 'Kansas';
  } else if (zipcode >= 40000 && zipcode <= 42999) {
      st = 'KY';
      state = 'Kentucky';
  } else if (zipcode >= 70000 && zipcode <= 71599) {
      st = 'LA';
      state = 'Louisiana';
  } else if (zipcode >= 3900 && zipcode <= 4999) {
      st = 'ME';
      state = 'Maine';
  } else if (zipcode >= 20600 && zipcode <= 21999) {
      st = 'MD';
      state = 'Maryland';
  } else if (zipcode >= 1000 && zipcode <= 2799) {
      st = 'MA';
      state = 'Massachusetts';
  } else if (zipcode >= 48000 && zipcode <= 49999) {
      st = 'MI';
      state = 'Michigan';
  } else if (zipcode >= 55000 && zipcode <= 56999) {
      st = 'MN';
      state = 'Minnesota';
  } else if (zipcode >= 38600 && zipcode <= 39999) {
      st = 'MS';
      state = 'Mississippi';
  } else if (zipcode >= 63000 && zipcode <= 65999) {
      st = 'MO';
      state = 'Missouri';
  } else if (zipcode >= 59000 && zipcode <= 59999) {
      st = 'MT';
      state = 'Montana';
  } else if (zipcode >= 27000 && zipcode <= 28999) {
      st = 'NC';
      state = 'North Carolina';
  } else if (zipcode >= 58000 && zipcode <= 58999) {
      st = 'ND';
      state = 'North Dakota';
  } else if (zipcode >= 68000 && zipcode <= 69999) {
      st = 'NE';
      state = 'Nebraska';
  } else if (zipcode >= 88900 && zipcode <= 89999) {
      st = 'NV';
      state = 'Nevada';
  } else if (zipcode >= 3000 && zipcode <= 3899) {
      st = 'NH';
      state = 'New Hampshire';
  } else if (zipcode >= 7000 && zipcode <= 8999) {
      st = 'NJ';
      state = 'New Jersey';
  } else if (zipcode >= 87000 && zipcode <= 88499) {
      st = 'NM';
      state = 'New Mexico';
  } else if (zipcode >= 10000 && zipcode <= 14999) {
      st = 'NY';
      state = 'New York';
  } else if (zipcode >= 43000 && zipcode <= 45999) {
      st = 'OH';
      state = 'Ohio';
  } else if (zipcode >= 73000 && zipcode <= 74999) {
      st = 'OK';
      state = 'Oklahoma';
  } else if (zipcode >= 97000 && zipcode <= 97999) {
      st = 'OR';
      state = 'Oregon';
  } else if (zipcode >= 15000 && zipcode <= 19699) {
      st = 'PA';
      state = 'Pennsylvania';
  } else if (zipcode >= 300 && zipcode <= 999) {
      st = 'PR';
      state = 'Puerto Rico';
  } else if (zipcode >= 2800 && zipcode <= 2999) {
      st = 'RI';
      state = 'Rhode Island';
  } else if (zipcode >= 29000 && zipcode <= 29999) {
      st = 'SC';
      state = 'South Carolina';
  } else if (zipcode >= 57000 && zipcode <= 57999) {
      st = 'SD';
      state = 'South Dakota';
  } else if (zipcode >= 37000 && zipcode <= 38599) {
      st = 'TN';
      state = 'Tennessee';
  } else if ( (zipcode >= 75000 && zipcode <= 79999) || (zipcode >= 88500 && zipcode <= 88599) ) {
      st = 'TX';
      state = 'Texas';
  } else if (zipcode >= 84000 && zipcode <= 84999) {
      st = 'UT';
      state = 'Utah';
  } else if (zipcode >= 5000 && zipcode <= 5999) {
      st = 'VT';
      state = 'Vermont';
  } else if (zipcode >= 22000 && zipcode <= 24699) {
      st = 'VA';
      state = 'Virgina';
  } else if (zipcode >= 20000 && zipcode <= 20599) {
      st = 'DC';
      state = 'Washington DC';
  } else if (zipcode >= 98000 && zipcode <= 99499) {
      st = 'WA';
      state = 'Washington';
  } else if (zipcode >= 24700 && zipcode <= 26999) {
      st = 'WV';
      state = 'West Virginia';
  } else if (zipcode >= 53000 && zipcode <= 54999) {
      st = 'WI';
      state = 'Wisconsin';
  } else if (zipcode >= 82000 && zipcode <= 83199) {
      st = 'WY';
      state = 'Wyoming';
  } else {
      st = 'NY';
      state = 'none';
  }
  userState = st;
}