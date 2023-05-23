import express from 'express'
import { getAllStatistic, getOneReport, runAllReport, setAllReport } from './controller/analycticsApi.controller.js';
import { refreshDB } from './controller/airtableToDatabaseApi.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

const refreshInterval = 3600000 * 24;


app.get("/", (req, res) => {
    return res.send("Hello World!")
})


app.get("/api/property/:propertyId", getOneReport);

app.get("/api/allProperties", getAllStatistic);




app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Serves is reachable at http://localhost:${PORT}`);
    refreshDB();

    setInterval(() => {
        refreshDB();
        setTimeout(() => runAllReport(), 120000)
    }, refreshInterval)


})