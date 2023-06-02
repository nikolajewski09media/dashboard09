import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "..", "db", "statistic.DB.json");

const adapter = new JSONFile(file);
const defaultData = { statistic: [] };
const db = new Low(adapter, defaultData);

await db.read();

function getStatistic() {
    return db.data.statistic;
}

function setStatistic(reportData) {
    const statisticsArray = []
    const dbArray = db.data.statistic
    statisticsArray.push(...reportData)
    if (dbArray.length === 0) {
        dbArray.push(...statisticsArray)
    } else {
        for (let i = 0; i < statisticsArray.length; i++) {
            dbArray[i].reports.push(statisticsArray[i].reports[0])
        }



    }
    // db.data.statistic.push(...reportData);

    db.write();
}

export { getStatistic, setStatistic };
