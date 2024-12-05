import React from "react";
import { Box, Tabs, Tab } from "@mui/material";

const SubNavbar = ({ currentTab, setCurrentTab }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#424242",
        display: "flex",
        justifyContent: "center",
        py: 1,
      }}
    >
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => setCurrentTab(newValue)}
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab
          label="Active"
          sx={{
            color: "white",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#616161",
              borderRadius: "8px",
            },
          }}
        />
        <Tab
          label="Archive"
          sx={{
            color: "white",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#616161",
              borderRadius: "8px",
            },
          }}
        />
      </Tabs>
    </Box>
  );
};

export default SubNavbar;