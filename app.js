
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
var wms_url = "http://localhost:8080/geoserver/wms?service=wms&version=1.1.1&request=GetCapabilities";
axios.get(wms_url).then((res) => console.log(res.data));


let layer = L.tileLayer.wms("http://localhost:8080/geoserver/tiger/wms?", {
layers: 'tiger:poly_landmarks',
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
var layer_name = 'topp:states'
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

    div.innerHTML = ` <img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${layer_name}" class="overlay" alt="" srcset="">
    `
    return div;
  };
  legend.addTo(map)
}