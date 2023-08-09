import { Atom, atom } from "nanostores";
import { WritableAtom } from "nanostores";

const domainName =
  import.meta.env.PUBLIC_BE_DOMAIN_NAME || "http://localhost:3000";

export const sevenDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
export const yesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

export type Dates = { from: Date; to?: Date };

export const dates = atom({ from: sevenDaysAgo, to: yesterday });

export function setDates(date: Dates | any) {
  dates.set(date);
}

export type SelectorStates = {
  clear?: boolean;
  diagramArt: string;
  aggregatedMethod: string;
  productOwnerSelection: string | string[] | null;
  gewerkSelection: string | string[] | null;
  unterGewerkSelection: string | string[] | null;
  domainSelection: string | string[] | null;
};

export interface TrafficReport {
  "Paid Search": string;
  "Organic Search": string;
  Direct: string;
  Unassigned: string;
}

export interface DateReportMap {
  [date: string]: TrafficReport;
}

export interface WebsiteTrafficData {
  label: string;
  id: number;
  reports: DateReportMap[];
}

export const selectorStates: WritableAtom<SelectorStates> = atom({
  clear: false,
  diagramArt: "bd",
  aggregatedMethod: "monthly",
  productOwnerSelection: null,
  gewerkSelection: null,
  unterGewerkSelection: null,
  domainSelection: null,
});

export function setSelectorStates(
  stateObj: SelectorStates,
  key: string,
  value: any
): void {
  selectorStates.set({ ...stateObj, [key]: value });
}

export function getDataInRange(
  data: any,
  dates: Dates | any,
  toExclude: string = "Paid Search"
) {
  const startDate = dates.from.toISOString().split("T")[0];
  const endDate = dates.to.toISOString().split("T")[0];

  const rowData = [];

  for (let i = 0; i < data.length; i++) {
    let curr = 0;
    data[i].reports.forEach((reports: any) => {
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

// Diese Funktion ruft aggregierte Daten aus einer API basierend auf einem Zeitraum, einer Aggregationsmethode und einem optionalen Domainnamen ab.
export function getDataInRangeNew(
  data: any,
  dates: Dates | any, // Der Zeitraum, für den die Daten abgerufen werden sollen (Array mit Start- und Enddatum)
  aggregation: string = "monthly", // Die Aggregationsmethode (optional, Standardwert ist "monthly")
  domain: string | string[] | null = null, // Der Domainname, nach dem gefiltert werden soll (optional, Standardwert ist null)
  po: string | string[] | null = null, // Hinzugefügter Parameter für 'po' (optional)
  gewerke: string | string[] | null = null, // Hinzugefügter Parameter für 'gewerke' (optional)
  untergewerke: string | string[] | null = null, // Hinzugefügter Parameter für 'untergewerke' (optional)
  toExclude: string = "Paid Search" // Der Schlüsselwert, der aus den Berichten ausgeschlossen werden soll (optional, Standardwert ist "Paid Search")
) {
  const startDate = dates.from.toISOString().split("T")[0];
  const endDate = dates.to.toISOString().split("T")[0];

  // Daten von der API abrufen und in der Variable 'data' speichern

  const aggregatedData: any = {}; // Ein leeres Objekt erstellen, in dem die aggregierten Daten gespeichert werden

  // Schleife über alle Elemente in den Daten
  for (let i = 0; i < data.length; i++) {
    // Filtere nach Domainnamen, falls angegeben
    if (
      (domain && data[i].label !== domain) || // Filter für Domain
      (po && data[i].po !== po) || // Filter für 'po'
      (gewerke && data[i].gewerk !== gewerke) || // Filter für 'gewerke'
      (untergewerke &&
        (data[i].gewerk !== "Sanitär Heizung usw." ||
          !data[i].untergewerk ||
          data[i].untergewerk[0] !== untergewerke)) // Filter für 'untergewerke' abhängig von 'gewerke'
    ) {
      continue; // Wenn ein Domainname angegeben wurde und dieser nicht mit dem 'label' des Elements übereinstimmt, überspringe das Element
    }

    data[i].reports.forEach((reports: any) => {
      // Schleife über die Berichte für das aktuelle Element
      for (let date in reports) {
        // Überprüfe, ob das Datum im gewünschten Zeitraum liegt
        if (date >= startDate && date <= endDate) {
          const report = reports[date]; // Der aktuelle Bericht für das Datum
          let aggregationKey = "";

          // Abhängig von der gewählten Aggregationsmethode 'aggregation' einen Aggregationsschlüssel erstellen
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

          // Falls der Aggregationsschlüssel noch nicht im 'aggregatedData'-Objekt existiert, füge ihn hinzu
          if (!aggregatedData[aggregationKey]) {
            aggregatedData[aggregationKey] = {
              name: aggregationKey, // Der Name des Aggregationsschlüssels
              clicks: 0, // Anfangswert für die aggregierten Klicks
            };
          }

          // Iteriere über alle Schlüssel im Bericht und aggregiere die Klicks (außer dem auszuschließenden Schlüssel)
          for (let key in report) {
            if (key !== toExclude) {
              aggregatedData[aggregationKey].clicks += parseInt(report[key]);
            }
          }
        }
      }
    });
  }

  const newData = Object.values(aggregatedData); // Konvertiere die aggregierten Daten in ein Array
  // Sortiere das Array chronologisch basierend auf dem 'name'-Schlüssel (entsprechend der Aggregationseinheit)
  newData.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  return newData; // Gebe die sortierten und aggregierten Daten zurück
}
