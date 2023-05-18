import Airtable from 'airtable';

import * as dotenv from 'dotenv'
dotenv.config()


import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'


const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, '..', 'db', 'propertiesV4.DB.json')


const adapter = new JSONFile(file)
const defaultData = { properties: [] }
const db = new Low(adapter, defaultData)


const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appM88vCbapvrcTCi');
await db.read()
base('Domains').select({
    // maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {


    records.forEach(async function (record) {
        // Hier passiert das schreiben in die porperties-Datenbank
        db.data.properties.push({ label: record.get('Domain'), id: record.get('Porperty-ID v4 (from Porperty-ID v4)')[0] })
        await db.write()
    });

    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});

