const cities = [
"צפת",
"נהריה",
"חיפה",
"כרמיאל",
"הרצליה",
"תל אביב",
"רחובות",
"רמת גן",
"באר שבע",
"אילת",
"אשדוד",
"אשקלון",
];

const cityList = document.getElementById("cityList");

cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    cityList.appendChild(option);
});
