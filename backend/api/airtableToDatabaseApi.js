import Airtable from "airtable";

import * as dotenv from "dotenv";
dotenv.config();

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export default async function updateDB() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, "..", "db", "propertiesV4.DB.json");

    const adapter = new JSONFile(file);
    const defaultData = { properties: [] };
    const db = new Low(adapter, defaultData);

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
        "appM88vCbapvrcTCi"
    );
    await db.read();

    db.data.properties = [];
    await db.write();

    base("Domains")
        .select({
            // maxRecords: 3,
            view: "Grid view",
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(async function (record) {
                    // Hier passiert das schreiben in die porperties-Datenbank
                    const propApiObj = {
                        label: record.get("Domain"),
                        id: record.get("Porperty-ID v4 (from Porperty-ID v4)")[0],
                        gewerk: record.get("Gewerke (from Gewerke)")[0],
                    };
                    if (record.get("Untergewerke (from Untergewerke)")) propApiObj.untergewerk = record.get("Untergewerke (from Untergewerke)");
                    db.data.properties.push(propApiObj);
                    await db.write();
                });

                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    return;
                }
            }
        );
}

// updateDB()
