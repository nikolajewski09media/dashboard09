import updateDB from "../api/airtableToDatabaseApi.js";

export function refreshDB() {
    updateDB()
    console.log("Datenbank wurde erfolgreich aktualisiert!")
}