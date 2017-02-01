/*
 Set base and overlay layers:
    You must include 'baselayers.js' and 'overlays.js' before.
*/
var baseLayers = {
    "OpenStreetMap": osm,
    "OpenCycleMap": ocm,
    "Mapbox": mapbox_mine
};

var overlays = {
    "Strava Heatmap": heatmap,
    "雨雲マップ": rainmap,
    "コンビニエンスストア": convenience,
    "トイレ": toilets,
    "道の駅": services,
    "温泉施設": spa,
    "自転車店": bicycle,
    "峠": pass,
    "景勝地": viewpoint,
    "バス停": bus_stop
};

// functions for local storage
function lsSet(key, val) {
    return window.localStorage.setItem(key, val);
}

function lsGet(key) {
    return window.localStorage.getItem(key);
}

function lsClear() {
    return window.localStorage.clear();
}

/*
 * Main routine
 */
// Get previous status
var baselayer = lsGet('layer') ? baseLayers[lsGet('layer')] : baseLayers['OpenCycleMap'];
var lat = lsGet('latitude') ? lsGet('latitude') : 35.67487;
var lng = lsGet('longitude') ? lsGet('longitude') : 139.76807;
var center = L.latLng(lat, lng);
var zoom = lsGet('zoom') ? lsGet('zoom') : 10;

var map = L.map('map', {
    fullscreenControl: true,
    layers: baselayer,
    minZoom: 5,
    mazZoom: 19
}).setView(center, zoom);

L.control.layers(baseLayers, overlays, {
    position: 'topleft'
}).addTo(map);

// add scalebar
L.control.scale({
    position: 'topright',
    metric: true,
    imperial: false
}).addTo(map);

// OSRM
var osrm = L.Routing.control({
    language: 'ja',
    serviceUrl: 'http://charilog.net:5000/route/v1',
    profile: 'cycling',
    geocoder: L.Control.Geocoder.nominatim(),
    routeWhileDragging: true,
    reverseWaypoints: true,
    routeDragInterval: 100,
    lineOptions: {
        styles: [
            {color: 'black', opacity: 0.1, weight: 9},
            {color: 'fuchsia', opacity: 0.4, weight: 8}
        ]
    },
    altLineOptions: {
        styles: [
            {color: 'black', opacity: 0.1, weight: 9},
            {color: 'aqua', opacity: 0.5, weight: 8}
        ]
    },
    showAlternatives: false
});
osrm.addTo(map);

// Handling events
// Save current status
map.on('baselayerchange', function(e) {
  lsSet('layer', e.name);
});

map.on('moveend', function(e) {
  lsSet('latitude', map.getCenter().lat);
  lsSet('longitude', map.getCenter().lng);
});

map.on('zoomend', function(e) {
  lsSet('latitude', map.getCenter().lat);
  lsSet('longitude', map.getCenter().lng);
  lsSet('zoom', map.getZoom());
});

// 'click' to set route points
map.on('click', mapClick);

function mapClick(e) {
    var wp = osrm.getWaypoints().filter(function(pnt) {
        return pnt.latLng;
    });
    switch(wp.length) {
    case 0:
        osrm.spliceWaypoints(0, 1, e.latlng);
        break;
    case 1:
        osrm.spliceWaypoints(1, 1, e.latlng);
        break;
    default:
        osrm.spliceWaypoints(osrm.getWaypoints().length, 0, e.latlng);
        break
    }
}
