import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { Sidebar } from "../components/layout/sidebar";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { useUIStore } from "../stores/ui.store";

export function AdminLayout() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !sidebarOpen } }}
      footer={{ height: 40 }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <main role="main" aria-label="Admin content">
          <Outlet />
        </main>
      </AppShell.Main>

      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
