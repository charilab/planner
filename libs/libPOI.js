var convIcons = {
    "セブン-イレブン": L.icon({
        iconUrl: '/images/conv_711_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "セブンイレブン": L.icon({
        iconUrl: '/images/conv_711_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "ローソン": L.icon({
        iconUrl: '/images/conv_lawson_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "LAWSON": L.icon({
        iconUrl: '/images/conv_lawson_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "Lawson": L.icon({
        iconUrl: '/images/conv_lawson_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "ファミリーマート": L.icon({
        iconUrl: '/images/conv_famima_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "Family": L.icon({
        iconUrl: '/images/conv_famima_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "FamilyMart": L.icon({
        iconUrl: '/images/conv_famima_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "Familymart": L.icon({
        iconUrl: '/images/conv_famima_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "ミニストップ": L.icon({
        iconUrl: '/images/conv_ministop_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "サークルK": L.icon({
        iconUrl: '/images/conv_circlek_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "デイリーヤマザキ": L.icon({
        iconUrl: '/images/conv_daily_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "ポプラ": L.icon({
        iconUrl: '/images/conv_poplar_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "スリーエフ": L.icon({
        iconUrl: '/images/conv_threef_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "サンクス": L.icon({
        iconUrl: '/images/conv_sunkus_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "ココストア": L.icon({
        iconUrl: '/images/conv_coco_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "セイコーマート": L.icon({
        iconUrl: '/images/conv_seico_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
    "others": L.icon({
        iconUrl: '/images/conv_others_20.png',
        iconSize: [20, 20], 
        iconAnchor: [10, 10]}),
};

var passIcon = L.icon({
    iconUrl: '/images/pass_16.png',
    iconSize:     [16, 16],
    iconAnchor:   [8, 8]
});

var spaIcon = L.icon({
    iconUrl: '/images/hotspring_32.png',
    iconSize: [32, 32], 
    iconAnchor: [16, 16]});

var bicycleIcon = L.icon({
    iconUrl: '/images/bicycle_32.png',
    iconSize: [32, 32], 
    iconAnchor: [16, 16]});

var toiletsIcon = L.icon({
    iconUrl: '/images/toilets_16.png',
    iconSize: [16, 16], 
    iconAnchor: [8, 8]});

var servicesIcon = L.icon({
    iconUrl: '/images/michinoeki.svg',
    iconSize: [16, 16], 
    iconAnchor: [8, 8]});

function selectIcon(feature) {
    var icon = convIcons["others"];
    if (feature.properties.name) {
        var strs = feature.properties.name.split(/[\s\(]/);
        var name = strs[0];
        icon = (convIcons[name]) ? convIcons[name] : convIcons["others"];
    }
    return icon;
}

function createMarker(feature, latlng) {
    if (feature.properties.shop == "convenience") {
        icon = selectIcon(feature);
        var marker = new L.Marker(latlng, {icon: icon});
        if (feature.properties.branch) {
            marker.bindPopup(feature.properties.branch);
        }
    } else if (feature.properties.mountain_pass == "yes") {
        var marker = new L.Marker(latlng, {icon: passIcon});
    } else if ((feature.properties.amenity == "spa")
        || (feature.properties.amenity == "public_bath")) {
        var marker = new L.Marker(latlng, {icon: spaIcon});
    } else if ((feature.properties.shop == "bicycle")
        || (feature.properties.shop == "sports")) {
        var marker = new L.Marker(latlng, {icon: bicycleIcon});
    } else if (feature.properties.highway == "services") {
        var marker = new L.Marker(latlng, {icon: servicesIcon});
    } else if (feature.properties.amenity == "toilets") {
        var marker = new L.Marker(latlng, {icon: toiletsIcon});
    } else {
        var marker = new L.CircleMarker(latlng);
    }
    return marker;
}
