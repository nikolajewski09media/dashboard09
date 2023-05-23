import runReport from "../api/analyticsApi.js";
import properties from "../model/propertiesV4.model.js";
import { getStatistic, setStatistic } from "../model/statistic.model.js";

const yesterdate = new Date();
yesterdate.setDate(yesterdate.getDate() - 1);
const [reportDate] = yesterdate.toISOString().split("T");

export async function getOneReport(req, res) {
    const { propertyId } = req.params;
    const reportData = await runReport(propertyId, reportDate, reportDate);
    res.json(reportData);
}

export async function setAllReport(req, res) {
    await runAllReport();
    res.send("Statistik wurde erfolgreich aktualisiert!");
}

export function getAllStatistic(req, res) {
    const stats = getStatistic();
    res.json(stats);
}

export async function runAllReport() {
    const reportData = [];
    for (const property of properties) {
        const singleReportData = await runReport(
            property.id,
            reportDate,
            reportDate
        );
        reportData.push({
            date: reportDate,
            label: property.label,
            id: property.id,
            report: singleReportData,
        });
    }
    setStatistic(reportData);
}
