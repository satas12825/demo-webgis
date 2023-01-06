
// setmap with base map
var map = L.map("map", {
    center: [18.802808, 98.950170],
    zoom: 15
});


let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// get cap get map//
// var wms_url = "http://localhost:8080/geoserver/wms?service=wms&version=1.1.1&request=GetCapabilities";
// axios.get(wms_url).then((res) => console.log(res.data));


let layer = L.tileLayer.wms("https://geoserver.nu.ac.th/geoserver/map_portal/wms?", {
layers: 'map_portal:cassava_area_64',
format: 'image/png',
legend: true,
transparent: true,
}).addTo(map)

let layer2 = L.tileLayer.wms("http://localhost:8080/geoserver/nurc/wms?", {
layers: 'nurc:Img_Sample',
format: 'image/png',
legend: true,
transparent: true,
})






  var baseMaps = {
    "แผนที&osm": osm
  };

  var overlayMaps = {
    "เลเยอร์": layer,
    "เลเยอร์2": layer2
 };

 map.on('overlayadd', onOverlayAdd);

function onOverlayAdd(e){
    //do whatever
    console.log(e.layer.options.layers);
    layer_name = e.layer.options.layers
    console.log(layer_name);
    layerChange()

}



L.control.layers(baseMaps, overlayMaps).addTo(map);


  // get graphiclagend
var layer_name = 'ne:countries'
let legend = L.control.attribution({ position: "bottomright" });
legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");

    div.innerHTML = ` <img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layer_name}" class="overlay" alt="" srcset="">
    `
    return div;
  };
  legend.addTo(map)

function layerChange(){
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");

    div.innerHTML = ` <img src="https://geoserver.nu.ac.th/geoserver/map_portal/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layer_name}" class="overlay" alt="" srcset="">
    `
    return div;
  };
  legend.addTo(map)
}




map.addEventListener('click', onMapClick);
popup = new L.Popup({maxWidth: 1000000});
function onMapClick(e) {
var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' +         e.latlng.lng.toFixed(3) + ')';
var BBOX =         map.getBounds()._southWest.lng+","+map.getBounds()._southWest.lat+","+map.getBounds()._northEast.lng+","
+map.getBounds()._northEast.lat;
var WIDTH= map.getSize().x;
var HEIGHT = map.getSize().y;
var X = map.layerPointToContainerPoint(e.layerPoint).x;
var Y = map.layerPointToContainerPoint(e.layerPoint).y;

let xx = X.toFixed(0)
let yy = Y.toFixed(0)
console.log(X,Y);
var url = `http://localhost:8080/geoserver/wms?request=GetFeatureInfo&service=WMS&version=1.1.1&layers=topp%3Astates&styles=&srs=EPSG%3A4326&format=image%2Fpng&bbox=-145.151041%2C21.73192%2C-57.154894%2C58.961059&width=${WIDTH}&height=${HEIGHT}&query_layers=topp%3Astates&info_format=application/json&feature_count=50&x=${xx}&y=${yy}&exceptions=application%2Fvnd.ogc.se_xml`
popup.setLatLng(e.latlng);


fetch(url)
.then((response) => response.json())
.then((data) => {
  console.log(data.features)
  let text = data.features
  console.log(text[0].properties);

  show_data = JSON.stringify


  popup.setContent(`<div>state_name:${text[0].properties.STATE_NAME}</div><br><div> family:${text[0].properties.FAMILIES}</div>`);

});


map.openPopup(popup);
}