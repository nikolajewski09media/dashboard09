import { useState } from "react";
import "rsuite/dist/rsuite-no-reset.min.css";
import DateRangePicker from "rsuite/DateRangePicker";

import { addDate, sevenDaysAgo, yesterday } from "../../../utils/dataStore.js";

export default function DateRangePickerComp() {
  const [dateRange, setdateRange] = useState([sevenDaysAgo, yesterday]);

  return (
    <DateRangePicker
      format="dd.MM.yyyy"
      defaultCalendarValue={dateRange}
      placeholder="TT.MM.YYYY - TT.MM.YYYY"
      character=" - "
      isoWeek={true}
      value={dateRange}
      appearance={"default"}
      className="flex-auto"
      onOk={(eventTargetValue) => {
        setdateRange(eventTargetValue);
        addDate([
          eventTargetValue[0].toISOString().split("T")[0],
          eventTargetValue[1].toISOString().split("T")[0],
        ]);

        // startDate.set(eventTargetValue[0].toISOString().split("T")[0]);
        // endDate.set(eventTargetValue[1].toISOString().split("T")[0]);
        // console.log([$startDate, $endDate]);
      }}
      onClean={() => setdateRange([])}
    />
  );
}
