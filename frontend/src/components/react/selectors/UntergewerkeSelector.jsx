import { InputPicker } from "rsuite";
import {
  unterGewerkSelection,
  setUnterGewerkSelection,
} from "../../../utils/dataStore";
import { useStore } from "@nanostores/react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function InputSelector() {
  const [selectorData, setselectorData] = useState(null);
  const $unterGewerkSelection = useStore(unterGewerkSelection);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/getAllPropertiesWithStats")
      .then((res) => {
        const unterGewerkeSet = new Set(
          res.data
            .map((item) => item.untergewerk && item.untergewerk[0])
            .filter((item) => item !== undefined)
        ); // Ein Set erstellen, das eindeutige 'gewerk'-Werte aus den Daten enthält
        const unterGewerke = [...unterGewerkeSet].map((item) => ({
          label: item,
          value: item,
        }));
        setselectorData(unterGewerke);
      });
  }, [selectorData]);
  return (
    <>
      {selectorData && (
        <InputPicker
          data={selectorData}
          style={{ width: 224 }}
          defaultValue={selectorData[0].value}
          cleanable={true}
          value={$unterGewerkSelection}
          onSelect={(value) => setUnterGewerkSelection(value)}
          onClean={() => setUnterGewerkSelection(null)}
          placeholder={"Untergewerke"}
        />
      )}
    </>
  );
}
