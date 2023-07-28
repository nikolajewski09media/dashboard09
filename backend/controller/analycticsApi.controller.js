import runReport from "../api/analyticsApi.js";
import properties from "../model/propertiesV4.model.js";
import {
  getStatistic,
  setStatistic,
  getOneStatistic,
} from "../model/statistic.model.js";

export async function getOneReport(req, res) {
  const { propertyId } = req.params;
  // const reportData = await runReport(propertyId, reportDate, reportDate);
  const reportData = getOneStatistic(propertyId);
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
  const yesterdate = new Date();
  yesterdate.setDate(yesterdate.getDate() - 1);
  const [reportDate] = yesterdate.toISOString().split("T");

  const reportData = [];
  // console.log('Fetch hat begonnen. Kann ca. 1-2 Minuten dauern!')
  for (const property of properties) {
    const singleReportData = await runReport(
      property.id,
      reportDate,
      reportDate
    );

    if (Object.keys(singleReportData).length !== 4) {
      singleReportData["Paid Search"] = singleReportData["Paid Search"] || "0";
      singleReportData["Organic Search"] =
        singleReportData["Organic Search"] || "0";
      singleReportData.Direct = singleReportData.Direct || "0";
      singleReportData.Unassigned = singleReportData.Unassigned || "0";
    }

    reportData.push({
      label: property.label,
      id: property.id,
      reports: [{ [reportDate]: { ...singleReportData } }],
    });
    // console.log({ [reportDate]: { ...singleReportData } })
  }
  setStatistic(reportData);
  console.log("Daten wurden erfolgreich von GA gefetched für", reportDate);
}

export function getAllPropertiesWithStats(req, res) {
  const stats = getStatistic();
  const props = properties;
  const merged = stats.map((stat) => {
    const prop = props.find((p) => p.id === stat.id);
    return { ...prop, ...stat };
  });

  return res.json(merged);
}
