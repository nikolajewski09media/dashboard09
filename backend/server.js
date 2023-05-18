import express from 'express'
import { getOneReport, getAllReport } from './controller/analycticsApi.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    return res.send("Hello World!")
})

app.get("/api/property/:propertyId", getOneReport)

app.get("/api/allProperties", getAllReport)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
    console.log(`Serves is reachable at http://localhost:${PORT}`)
})