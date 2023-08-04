import { InputPicker } from "rsuite";
import { aggregatedMethod, setAggregatedMethod } from "../../utils/dataStore";
import { useStore } from "@nanostores/react";

const data = [
  { label: "Monatlich", value: "monthly" },
  { label: "Wöchentlich", value: "weekly" },
  { label: "Täglich", value: "daily" },
];

export default function InputSelector() {
  const $aggregatedMethod = useStore(aggregatedMethod);
  return (
    <InputPicker
      data={data}
      style={{ width: 224 }}
      defaultValue={data[0].value}
      cleanable={false}
      value={$aggregatedMethod}
      onSelect={(value) => setAggregatedMethod(value)}
      className="flex-auto"
    />
  );
}
