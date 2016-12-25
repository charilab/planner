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
