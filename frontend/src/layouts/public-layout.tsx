import { Outlet } from "react-router-dom";
import { Box } from "@mantine/core";

export function PublicLayout() {
  return (
    <Box component="main" role="main" aria-label="Public content">
      <Outlet />
    </Box>
  );
}
