import { type ReactNode } from "react";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "lg",
  colors: {
    gray: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
    dark: [
      "#C8CCD1",
      "#A8ADB5",
      "#8B919A",
      "#6B7280",
      "#4B5563",
      "#374151",
      "#1F2937",
      "#111827",
      "#0D1117",
      "#0A0E14",
    ],
  },
});

function mapThemeToMantine(theme: string): "light" | "dark" | "auto" {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  return "auto";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const savedTheme = localStorage.getItem("theme") ?? "system";

  return (
    <MantineProvider theme={theme} defaultColorScheme={mapThemeToMantine(savedTheme)}>
      {children}
    </MantineProvider>
  );
}
