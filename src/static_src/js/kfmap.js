(function() {
    // Set the attribution (the copyright statement shown in the lower right corner)
    // We do this as we want the same attributions for all layers
    var myAttributionText = '&copy; <a target="_blank" href="https://download.kortforsyningen.dk/content/vilk%C3%A5r-og-betingelser">Styrelsen for Dataforsyning og Effektivisering</a>';


    // Make the map object using the custom projection
    //proj4.defs('EPSG:25832', "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");
    var crs = new L.Proj.CRS('EPSG:25832',
	'+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs', {
        resolutions: [1638.4,819.2,409.6,204.8,102.4,51.2,25.6,12.8,6.4,3.2,1.6,0.8,0.4,0.2,0.1],
        origin: [120000,6500000],
        bounds: L.bounds([120000, 5661139.2],[1378291.2, 6500000])
    });

    // Make the map object using the custom projection
    var map = new L.Map('map', {
        crs: crs,
        continuousWorld: true,
        center: [55.709155, 11.459081], // Set center location
        zoom: 9, // Set zoom level
        minzoom: 0,
        maxzoom: 14,
    });

    // Skærmkort [WMTS:topo_skaermkort]
    var wmts = L.tileLayer('https://api.dataforsyningen.dk/orto_foraar?token=' + kftoken + '&request=GetTile&version=1.0.0&service=WMTS&layer=orto_foraar&style=default&format=image/jpeg&TileMatrixSet=View1&TileMatrix={zoom}&TileRow={y}&TileCol={x}', {
        attribution: myAttributionText,
        crossOrigin: true,
        zoom: function (data) {
            var zoomlevel = data.z;
            console.log(zoomlevel);
            if (zoomlevel < 10)
                return 'L0' + zoomlevel;
            else
                return 'L' + zoomlevel;
        }
    }).addTo(map);


    // Skærmkort [WMT:topo_skaermkort]
    var wms = L.tileLayer.wms('https://api.dataforsyningen.dk/orto_foraar', {
        layers: 'orto_foraar',
        token: kftoken,
        format: 'image/png',
        attribution: myAttributionText
    });

    // Define layer groups for layer control
    var baseLayers = {
        "Skærmkort": wmts
    };

    // Switch to WMS in zoomlevel > 13
    map.on('zoomend', function () {
        if (map.getZoom() > 13) {
            if (map.hasLayer(wmts)) {
                map.removeLayer(wmts);
            }
            if (!map.hasLayer(wms)) {
                map.addLayer(wms);
            }
        } else {
            if (!map.hasLayer(wmts)) {
                map.addLayer(wmts);
            }
            if (map.hasLayer(wms)) {
                map.removeLayer(wms);
            }
        }
    });

    // Add layer control to map
    L.control.layers(baseLayers).addTo(map);

    // Add scale line to map
    L.control.scale({imperial: false}).addTo(map); // disable feet units

   // callback when map is ready
    map.whenReady(MapReadyCallback);
})();
