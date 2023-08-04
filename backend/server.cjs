const express = require("express");
const cron = require("node-cron");
const cors = require("cors");

async function runApp() {
  const {
    getAllStatistic,
    getOneReport,
    runAllReport,
    setAllReport,
    getAllPropertiesWithStats,
  } = await import("./controller/analycticsApi.controller.js");
  const { refreshDB } = await import(
    "./controller/airtableToDatabaseApi.controller.js"
  );

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.get("/", (req, res) => {
    return res.send("Hello World!");
  });

  app.get("/api/property/:propertyId", getOneReport);

  app.get("/api/allProperties", getAllStatistic);

  app.get("/api/getAllPropertiesWithStats", getAllPropertiesWithStats);

  app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Serves is reachable at http://localhost:${PORT}`);
    // for (let i = 1; i < 150; i++) {
    //   await runAllReport(i);
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
}

runApp();
