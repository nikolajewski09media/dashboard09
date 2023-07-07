import { atom } from "nanostores";

export const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
export const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

export const dates = atom([
  sevenDaysAgo.toISOString().split("T")[0],
  yesterday.toISOString().split("T")[0],
]);

export function addDate(date) {
  dates.set(date);
}
