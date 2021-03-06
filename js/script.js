window.lat = 37.8199;
window.lng = -122.4783;
var map;
var mark;
var lineCoords = [];

var attachScripts = document.getElementById("attach-scripts");
var mapPosition = document.getElementById("map-canvas");

var publishKey = "pub-c-2cf58359-5a15-4aa5-8128-b1df55439b9d";
var subscribeKey = "sub-c-2e405b3c-347d-11e7-bb5c-02ee2ddab7fe";
var mapApiKey = "AIzaSyALYyxMI1XeZGReQ3y8V6Q14PtUFq_i1Uc";

var windowWidth = window.innerWidth + "px";
var windowHeight = window.innerHeight + "px";

var pnChannel = "map-channel";

/**
 * Initialize PubNub Keys
 */
function initializePubNub () {
    var pubnub = new PubNub({
        publishKey: publishKey,
        subscribeKey: subscribeKey
    });

    pubnub.addListener({
        message:redraw
    });

    pubnub.subscribe({
        channels: [pnChannel]
    });

    setInterval(function() {
        pubnub.publish({
            channel:pnChannel,
            message: {
                lat:window.lat + 0.001,
                lng:window.lng + 0.01
            }
        });
    }, 5000);
}

var initialize = function () {
    map = new google.maps.Map(mapPosition, {
        center:{
            lat:lat,
            lng:lng
        },
        zoom:12
    });
    mark = new google.maps.Marker({
        position: {
            lat:lat,
            lng:lng
        },
        map:map
    });
    lineCoords.push(new google.maps.LatLng(window.lat, window.lng));
};
window.initialize = initialize;

var redraw = function (payload) {
    lat = payload.message.lat;
    lng = payload.message.lng;
    map.setCenter({
        lat:lat,
        lng:lng,
        alt:0
    });
    mark.setPosition({
        lat:lat,
        lng:lng,
        alt:0
    });
    lineCoords.push(new google.maps.LatLng(lat, lng));
    var lineCoordinatesPath = new google.maps.Polyline({
        path: lineCoords,
        geodesic: true,
        strokeColor: "#2E10FF"
    });

    lineCoordinatesPath.setMap(map);
}

navigator.geolocation.getCurrentPosition( function(position) {
    window.lat = position.coords.latitude;
    window.lng = position.coords.longitude;
});

cdnPubNubScript = document.createElement("script");
cdnPubNubScript.src = "js/pubnub.4.27.3.min.js";

attachScripts.appendChild(cdnPubNubScript);

window.onload = function () {
    initializePubNub();
}

mapApiScript = document.createElement("script");
mapApiScript.src = "https://maps.googleapis.com/maps/api/js?key=" + mapApiKey + "&callback=initialize";

attachScripts.appendChild(mapApiScript);

mapPosition.style.width = windowWidth;
mapPosition.style.height = windowHeight;
