import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/Header";

export default function dashboard() {
  return (
    <Box m={"20px"}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Header title="DASHBOARD" subtitle="Welcom to your dashboard" />
      </Box>
    </Box>
  );
}
