import express from "express";
import cron from "node-cron";
import cors from "cors";

import {
  getAllStatistic,
  getOneReport,
  runAllReport,
  setAllReport,
} from "./controller/analycticsApi.controller.js";
import { refreshDB } from "./controller/airtableToDatabaseApi.controller.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.get("/api/property/:propertyId", getOneReport);

app.get("/api/allProperties", getAllStatistic);

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`Serves is reachable at http://localhost:${PORT}`);
  // for (let i = 3; i < 34; i++) {
  //     await runAllReport(i)
  // }

  // Dieser Befehl führt den API-Fetch von Airtaible jede sechs Stunden aus
  cron.schedule("0 0 4 * * *", () => {
    refreshDB();
  });
  // Dieser Befehl führt den API-Fetch von GA jeden Tag um 01:00 Uhr Nachts aus
  cron.schedule("0 0 5 * * *", async () => {
    await runAllReport();
  });
});
