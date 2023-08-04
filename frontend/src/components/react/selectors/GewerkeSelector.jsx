import { InputPicker } from "rsuite";
import {
  $fetchedData,
  gewerkSelection,
  setGewerkSelection,
} from "../../../utils/dataStore";
import { useStore } from "@nanostores/react";

import { useState, useEffect } from "react";

export default function InputSelector() {
  const [selectorData, setselectorData] = useState(null);
  const $gewerkSelection = useStore(gewerkSelection);
  useEffect(() => {
    const data = $fetchedData.get();
    const gewerkeSet = new Set(data.map((item) => item.gewerk)); // Ein Set erstellen, das eindeutige 'gewerk'-Werte aus den Daten enthält
    const gewerkeArray = [...gewerkeSet].map((item) => ({
      label: item,
      value: item,
    }));
    setselectorData(gewerkeArray);
  }, [selectorData]);
  return (
    <>
      {selectorData && (
        <InputPicker
          data={selectorData}
          style={{ width: 224 }}
          defaultValue={selectorData[0].value}
          cleanable={true}
          value={$gewerkSelection}
          onSelect={(value) => setGewerkSelection(value)}
          onClean={() => setGewerkSelection(null)}
          placeholder={"Gewerke"}
          className="flex-auto"
        />
      )}
    </>
  );
}
