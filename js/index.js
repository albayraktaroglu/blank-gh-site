/*
 *    CUSTOM FUNCTIONS 
 *           - getLoc()
 *               -- Gets client current location using browser data
 *           - getWeatherByLocation(loc)
 *               -- Gets to wweather condition by location that is provided by getLoc() and prints your current location's weather status 
 *           - getWeather(param)
 *               -- To get get specific city weather info
 *           - getAllCities(param)
 *               -- Getting all cities 
 *           - substringMatcher(strs)
 *               -- Autocomplete function
 *           - googleWeatherMapAPI(location)
 *               -- To get and set map and show weather on that city on the map
 *           - populateCountryDropdownList()
 *               -- To fil coutries in to the dropdownlist
 */


function getLoc() {

    $.get("http://ipinfo.io", function (location) {
        console.log(location);

        $('.location')
          .append(location.city).append(", " + location.region);
        getWeatherByLocation(location.loc);
    }, "jsonp");
}

function getWeatherByLocation(loc) {
    lat = String(loc).split(",")[0];
    lon = String(loc).split(",")[1];
    var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=e9c203dc06c04e1f183960f261b2e5a4';


    $.get(weatherApiUrl, function (weather) {
        $('#temperature')
                    .text(Math.floor(weather.main.temp - 273.15)).append("°C");
        $('#icon')
                     .append("<img src='http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'>");
        $('.description')
                     .text(weather.weather[0].description);
        $('.humidity')
                     .text("%" + weather.main.humidity);
    }, "jsonp");

}

function getWeather(param) {

    // var cityname = $('#search').val();
    var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + param + '&&units=metric&appid=e9c203dc06c04e1f183960f261b2e5a4';

    console.log(param);
    console.log(weatherApiUrl);

    // Clear old data 
    $("#divall").empty();

    // Get the new weather information
    $.get(weatherApiUrl, function (data) {

        var yesterday = "";
        var allweather = data;
        var todaystemp = "";

        /* Loop through all weather data */
        $.each(allweather.list, function (k, v) {

            /* Todays Tempriture */
            todaystemp = Math.floor($(this)[0].main.temp);

            /* Dont get same dates */
            if (yesterday == $(this)[0].dt_txt.split(" ")[0]) {
                return;
            }
            else {

                if (!($.isNumeric(param)))
                    param = " ";

                $("#divall").append("<div class='location'>" + data.city.name + " " + param + " " + "</div>\
                                           <div class='card'>\
                                                <div>"+ $(this)[0].dt_txt.split(" ")[0] + "</div>\
                                                <div class='in_card'>\
                                                    <div id='icon'>" + todaystemp + "<img src='http://openweathermap.org/img/w/" + v.weather[0].icon + ".png'></div>\
                                                    <div id='temperature'></div>\
                                                </div>\
                                                <hr>\
                                                <div class='description'>" + v.weather[0].description + "</div>\
                                            </hr>\
                                            </div>\
                                         ");
            }
            yesterday = $(this)[0].dt_txt.split(" ")[0];

        });
    }, "jsonp");

}

function getAllCities(param) {

    alert("getallcities");

    var local = param;
    $.getJSON('city.list.txt', function (data) {

        for (var i = 0; i < data.length ; i++) {
            local[i] = data[i].name;
        }
    });

    return local;
}

function substringMatcher(strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};

function googleWeatherMapAPI(latLoc, longLoc) {

    /*
     *     Main Page GoogleMaps Settings
     */

    var map;
    var geoJSON;
    var request;
    var gettingData = false;
    var openWeatherMapKey = "e9c203dc06c04e1f183960f261b2e5a4"

    function initialize() {
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(50, -50)
        };

        function codeAddress() {
            var address = document.getElementById("address").value;
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
        }


        map = new google.maps.Map(document.getElementById('googleMap'),
            mapOptions);
        // Add interaction listeners to make weather requests
        //google.maps.event.addListener(map, 'idle', checkIfDataRequested);
        google.maps.event.addListener(map, 'idle', function () {
            checkIfDataRequested();

            // This section sets new map for the main page and shows that place on the map
            if ($('#txtsearch').val() != "") {


                var myCenter;
                var coordinate_url = "http://nominatim.openstreetmap.org/search?q=" + $('#txtsearch').val() + "&appid=e9c203dc06c04e1f183960f261b2e5a4&format=json"

                // getting longitude and latitude of requested place
                $.getJSON(coordinate_url, function (coordinatesjson) {

                    var lat = parseFloat(coordinatesjson[0].lat);
                    var lon = parseFloat(coordinatesjson[0].lon);

                   // map.setCenter(new google.maps.LatLng(lat, lon));
                    map.setCenter(new google.maps.LatLng(10.23, 123.45));

                }, "jsonp");

            }

        });

        // Sets up and populates the info window with details
        map.data.addListener('click', function (event) {
            infowindow.setContent(
             "<img src=" + event.feature.getProperty("icon") + ">"
             + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
             + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
             + "<br />" + event.feature.getProperty("weather")
             );
            infowindow.setOptions({
                position: {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                },
                pixelOffset: {
                    width: 0,
                    height: -15
                }
            });
            infowindow.open(map);
        });
    }

    var checkIfDataRequested = function () {
        // Stop extra requests being sent
        while (gettingData === true) {
            request.abort();
            gettingData = false;
        }
        getCoords();
    };

    // Get the coordinates from the Map bounds
    var getCoords = function () {
        var bounds = map.getBounds();
        var NE = bounds.getNorthEast();
        var SW = bounds.getSouthWest();
        getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
    };

    // Make the weather request
    var getWeather = function (northLat, eastLng, southLat, westLng) {
        gettingData = true;

        var requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
                                + westLng + "," + northLat + "," //left top
                                + eastLng + "," + southLat + "," //right bottom
                                + map.getZoom()
                                + "&cluster=yes&format=json"
                                + "&APPID=" + openWeatherMapKey;
        request = new XMLHttpRequest();
        request.onload = proccessResults;
        request.open("get", requestString, true);
        request.send();
    
    };

    // Take the JSON results and proccess them
    var proccessResults = function () {
        console.log(this);
        var results = JSON.parse(this.responseText);
        if (results.list.length > 0) {
            resetData();
            for (var i = 0; i < results.list.length; i++) {
                geoJSON.features.push(jsonToGeoJson(results.list[i]));
            }
            drawIcons(geoJSON);
        }
    };

    var infowindow = new google.maps.InfoWindow();

    // For each result that comes back, convert the data to geoJSON
    var jsonToGeoJson = function (weatherItem) {
        var feature = {
            type: "Feature",
            properties: {
                city: weatherItem.name,
                weather: weatherItem.weather[0].main,
                temperature: weatherItem.main.temp,
                min: weatherItem.main.temp_min,
                max: weatherItem.main.temp_max,
                humidity: weatherItem.main.humidity,
                pressure: weatherItem.main.pressure,
                windSpeed: weatherItem.wind.speed,
                windDegrees: weatherItem.wind.deg,
                windGust: weatherItem.wind.gust,
                icon: "http://openweathermap.org/img/w/"
                      + weatherItem.weather[0].icon + ".png",
                coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
            },
            geometry: {
                type: "Point",
                coordinates: [weatherItem.coord.lon, weatherItem.coord.lat]
            }
        };
        // Set the custom marker icon
        map.data.setStyle(function (feature) {
            return {
                icon: {
                    url: feature.getProperty('icon'),
                    anchor: new google.maps.Point(25, 25)
                }
            };
        });

        // returns object
        return feature;
    };

    // Add the markers to the map
    var drawIcons = function (weather) {
        map.data.addGeoJson(geoJSON);
        // Set the flag to finished
        gettingData = false;
    };

    // Clear data layer and geoJSON
    var resetData = function () {
        geoJSON = {
            type: "FeatureCollection",
            features: []
        };
        map.data.forEach(function (feature) {
            map.data.remove(feature);
        });
    };

    google.maps.event.addDomListener(window, 'load', initialize);
  

}

function populateCountryDropdownList() {
  
    $.getJSON('countries.txt', function (data) {

        for (var i = 0; i < data.length ; i++) {

            //Setting all countries 
            $('<option/>', {
                value: data[i].code,
                html: data[i].name
            }).appendTo('#dropdwnCountrySelectList');
        }
    });

}







/* 
*
*     DOCUMENT READY SECTION 
*
*
*/
$(document).ready(function () {

                /*
                *   Variables 
                */
                
                var allcities = [];
                var d = new Date();
                var n = d.getHours();
                if (n > 20 || n < 5)
                    document.body.className = "night";
                else
                    document.body.className = "day";


                

                /**
                *    Index page set-up
                *        This section includes setting-up of some items in Index.html page 
                *        Ex: Maps, Dropdown lists
                */

                // Hides the list to make user selects first the country dropdownlist
                $('#selectCities').hide();
                $('#loadinggif').hide();

                // To disable button at start up, user needs to select country then user can select city
                $('#dropdwnSearchBttn').prop('disabled', true);

                // Gets client current location
                getLoc();
                
                // Creates map at the start
                googleWeatherMapAPI(0,0);

                // Populates Countries select list under Get weather by country and city
                populateCountryDropdownList();
             



                /**
                *    Input autocomplete framework set-up
                *         getting all cities and making them ready for autocomplete framework
                */

                // Getting all cities and prepare them for autocomplete framework typeahead
                $.getJSON('city.list.txt', function (data) {

                    for (var i = 0; i < data.length ; i++) {
                        allcities[i] = data[i].name;
                    }
                });

                $('#txtsearch').typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 1
                },
                {
                    name: 'states',
                    source: substringMatcher(allcities)
                });

   
});

