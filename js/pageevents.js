/* 
 *      EVENT HANDLERS and LOCATION GATHERING SECTION
 */


// Finds location that is provided by parameter and sets new location on the map
function setLocationtoMap(newLocation) {
    

    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(50, -50)
    };
    var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    // Add interaction listeners to make weather requests
    //google.maps.event.addListener(map, 'idle', checkIfDataRequested);

    // This section sets new map for the main page and shows that place on the map
    if (newLocation != "") {

        var myCenter = location; ///////////////
        var coordinate_url = "http://nominatim.openstreetmap.org/search?q=" + newLocation + "&appid=e9c203dc06c04e1f183960f261b2e5a4&format=json"

        // getting longitude and latitude of requested place
        $.getJSON(coordinate_url, function (coordinatesjson) {

            var lat = parseFloat(coordinatesjson[0].lat);
            var lon = parseFloat(coordinatesjson[0].lon);

            // We set the new location to show that place to user 
            map.setCenter(new google.maps.LatLng(lat, lon));

        }, "jsonp");
    }

}

// Button that gets input of dropdownlists located at first row ( Search box ) and calls api to get specific city's weather
$('#txtbxSearchBttn').click(function () {

    // Gets the city name written in the searchbox
    var item = $('#txtsearch').val();

    // Checks whether user entered anything
    if (!($.isEmptyObject(item))) {

            // To get the weather 
            getWeather(item);

            // To change location on the map
            setLocationtoMap($('#txtsearch').val());
    }
    else {
        alert("Please enter a city name");
    }

});

// Button that gets input of dropdownlists located at first row ( Get weather by country and city ) and calls api to get specific city's weather
$('#dropdwnSearchBttn').click(function () {

    var item = $('#selectCities :selected').text();

    if (item != "") {
        getWeather(item);
        // To change location on the map
        setLocationtoMap(item);
    }
    else {
        alert("Please enter a city name");
    }
});

// Handles Country dropdown whether changed or not
// this helps to fill second dropdown, first dropdown selecting country then this change function populates with cities those belong to that country
$("#dropdwnCountrySelectList").change(function () {

    // Loading effect
    $('#loadinggif').show(0);

    // Make city list empty for new selected cities 
    $('#selectCities').empty();
    var selectedCountry = $(this).val();

    $.getJSON('city.list.txt', function (data) {

        for (var i = 0; i < data.length ; i++) {

            if (data[i].country == selectedCountry) {
                //Setting all cities 
                $('<option/>', {
                    value: data[i].name,
                    html: data[i].name
                }).appendTo('#selectCities');
            }
        }
    });

    // To show the city dropdown
    $('#selectCities').show();

    // Finish loading effect
    $('#loadinggif').hide();

    // To enable button and start searching
    $('#dropdwnSearchBttn').prop('disabled', false);
});

