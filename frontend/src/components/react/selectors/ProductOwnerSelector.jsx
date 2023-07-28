import { InputPicker } from "rsuite";
import {
  productOwnerSelection,
  setProductOwnerSelection,
} from "../../../utils/dataStore";
import { useStore } from "@nanostores/react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function InputSelector() {
  const [selectorData, setselectorData] = useState(null);
  const $productOwnerSelection = useStore(productOwnerSelection);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/getAllPropertiesWithStats")
      .then((res) => {
        const poSet = new Set(res.data.map((item) => item.po)); // Ein Set erstellen, das eindeutige 'gewerk'-Werte aus den Daten enthält
        const poArray = [...poSet].map((item) => ({
          label: item,
          value: item,
        }));
        setselectorData(poArray);
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
          value={$productOwnerSelection}
          onSelect={(value) => setProductOwnerSelection(value)}
          onClean={() => setProductOwnerSelection(null)}
          placeholder={"Product Owner"}
        />
      )}
    </>
  );
}
