import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "..", "propertiesV4.DB.json");

const adapter = new JSONFile(file);
const defaultData = { properties: [] };
const db = new Low(adapter, defaultData);

await db.read();

const propertyIds = db.data.properties;

export default propertyIds;
