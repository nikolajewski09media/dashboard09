import { atom } from "nanostores";

export const charts = atom("bd");

export function setCharts(data) {
  charts.set(data);
}
