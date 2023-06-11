/**
 * Samuel Affolder 06/08/2023
 * trackingRecords v1.0
 * Heavy lifting for trackingRecords site, loads in map and data
 */
"use strict";
(function() {
    window.addEventListener('load', init); // Waits for the DOM to load in before running script

    // Global variables, personal mapbox key
    let map;
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtYWZmb2xkZXIiLCJhIjoiY2wyam9oZmhrMDZhMzNlbzN5MmludTR1aiJ9.vhUMvam1aTt6ygnJsYLpiQ';

    async function geojsonFetch() {
        // TODO: get my csv into geojson format
        // load in the geojson data
        let response = await fetch('data/recordData01.geojson');
        let recordLocations = await response.json();

        map.on('load', () => {
        // Draw the locations of the records
            map.addLayer({
                id: 'record-layer',
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: recordLocations
                },
                paint: {
                    'circle-radius': 5,
                    'circle-color': 'red'
                }
            });
        });

        const popup = new mapboxgl.Popup();

        // add listener for when you hover over a record
        map.on('mousemove', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['record-layer']
            });
            if (!features.length) {
                popup.remove();
                map.getCanvas().style.cursor = '';
                return;
            }

            const feature = features[0];
            // ngl dont know what setHtml means
            // TODO: setHTML is prolly important ngl
            popup.setLngLat(feature.geometry.coordinates).setHTML('recordLoc').addTo(map);

            map.getCanvas().style.cursor = 'pointer';
        });

        // Create summarize screen if a point is clicked
        map.on('click', (e) => {
            const recordFeatures = map.queryRenderedFeatures(e.point, {
                layers: ['record-layer']
            });

            if (!recordFeatures.length) {
                return;
            }

            const recordFeature = recordFeatures[0];

            // TODO: check the zoom level
            map.flyTo({
            center: recordFeature.geometry.coordinates,
            zoom: 12
            });

            summarizeRecord(recordFeature.properties);
        });
    }

    // Populates the sidebar with information regarding the record clicked on
    function summarizeRecord(data) {
        // TODO: MAKE PRETTY W CSS
        const recordInfo = document.getElementById('record-info');
        recordInfo.classList.remove('hidden');
        document.getElementById('event').innerText = data['Event'];
        document.getElementById('athlete').innerText = data['Athlete'];
        document.getElementById('mark').innerText = data['Mark'];
        document.getElementById('date').innerText = data['Date'];
    }

    // Changes DOM to fit mobile screens better
    function fitToScreen() {
        // TODO: make mobile compatible!!
        if (window.innerWidth < 900) {
            document.querySelectorAll('#title p').forEach( item => {
                item.classList.add('hidden');
            })
            document.getElementById('data').classList.add('hidden');
        } else {
            document.querySelectorAll('#title > p').forEach(item => {
                item.classList.remove('hidden');
            })
            document.getElementById('data').classList.remove('hidden');
        }
    }

    // Initializing function called after the DOM is loaded in
    function init() {
        map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/samaffolder/cl2jvuxtg003i14l26mtl63h6', // TODO: change style
            center: [-122.3, 47.62], // Centered on Seattle TODO: change center
            zoom: 10.5 // TODO: change zoom
        });
        document.getElementById('remove').addEventListener('click', () => {
            document.getElementById('record-info').classList.add('hidden');
        });
        window.addEventListener('resize', () => {
            fitToScreen();
        });
        fitToScreen();
        geojsonFetch();
    }
})();