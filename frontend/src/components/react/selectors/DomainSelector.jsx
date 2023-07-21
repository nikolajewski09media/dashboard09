import { InputPicker } from "rsuite";
import { domainSelection, setDomainSelection } from "../../../utils/dataStore";
import { useStore } from "@nanostores/react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function InputSelector() {
  const [selectorData, setselectorData] = useState(null);
  const $domainSelection = useStore(domainSelection);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/allProperties")
      .then((res) =>
        setselectorData(
          res.data.map((item) => ({ label: item.label, value: item.label }))
        )
      );
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
        />
      )}
    </>
  );
}
