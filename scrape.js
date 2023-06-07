/*
 * Name: Samuel Affolder
 * Date: 06/07/2023
 *
 * Original JS for scraping WA list of world records for v1.0 of trackingRecords
 */
"use strict"

// Setting up the excel sheet to save the data to
const Excel= require("exceljs")
let workbook= new Excel.Workbook();
let worksheet= workbook.addWorksheet("recordData")
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
const request= require("request-promise")
const cheerio= require("cheerio");

// Request the html from tnfn website
request("https://worldathletics.org/records/by-category/world-records", (error, response, html) => {
    if(!error && response.statusCode==200) {
        const doc= cheerio.load(html);
        //let container= doc("table.records-table > tbody");
        doc("tr").each((i, data) => {
            const item = doc(data).text();
            let rowData= item.split("\n");
            let markData= {event:rowData[2], mark:rowData[9], athlete:rowData[15],
            country:rowData[23], venue:rowData[26], date:rowData[29]};
            for (let j = 0; j < markData.length; j++) {
                if (markData[j] !== undefined) {
                    markData[j] = markData[j].strip();
                }
            }
            recordData.push(markData);
            /*for (let j = 0; j < rowData.length; j++) {
                console.log("[" + j + "] " + rowData[j]);
            }*/
        })
        //console.log("got my website");
        /*$("tr > td").each((i, data) => {
            const item= $(data).text();
            let rowData= item.split("\n");
            console.log("[0]: " + rowData[0] + "[1]: " + rowData[1] + "[2]: " + rowData[2] + "[3]: " +
            rowData[3] + "[4]: " + rowData[4]);
            //let recordRow = {}
            //console.log(item);
        }
        )
        // Parse through each row and split data to needed format
        /*$("").each((i, data) => {
            const item= $(data).text();
            let rowData= item.split("\n");
            console.log(rowData[0], rowData[1], rowData[2]);
            let athleteData= {name:rowData[1], time:rowData[2], city:rowData[3], date:rowData[4]};
            runData.push(athleteData);
        })*/
    }
    // Add the JSON data into the Excel file
   recordData.forEach((e, index) => {
      worksheet.addRow({...e});
    });

    // Writes a new Excel file
    workbook.xlsx.writeFile("recordData01.xlsx")
});