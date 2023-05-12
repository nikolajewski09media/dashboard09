import Airtable from 'airtable';
// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
var base = new Airtable({ apiKey: 'keySv1TtnsLdNzGoa' }).base('appM88vCbapvrcTCi');

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'propertiesV4.json')

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file)
const defaultData = { posts: [] }
const db = new Low(adapter, defaultData)

// Read data from JSON file, this will set db.data content
// If JSON file doesn't exist, defaultData is used instead


base('Domains').select({
    // Selecting the first 3 records in Grid view:
    // maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(async function (record, index) {

        await db.read()

        // Create and query items using plain JavaScript
        db.data.posts.push(...[{ propertiy: record.get('Domain'), id: record.get('Porperty-ID v4 (from Porperty-ID v4)')[0] }])

        await db.write()

        console.log(index, 'Retrieved', record.get('Domain'), record.get('Porperty-ID v4 (from Porperty-ID v4)'));


    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});


// base('Domains').select({
//     view: 'Grid view'
// }).firstPage(function (err, records) {
//     if (err) { console.error(err); return; }
//     records.forEach(function (record, index) {
//         console.log(index, 'Retrieved', record.get('Domain'), record.get('Porperty-ID v4 (from Porperty-ID v4)'));
//     });
// });