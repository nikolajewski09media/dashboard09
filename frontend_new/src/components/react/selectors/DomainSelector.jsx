import { InputPicker } from "rsuite";
import {
  $fetchedData,
  domainSelection,
  setDomainSelection,
} from "../../../utils/dataStore";
import { useStore } from "@nanostores/react";

import { useState, useEffect } from "react";

export default function InputSelector() {
  const [selectorData, setselectorData] = useState(null);
  const $domainSelection = useStore(domainSelection);
  useEffect(() => {
    async function dataFetch() {
      const data = await $fetchedData.get();
      setselectorData(
        data.map((item) => ({ label: item.label, value: item.label }))
      );
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
          value={$domainSelection}
          onSelect={(value) => setDomainSelection(value)}
          onClean={() => setDomainSelection(null)}
          placeholder={"Domains"}
          className="flex-auto"
        />
      )}
    </>
  );
}
