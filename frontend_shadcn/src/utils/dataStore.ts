import { WritableAtom, atom } from "nanostores";

// Typ-Definitionen
export type Dates = { from: Date; to?: Date };

export type SelectorStates = {
  clear?: boolean;
  diagramArt: string;
  aggregatedMethod: string;
  productOwnerSelection: string[] | null;
  gewerkSelection: string[] | null;
  unterGewerkSelection: string[] | null;
  domainSelection: string[] | null;
};

// Initale Daten für die Nanostores
export const selectorStates: WritableAtom<SelectorStates> = atom({
  clear: false,
  diagramArt: "bd",
  aggregatedMethod: "monthly",
  productOwnerSelection: null,
  gewerkSelection: null,
  unterGewerkSelection: null,
  domainSelection: null,
});

export const sevenDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
export const yesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

// Nanostores für Statesharing in React-Componenten
export const dates = atom({ from: sevenDaysAgo, to: yesterday });

export function setDates(date: Dates | any) {
  dates.set(date);
}
export function setSelectorStates(
  stateObj: SelectorStates,
  key: string,
  value: any
): void {
  selectorStates.set({ ...stateObj, [key]: value });
}

// Filter Function für die Tabelle
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

// Hauptfilter Function für die Charts
export function getDataInRangeNew(
  data: any,
  dates: Dates | any,
  aggregation: string = "monthly",
  domain: string[] | null = null,
  po: string[] | null = null,
  gewerke: string[] | null = null,
  untergewerke: string[] | null = null,
  toExclude: string = "Paid Search"
) {
  const startDate = dateToString(dates.from);
  const endDate = dateToString(dates.to);

  const aggregatedData: any = {};
  domain = ifNullArrayThentoNull(domain);
  po = ifNullArrayThentoNull(po);
  gewerke = ifNullArrayThentoNull(gewerke);
  untergewerke = ifNullArrayThentoNull(untergewerke);
  for (let i = 0; i < data.length; i++) {
    if (
      (domain && !domain.includes(data[i].label)) ||
      (po && !po.includes(data[i].po)) ||
      (gewerke && !gewerke.includes(data[i].gewerk)) ||
      (untergewerke &&
        (data[i].gewerk !== "Sanitär Heizung usw." ||
          !data[i].untergewerk ||
          !data[i].untergewerk.some((u: string) => untergewerke?.includes(u))))
    ) {
      continue;
    }

    data[i].reports.forEach((reports: any) => {
      for (let date in reports) {
        if (date >= startDate && date <= endDate) {
          const report = reports[date];
          let aggregationKey = "";

          if (aggregation === "monthly") {
            aggregationKey = date.substring(0, 7);
          } else if (aggregation === "weekly") {
            const weekStart = new Date(date);
            const dayOfWeek = weekStart.getDay();
            weekStart.setDate(
              weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
            );
            aggregationKey = weekStart.toISOString().substring(0, 10);
          } else if (aggregation === "daily") {
            aggregationKey = date;
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
  newData.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  return newData;
}

// Helper Functions
const dateToString = (date: Date) => {
  const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
};

function ifNullArrayThentoNull(nullArray: any) {
  if (
    Array.isArray(nullArray) &&
    nullArray?.length === 1 &&
    nullArray[0] === null
  ) {
    nullArray = null;
  }
  return nullArray;
}
