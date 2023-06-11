/**
 * Samuel Affolder 06/11/2023
 * trackingRecords v1.0
 * JS to reformat the json into geojson format for the map
 */
// TODO: entire file
"use strict";

const fs = require('fs');

fs.readFile('data/recordData01.json', 'utf8', (error, recordData) => {
    if (error) {
        console.log(error);
        return;
    }
    let features = [];
    let data = JSON.parse(recordData);
    for (let i = 0; i < data.length; i++) {
        let feature = {
        "type": "Feature",
        "properties": {
            "Event": data[i]["EVENT"],
            "Mark": data[i]["MARK"],
            "Athlete": data[i]["ATHLETE"],
            "Country": data[i]["COUNTRY"],
            "Venue": data[i]["VENUE"],
            "Date": data[i]["DATE"]
        },
        "geometry": {
            "type": "Point",
            "coordinates": [data[i].Longitude, data[i].Latitude]
        }
    }
    features.push(feature);
    }
    let newFormat = {
        "type": "FeatureCollection",
        "features": features
    }
    let newFormString = JSON.stringify(newFormat);
    fs.writeFile('data/recordData01.geojson', newFormString, err => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            console.log('Successfully wrote file');
        }
    });
});