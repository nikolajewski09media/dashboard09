import InputPicker from "rsuite/InputPicker";

import { selectorStates, setSelectorStates } from "@/utils/dataStore";

import { useStore } from "@nanostores/react";

export default function Selector(props: any) {
  const selectorValues = useStore(selectorStates);
  return (
    <InputPicker
      data={props.items}
      placeholder={props.placeholder}
      value={selectorValues[props.keyForValue]}
      style={{ minWidth: 205 }}
      cleanable={!props.NotCleanable}
      onClean={() =>
        setSelectorStates({
          ...selectorValues,
          [props.keyForValue]:
            props.keyForValue === "diagramArt"
              ? "bd"
              : props.keyForValue === "aggregatedMethod"
              ? "monthly"
              : null,
        })
      }
      onSelect={(value) =>
        setSelectorStates({
          ...selectorValues,
          [props.keyForValue]: value,
        })
      }
    />
  );
}
