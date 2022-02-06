const wrap = document.getElementById("wrap");
const input = document.getElementById("input");
const infotxt = document.getElementById("info-txt");
const searchBtn = document.getElementById("search");
let locationBtn = document.getElementById("myLocation");
let backArrow = document.getElementById("back");
let apiKey = "218b8a582533de2aa7f94f8ed50e9647";
let api;

searchBtn.addEventListener("click", () => {
    if (input.value != "") {
        requestApi(input.value);
    }
});
input.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && input.value != "") {
        requestApi(input.value);
    }
});
input.addEventListener("keyup", (e) => {
    if (e.keyCode == 8 && input.value == "") {
        input.value = "";
        input.classList.remove("wrongInput");
    }
});
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("your browser not support  geolocation api");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    input.value = error.message;
    input.classList.add("wrongInput");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infotxt.innerText = "Getting weather details..";
    infotxt.classList.add("pending");
    fetch(api)
        .then((response) => response.json())
        .then((result) => weatherDetails(result));
}
function weatherDetails(info) {
    if (info.cod == "404") {
        input.value = info.message;
        input.classList.add("wrongInput");
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;
        const { speed } = info.wind;
        // using coustom  weather icon for weather ...
        if (id == 800) {
            wIcon = "fas fa-sun"; // clear
        } else if (id >= 200 && id <= 232) {
            wIcon = "fas fa-bolt"; // strom
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon = "fas fa-cloud-rain"; // rain  //////
        } else if (id >= 600 && id <= 622) {
            wIcon = "fas fa-snowflake"; // snow
        } else if (id >= 701 && id <= 781) {
            wIcon = "fas fa-smog"; // haze
        } else if (id >= 801 && id <= 804) {
            wIcon = "fas fa-cloud"; // cloud
        }
        wrap.querySelector(".weather-icon").innerHTML = `<i class = "${wIcon} fa-3x" style="color:dimgray">`;
        wrap.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrap.querySelector(".weather").innerText = description;
        wrap.querySelector(".location span").innerText = `${city}, ${country}`;
        wrap.querySelector(".temp .numb-2").innerText = speed;
        wrap.querySelector(".humidity span").innerText = `${humidity}%`;
        wrap.classList.add("active");
    }
    //   console.log(info);
}
backArrow.addEventListener("click", () => {
    wrap.classList.remove("active");
    input.value = ""
});