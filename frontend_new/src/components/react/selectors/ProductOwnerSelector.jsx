import { InputPicker } from "rsuite";
import {
  $fetchedData,
  productOwnerSelection,
  setProductOwnerSelection,
} from "../../../utils/dataStore";
import { useStore } from "@nanostores/react";

import { useState, useEffect } from "react";

export default function InputSelector() {
  const [selectorData, setselectorData] = useState(null);
  const $productOwnerSelection = useStore(productOwnerSelection);
  useEffect(() => {
    async function dataFetch() {
      const data = await $fetchedData.get();

      const poSet = new Set(data.map((item) => item.po)); // Ein Set erstellen, das eindeutige 'gewerk'-Werte aus den Daten enthält
      const poArray = [...poSet].map((item) => ({
        label: item,
        value: item,
      }));
      setselectorData(poArray);
    }
    dataFetch();
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
          className="flex-auto"
        />
      )}
    </>
  );
}
