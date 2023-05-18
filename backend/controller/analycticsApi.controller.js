import runReport from '../api/analyticsApi.js';
import properties from '../model/propertiesV4.model.js';

export async function getOneReport(req, res) {
    const { propertyId } = req.params;
    const reportData = await runReport(propertyId, "2023-04-01", "2023-04-30")
    res.json(reportData)
}

export async function getAllReport(req, res) {
    const reportData = []
    for (const property of properties) {
        const singeReportData = await runReport(property.id, "2023-04-01", "2023-04-30");
        reportData.push({ [property.label]: singeReportData })
    }

    res.json(reportData)
}