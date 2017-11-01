/*
 Set base and overlay layers:
    You must include 'baselayers.js' and 'overlays.js' before.
*/
var baseLayers = {
    "OpenStreetMap": osm,
    "OpenCycleMap": ocm,
    "Mapbox(charilog)": mapbox_mine
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
var baselayer = lsGet('layer') ? baseLayers[lsGet('layer')] : baseLayers['Mapbox(charilog)'];
var lat = lsGet('latitude') ? lsGet('latitude') : 35.67487;
var lng = lsGet('longitude') ? lsGet('longitude') : 139.76807;
var center = L.latLng(lat, lng);
var zoom = lsGet('zoom') ? lsGet('zoom') : 10;

var map = L.map('map', {
    fullscreenControl: true,
    layers: baselayer,
    minZoom: 5,
    maxZoom: 19
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

// add elavation control
var el = L.control.elevation({
    position: "bottomleft",
    theme: "steelblue-theme", //default: lime-theme
    width: 600,
    height: 125,
    margins: {
        top: 10,
        right: 20,
        bottom: 30,
        left: 50
    },
    useHeightIndicator: true, //if false a marker is drawn at map position
    interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
    hoverNumber: {
        decimalsX: 3, //decimals on distance (always in km)
        decimalsY: 0, //deciamls on height (always in m)
        formatter: undefined //custom formatter function may be injected
    },
    xTicks: undefined, //number of ticks in x axis, calculated by default according to width
    yTicks: undefined, //number of ticks on y axis, calculated by default according to height
    collapsed: false    //collapsed mode, show chart on click or mouseover
});
el.addTo(map);

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

osrm.on('routesfound', function(e) {
    var r=e.routes[0];
    var i=0;
    var latLng = [];
    var step = parseInt(r.coordinates.length / 500) + 1;
    console.log("Step: "+step);
    for (p of r.coordinates) {
        if ((i % step) == 0) {
            latLng[i/step] = {lat: p.lat, lng: p.lng};
            //console.log(i+": ("+p.lng+","+p.lat+")");
        }
        i=i+1;
    }
    console.log(r.name);
    console.log("Time: "+r.summary.totalTime + "[sec] Distance: "+r.summary.totalDistance+"[m] "+i+" Points");

    $.post("/geoapi/getAltitude.php",
        {latLng: latLng},
        function(data) {
            console.log("Showing elevation data on the map.");
            //console.log(JSON.stringify(data));
            el.clear();

            var myStyle = {
                "color": "#ff7800",
                "weight": 4,
                "opacity": 0
            };

            var geojson = L.geoJson(data,{
                style: myStyle,
                onEachFeature: el.addData.bind(el)
            });
            geojson.addTo(map);
        },"json");
});

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
