import SelectPicker from "rsuite/SelectPicker";
import { setCharts } from "../../../utils/chartStore";

export default function SelectPickerChart() {
  return (
    <SelectPicker
      data={[
        { label: "Balken Diagram", value: "bd" },
        { label: "Linien Diagram", value: "ld" },
      ]}
      style={{ width: 224 }}
      defaultValue={"bd"}
      cleanable={false}
      onSelect={(value) => {
        setCharts(value);
      }}
      searchable={false}
    />
  );
}
