import { atom } from "nanostores";
import axios from "axios";

export const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
export const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

export const dates = atom([
  sevenDaysAgo.toISOString().split("T")[0],
  yesterday.toISOString().split("T")[0],
]);

export function addDate(date) {
  dates.set(date);
}

export const aggregatedMethod = atom("monthly");

export function setAggregatedMethod(aM) {
  aggregatedMethod.set(aM);
}

export const domainSelection = atom(null);

export function setDomainSelection(dS) {
  domainSelection.set(dS);
}

export async function getDataInRange(dates, toExclude = "Paid Search") {
  const [startDate, endDate] = dates;
  const data = (await axios.get("http://localhost:3000/api/allProperties"))
    .data;
  const rowData = [];

  for (let i = 0; i < data.length; i++) {
    let curr = 0;
    data[i].reports.forEach((reports) => {
      for (let date in reports) {
        if (date >= startDate && date <= endDate) {
          const report = reports[date];
          for (let key in report) {
            if (key !== toExclude) {
              curr += parseInt(report[key]);
            }
          }
        }
      }
    });
    rowData.push({
      name: data[i].label,
      clicks: curr,
    });
  }

  return rowData;
}

export async function getDataInRangeNew(
  dates,
  aggregation = "monthly",
  domain = null, // Hinzugefügter Parameter für den Domainnamen (optional)
  toExclude = "Paid Search"
) {
  const [startDate, endDate] = dates;
  const data = (await axios.get("http://localhost:3000/api/allProperties"))
    .data;

  const aggregatedData = {};

  for (let i = 0; i < data.length; i++) {
    // Filtere nach Domainnamen, falls angegeben
    if (domain && data[i].label !== domain) {
      continue;
    }

    data[i].reports.forEach((reports) => {
      for (let date in reports) {
        if (date >= startDate && date <= endDate) {
          const report = reports[date];
          let aggregationKey = "";

          if (aggregation === "monthly") {
            aggregationKey = date.substring(0, 7); // Monat im Format 'YYYY-MM'
          } else if (aggregation === "weekly") {
            const weekStart = new Date(date);
            const dayOfWeek = weekStart.getDay();
            weekStart.setDate(
              weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
            ); // Erster Tag der Woche (Montag)
            aggregationKey = weekStart.toISOString().substring(0, 10); // Woche im Format 'YYYY-MM-DD'
          } else if (aggregation === "daily") {
            aggregationKey = date; // Tägliches Datum im Format 'YYYY-MM-DD'
          }

          if (!aggregatedData[aggregationKey]) {
            aggregatedData[aggregationKey] = {
              name: aggregationKey,
              clicks: 0,
            };
          }

          for (let key in report) {
            if (key !== toExclude) {
              aggregatedData[aggregationKey].clicks += parseInt(report[key]);
            }
          }
        }
      }
    });
  }

  const newData = Object.values(aggregatedData);

  // Sortiere das Array chronologisch basierend auf dem 'name'-Schlüssel
  newData.sort((a, b) => (a.name > b.name ? 1 : -1));

  return newData;
}
