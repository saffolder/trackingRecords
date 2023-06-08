/*
 * Samuel Affolder 06/07/2023
 * trackingRecords v1.0
 * Original JS for scraping WA list of world records for v1.0 of trackingRecords
 */
"use strict";

// Setting up the excel sheet to save the data to
const Excel= require("exceljs");
let workbook= new Excel.Workbook();
let worksheet= workbook.addWorksheet("recordData");
worksheet.columns = [
    {header: "EVENT", key: "event"},
    {header: "MARK", key: "mark"},
    {header: "ATHLETE", key: "athlete"},
    {header: "COUNTRY", key: "country"},
    {header: "VENUE", key: "venue"},
    {header: "DATE", key: "date"}
]

// Will hold all JSON data
let recordData = [];

// For webscraping
const request= require("request-promise");
const cheerio= require("cheerio");

// Request the html from tnfn website
request("https://worldathletics.org/records/by-category/world-records", (error, response, html) => {
    if(!error && response.statusCode==200) {
        const doc= cheerio.load(html);
        doc("tbody > tr").each((i, data) => {
            const item = doc(data).text();
            let rowData = item.split("\n");
            let markData= {event:rowData[2].trim(), mark:rowData[9].trim(), athlete:rowData[15].trim(),
                            country:rowData[23].trim(), venue:rowData[26].trim(), date:rowData[29].trim()};
            //console.log(markData);
            recordData.push(markData);
        })
    }
    // Add the JSON data into the Excel file
    recordData.forEach((e, index) => {
      worksheet.addRow({...e});
    });

    // Writes a new Excel file
    workbook.xlsx.writeFile("recordData01.xlsx")
});