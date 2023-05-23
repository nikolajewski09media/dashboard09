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
    db.data.statistic.push(...reportData);
    db.write();
}

export { getStatistic, setStatistic };
