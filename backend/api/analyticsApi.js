import { BetaAnalyticsDataClient } from "@google-analytics/data";




const analyticsDataClient = new BetaAnalyticsDataClient();

// Runs a simple report.
export default async function runReport(propertyId, start, ende) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: start || "yesterday",
        endDate: ende || "yesterday",
      },
    ],
    dimensions: [
      {
        name: "sessionDefaultChannelGroup",
      },
    ],
    metrics: [
      {
        name: "sessions",
      },
    ],
  });

  const reportData = response.rows.reduce((acc, cur) => {
    acc[cur.dimensionValues[0].value] = cur.metricValues[0].value;
    return acc
  }, {});
  return reportData;
}

