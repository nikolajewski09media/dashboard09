import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import Header from "../../components/Header";

// import { mockDataTeam } from "../../data/mockData";
import { DataGrid } from "@mui/x-data-grid";

export default function Dashboard() {
  const [dataReport, setDataReport] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    setIsLoading(true);
    const response = await axios.get("http://localhost:3000/api/allProperties");
    setDataReport(response.data);
    setIsLoading(false);
    dataReport.length && accDataReport(dataReport);
  }

  function accDataReport(dataReportState) {
    const newReportsArray = [];
    for (let i = 0; i < dataReportState.length; i++) {
      let curr = 0;
      dataReportState[i].reports.forEach((reports) => {
        for (let date in reports) {
          const report = reports[date];
          for (let key in report) {
            if (key !== "Paid Search") {
              curr += parseInt(report[key]);
            }
          }
        }
      });
      newReportsArray.push({
        label: dataReportState[i].label,
        id: dataReportState[i].id,
        reports: curr,
      });
    }
    setDataReport(newReportsArray);
  }

  useEffect(() => {
    fetchData();
  }, [isLoading]);

  if (isLoading) {
    return <h1>is Loading</h1>;
  }

  return (
    <Box m={"20px"}>
      <Header title="DASHBOARD" subtitle="Welcom to your dashboard" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          checkboxSelection
          rows={dataReport}
          columns={[
            { field: "id", headerName: "ID" },
            {
              field: "label",
              headerName: "Label",
            },
            { field: "reports", headerName: "Reports" },
          ]}
          // initialState={{
          //   pagination: {
          //     paginationModel: { page: 0, pageSize: 5 },
          //   },
          // }}
          // pageSizeOptions={[5, 10]}
        />
      </Box>
    </Box>
  );
}
