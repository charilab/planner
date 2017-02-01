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

/* services */
var services = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getGeoInfo.php?kind=services",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

var viewpoint = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getGeoInfo.php?kind=viewpoint",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });

var bus_stop = L.geoJsonDynamic({
        jsonUrl: "http://charilab.sakura.ne.jp/geoapi/getGeoInfo.php?kind=bus_stop",
        reload: true,
        limit: null,
        pointToLayer: createMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    });
