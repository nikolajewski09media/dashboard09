import Airtable from "airtable";
import * as dotenv from "dotenv";
dotenv.config();
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    "appM88vCbapvrcTCi"
);

function getDomainsAndPropertyIds() {

    // const propertiesObj = [];

    base("Domains")
        .select({
            // Selecting the first 3 records in Grid view:
            maxRecords: 3,
            view: "Grid view",
        })
        .eachPage(
            function page(records, fetchNextPage) {
                // This function (`page`) will get called for each page of records.

                records.forEach(function (record) {
                    console.log({ domain: record.get("Domain"), id: record.get("Porperty-ID v4 (from Porperty-ID v4)")[0] })

                });



                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    return;
                }
            }
        );

    // return propertiesObj;
}

getDomainsAndPropertyIds();
