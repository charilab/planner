/* define baselayers */
var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: "&copy <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>",
});

var ocm = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: "&copy <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>",
});

var mapbox = L.tileLayer('https://api.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={id}', {
    maxZoom: 19,
    attribution: "&copy <a href='https://www.mapbox.com/map-feedback/'>Mapbox</a> &copy <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
    mapid: '<Your MapID>',
    id: '<Your Access Token>'
});

/* define overlays */
var heatmap = L.tileLayer('http://globalheat.strava.com/tiles/cycling/color1/{z}/{x}/{y}.png', {
    attribution: 'Strava Heatmap',
    maxZoom: 18
});

L.YimgTileLayer = L.TileLayer.extend({
    getTileUrl: function (coords) {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hours = now.getHours();
        var minutes = now.getMinutes();

        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        if (hours < 10) hours = '0' + hours;
        minutes *= 0.1;
        minutes = Math.floor(minutes);
        minutes *= 10;
        if (minutes < 10) minutes = '0' + minutes;
        date = "" + year + month + day + hours + minutes;
        return L.Util.template(this._url, L.extend({
            d: date,
            x: coords.x,
            y: Math.pow(2, this._getZoomForUrl() - 1) - 1 - coords.y,
            z: this._getZoomForUrl() + 1
        }, this.options));
    }
});

var rainmap = new L.YimgTileLayer('http://weather.map.c.yimg.jp/weather?x={x}&y={y}&z={z}&size=256&date={d}', {
    attribution: 'Rain map',
    maxZoom: 18,
    opacity: 0.5
});

/* convenience store */
var convenience = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getGeoInfo.php?kind=convenience",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                if (feature.properties.branch) {
                    label = feature.properties.name+":"+feature.properties.branch;
                } else {
                    label = feature.properties.name;
                }
                layer.bindPopup(label);
            }
        }
    });

/* toilets */
var toilets = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getGeoInfo.php?kind=toilets",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

/* spa or public bath */
var spa = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getGeoInfo.php?kind=spa",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

/* bike shop */
var bicycle = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getGeoInfo.php?kind=bicycle",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

/* mountain pass */
var pass = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getGeoInfo.php?kind=pass",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

/* set base and overlay layers */
var baseLayers = {
    "OpenStreetMap": osm,
    "OpenCycleMap": ocm,
    "Mapbox": mapbox
};

var overlays = {
    "Strava Heatmap": heatmap,
    "雨雲マップ": rainmap,
    "コンビニエンスストア": convenience,
    "トイレ": toilets,
    "温泉施設": spa,
    "自転車店": bicycle,
    "峠": pass
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
